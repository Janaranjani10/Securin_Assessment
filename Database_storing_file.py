from pymongo import MongoClient
import json
def json_file_to_Save_in_db():
    client_side = MongoClient("mongodb://localhost:27017/")
    db = client_side["Securin_project"]
    cve_collection = db["cves"]
    try:
        with open("cve.json", "r") as file:
            json_file = json.load(file)
            cve_data = json_file.get("vulnerabilities", [])
            res = cve_collection.insert_many(cve_data)

            print(f"{len(res.inserted_ids)} file inserted into the database.")
    except Exception as exp:
        print(f"Error storing JSON file to the database: {exp}")
json_file_to_Save_in_db()
