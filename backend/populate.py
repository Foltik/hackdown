import json
import requests

companies = [{
    'name': 'Google',
    'logo': 'static/google.png',
}]

for c in companies:
    print(f"Populating {c['name']}...")
    requests.post('http://localhost:8000/populate', data=json.dumps(c))
