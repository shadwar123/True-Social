# -*- coding: utf-8 -*-
"""
Created on Thu Feb  1 17:14:52 2024

@author: shadw
"""
import numpy as np
import pickle
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class model_input(BaseModel):
    content: str

#loading the model
loaded_model = load_model('your_model.h5')
loaded_tokenizer = pickle.load(open('tokenizer.sav', 'rb'))

@app.post('/fake_news_prediction')
def news_pred(input_parameters : model_input):
    
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
    
    return {'prediction': float(prediction[0, 0]), 'result': result}
    
#x = ['']


