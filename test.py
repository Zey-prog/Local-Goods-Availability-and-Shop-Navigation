import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)
# Specify the encoding while reading the CSV
df = pd.read_csv('C:/Users/user/Documents/MODULES/APPDEV/Application/datasets.csv')
sorted_products = sorted(df['Prince_Hypermart'].tolist())

print(df.head())
print(sorted_products)
