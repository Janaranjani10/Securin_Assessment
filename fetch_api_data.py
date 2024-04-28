import requests
import json
def Save_the_fetched_data():
    base_url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
    try:
        response_url = requests.get(base_url)
        if response_url.status_code == 200:
            print("API is connected successfully!.")
            json_file = response_url.json()
            # Create and save the json file
            with open("cve.json", "w") as file:
                json.dump(json_file, file, indent=4)
            print("CVE data saved to cve.json successfully")
        else:
            print(f"Failed to fetch data from API and the Status code is: {response_url.status_code}")
    except Exception as exp:
        print(f"Error occured fetching data from API: {exp}")
Save_the_fetched_data()#function called to fetch and save
