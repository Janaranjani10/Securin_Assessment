def cleanfun(file_data):
    cleaned_cve_data = []  
    seen_ids = set()   
    for i in file_data:
    
        if 'CVE_ID' not in i or i['CVE_ID'] is None:
            continue 

        id = i['CVE_ID']
        if id in seen_ids:
            continue 
        else:
            seen_ids.add(id)
        clean_entry = {key: value for key, value in i.items() if value is not None}
        cleaned_cve_data.append(clean_entry)
    print("Cleaning process is done successfully.")
    return cleaned_cve_data
data = cleanfun('cve.json')#your json file name
print("Cleaned the CVE data:", data)