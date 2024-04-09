
import json
import requests

# Load the data from the file
with open('dataset-extra1.json') as f:
    data = json.load(f)

with open('dataset-extra2.json') as g:
    data += json.load(g)

with open('dataset-extra3.json') as h:
    data += json.load(h)

# Join the data into a single object


# Send a POST request for each record in the data
for record in data:
    response = requests.post('http://localhost:7777/pessoas', json=record)

    # Check if the request was successful
    if response.status_code != 200:
        print(f"Failed to add record: {response.content}")
print("All records added successfully")
