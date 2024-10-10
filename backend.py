from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import geocoder

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your CSV and other code here
df = pd.read_csv('C:/Users/user/Documents/MODULES/APPDEV/Application/datasets.csv')
sorted_products = sorted(df['Prince_Hypermart'].tolist())

# Define your binary search function and routes as before...
#test

def binary_search_suggestions(products, query):
    """Returns suggestions for products starting with the query."""
    low, high = 0, len(products) - 1
    suggestions = []
    
    while low <= high:
        mid = (low + high) // 2
        product = products[mid].lower()
        
        if product.startswith(query.lower()):
            # Expand the search to find all matching products
            suggestions.append(products[mid])
            # Find other matching products around the mid-point
            i = mid - 1
            while i >= 0 and products[i].lower().startswith(query.lower()):
                suggestions.append(products[i])
                i -= 1
            i = mid + 1
            while i < len(products) and products[i].lower().startswith(query.lower()):
                suggestions.append(products[i])
                i += 1
            break
        elif query.lower() < product:
            high = mid - 1
        else:
            low = mid + 1
    
    return sorted(suggestions)


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
    query = request.args.get('query')
    
    if query:
        suggestions = binary_search_suggestions(sorted_products, query)
        return jsonify(suggestions)
    
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
