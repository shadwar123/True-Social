# -*- coding: utf-8 -*-
"""
Created on Thu Feb  1 17:14:52 2024

@author: shadw
"""
import numpy as np
import pickle
from tensorflow.keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
from flask import Flask, request, jsonify
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={'/*': {'origins': '*'}})

class model_input:
    def __init__(self, content):
        self.content = content

#loading the model
loaded_model = load_model('your_model.h5')
loaded_tokenizer = pickle.load(open('tokenizer.sav', 'rb'))

@app.route('/fake_news_prediction', methods=['POST'])
def news_pred():
    input_data = request.get_json()
    input_parameters = model_input(**input_data)
    
    # Extracting text from input parameters
    text = [input_parameters.content]
    
    text = loaded_tokenizer.texts_to_sequences(text)
    text = pad_sequences(text,maxlen=1000)
    
    # Making predictions
    prediction = loaded_model.predict(text)
    
    if np.any(prediction >= 0.5):
        result = 'Real news'
    else:
        result = 'Fake news'
    
    return jsonify({'prediction': float(prediction[0, 0]), 'result': result})

if __name__ == '__main__':
    app.run(debug=False)
