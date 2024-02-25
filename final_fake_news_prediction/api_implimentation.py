# -*- coding: utf-8 -*-
"""
Created on Thu Feb  1 17:43:25 2024
@author: shadw
"""

import json
import requests

url = 'http://127.0.0.1:5000/fake_news_prediction'     # flask
#url = 'http://127.0.0.1:8000/fake_news_prediction'    # Fast api uvicorn
#url = 'https://prediction-ggmcerqf3q-el.a.run.app'    # Google Cloud
input_data = {
    'content': 'Finance Minister Nirmala Sitharaman will be presenting the interim Union Budget 2024 on February 1, Thursday. One of the most significant parts of the Parliament Budget session is the presentation of the Economic Survey on January 31.'
}

# Convert input data to JSON format
input_json = json.dumps(input_data)

# Send POST request with JSON data
response = requests.post(url, json=input_data)

# Print response
print("Response:", response.text)
