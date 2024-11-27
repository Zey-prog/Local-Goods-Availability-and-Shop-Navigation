from flask import Flask, request, jsonify
from flask_cors import CORS
from fuzzywuzzy import fuzz
import pandas as pd
import numpy as np
import geocoder

app = Flask(__name__)
CORS(app)

# Load your CSV file
df = pd.read_csv('C:/Users/ASUS/Documents/APPDEV/Local-Goods-Availability-and-Shop-Navigation/datasets.csv')
sorted_products = sorted(df['PRODUCTS'].tolist())


class TernarySearchTree:
    class Node:
        def __init__(self, char):
            self.char = char
            self.left = None
            self.middle = None
            self.right = None
            self.is_end_of_word = False
            self.original_word = None

    def __init__(self):
        self.root = None
        
    def _insert(self, node, word, index, original_word):
        char = word[index]

        if node is None:
            node = self.Node(char)

        if char < node.char:
            node.left = self._insert(node.left, word, index, original_word)
        elif char > node.char:
            node.right = self._insert(node.right, word, index, original_word)
        else:
            if index + 1 < len(word):
                node.middle = self._insert(node.middle, word, index + 1, original_word)
            else:
                node.is_end_of_word = True
                node.original_word = original_word

        return node

    def insert(self, word, original_word):
        if word:
            self.root = self._insert(self.root, word, 0, original_word)

    def _collect(self, node, prefix, result):
        if node is None:
            return

        self._collect(node.left, prefix, result)

        if node.is_end_of_word:
            result.append(node.original_word)

        self._collect(node.middle, prefix + node.char, result)
        self._collect(node.right, prefix, result)

    def search(self, prefix):
        node = self.root
        index = 0

        while node is not None:
            char = prefix[index]

            if char < node.char:
                node = node.left
            elif char > node.char:
                node = node.right
            else:
                if index == len(prefix) - 1:
                    break
                index += 1
                node = node.middle

        # Collect all words that start with the prefix
        result = []
        if node and node.is_end_of_word:
            result.append(node.original_word)  # Return original word if exact match found

        if node:
            # Only collect suggestions that match the prefix
            self._collect(node.middle, prefix, result)
            
            
        return [word for word in result if word.lower().startswith(prefix.lower())]

# Initialize the TST and insert the product names
tst = TernarySearchTree()

for product in sorted_products:
    tst.insert(product.lower(), product)  # Pass both lowercased and original word

# Fuzzy search function
def fuzzy_search_suggestions(products, query, threshold=80):
    """
    Returns fuzzy suggestions for products based on similarity to the query.
    The threshold controls how similar the suggestions should be (0-100).
    """
    suggestions = []
    
    # Iterate over all products to find those that match the query fuzzily
    for product in products:
        similarity = fuzz.partial_ratio(query.lower(), product.lower())
        
        # Prioritize exact matches before applying fuzzy logic
        if product.lower().startswith(query.lower()):
            suggestions.append((product, 100))  # Exact match has the highest score
        elif similarity >= threshold:
            suggestions.append((product, similarity))
    
    # Sort suggestions by their similarity score in descending order
    suggestions.sort(key=lambda x: x[1], reverse=True)
    
    # Return only the product names (ignoring the similarity score)
    return [product for product, _ in suggestions]


@app.route('/search-container', methods=['GET'])
def search():
    # Get the query from the frontend
    query = request.args.get('query').lower()
    
    if query:
        # Perform TST-based prefix search
        tst_suggestions = tst.search(query)
        
        # Perform fuzzy search as a fallback for handling mistyped inputs
        fuzzy_suggestions = fuzzy_search_suggestions(sorted_products, query)
        
        # Combine both suggestion lists (TST results + fuzzy search results)
        combined_suggestions = list(set(tst_suggestions + fuzzy_suggestions))
        
        # Optionally, prioritize TST suggestions by placing them first
        return jsonify(combined_suggestions)
    
    return jsonify([])


@app.route('/product_details', methods=['GET'])
def product_details():
    # Get the product name from the request
    product_name = request.args.get('product')
    
    if not product_name:
        return jsonify({"error": "Product name is required"}), 400

    # Verify column names
    expected_columns = ['PRODUCTS', 'PRICE', 'STOCKS', 'CATEGORIES', 'MARKET', 'LATITUDE', 'LONGITUDE']
    for col in expected_columns:
        if col not in df.columns:
            return jsonify({"error": f"Column '{col}' not found in dataset"}), 500

    # Search for the product in the dataset
    product_info = df[df['PRODUCTS'].str.lower() == product_name.lower()]
    
    if product_info.empty:
        return jsonify({"error": "Product not found"}), 404
    
    # Convert data types to native Python types for JSON serialization
    product_details = {
        'product': product_info['PRODUCTS'].values[0],
        'price': product_info['PRICE'].values[0].item() if isinstance(product_info['PRICE'].values[0], np.int64) else product_info['PRICE'].values[0],
        'stocks': product_info['STOCKS'].values[0].item() if isinstance(product_info['STOCKS'].values[0], np.int64) else product_info['STOCKS'].values[0],
        'category': product_info['CATEGORIES'].values[0],
        'market': product_info['MARKET'].values[0],
        'latitude': product_info['LATITUDE'].values[0],
        'longitude': product_info['LONGITUDE'].values[0]
    }
    
    return jsonify(product_details)


if __name__ == '__main__':
    app.run(debug=True)
