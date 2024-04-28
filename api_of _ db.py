from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app_name = Flask(__name__)
CORS(app_name)
client = MongoClient("mongodb://localhost:27017/")
db = client["securin"]  
collection = db["CVE"]  

@app_name.route("/api/cve")
def get_cve_data():
    cve_data = list(collection.find({}, {"_id": 0}))  
    return jsonify({"vulnerabilities": cve_data})
if __name__ == "__main__":
    app_name.run(debug=True)
