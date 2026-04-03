import requests

url = "http://127.0.0.1:8000/register"

data = {
    "name": "Damini",
    "email": "damini@test.com",
    "password": "12345"
}

response = requests.post(url, json=data)
print(response.json())
