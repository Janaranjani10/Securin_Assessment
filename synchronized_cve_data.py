
import requests
import json
from pymongo import MongoClient
from datetime import datetime

def cve_sync(cve_data):
    try:
        client = MongoClient("mongodb://localhost:27017/")
        db = client["securin"] 
        cve_collection = db["CVE"]

        for cve in cve_data:
            cve_id = cve.get("cve", {}).get("CVE_data_meta", {}).get("ID")
            existing_cve = cve_collection.find_one({"cve.CVE_data_meta.ID": cve_id})
            if existing_cve:
                cve["_id"] = existing_cve["_id"]
                cve_collection.replace_one({"_id": existing_cve["_id"]}, cve)
                print(f"Updated the CVE data in the database.")
            else:
                cve_collection.insert_one(cve)
                print(f"Inserted new CVE {cve_id} into the database.")

        print("CVE data is synchronized to the database successfully.")
    except Exception as exp:
        print(f"Error syncing CVE data to database: {exp}")

def fetching():
    base_url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
    try:
        response = requests.get(base_url)
        if response.status_code == 200:
            print("API connected successfully.")
            return response.json().get("vulnerabilities", [])
        else:
            print(f"Failed to fetch data and  Status code: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []


def main():
    cve_data = fetching()
    if cve_data:
       cve_sync(cve_data)
    else:
        print("No CVE data fetched and Sync process cancelled.")

if __name__ == "__main__":
    main()
