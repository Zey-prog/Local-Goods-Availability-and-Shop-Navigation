from flask import Flask, request, jsonify
from flask_cors import CORS
from fuzzywuzzy import fuzz
import pandas as pd
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


@app.route('/location')
def get_location():
    # Get the location based on IP
    g = geocoder.ip('me')
    location = {
        'latitude': g.latlng[0],
        'longitude': g.latlng[1]
    }
    
    # Return the location as JSON
    return jsonify(location)

@app.route('/search', methods=['GET'])
def search():
    # Get the query from the frontend
    query = request.args.get('query').lower()  # Convert query to lowercase
    
    if query:
        # Perform TST-based prefix search
        tst_suggestions = tst.search(query)
        
        # Perform fuzzy search as a fallback if needed
        fuzzy_suggestions = fuzzy_search_suggestions(sorted_products, query)
        
        # Combine both suggestion lists (you can prioritize TST results if needed)
        combined_suggestions = list(set(tst_suggestions + fuzzy_suggestions))
        # Filter combined suggestions to only include those that start with the query
        combined_suggestions = [product for product in combined_suggestions if product.lower().startswith(query.lower())]
        
        return jsonify(combined_suggestions)
    
    return jsonify([])


if __name__ == '__main__':
    app.run(debug=True)
