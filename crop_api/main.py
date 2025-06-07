from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI()

# Load model and preprocessors
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(BASE_DIR, "model/crop_recommendation_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "model/crop_recommendation_scaler.pkl"))
label_encoder = joblib.load(os.path.join(BASE_DIR, "model/crop_recommendation_label_encoder.pkl"))

# Define input schema
class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

@app.post("/predict")
def predict_crop(data: CropInput):
    input_array = np.array([[data.N, data.P, data.K, data.temperature,
                             data.humidity, data.ph, data.rainfall]])
    input_scaled = scaler.transform(input_array)
    probabilities = model.predict_proba(input_scaled)[0] * 100
    crops = label_encoder.classes_
    prediction = dict(sorted(zip(crops, probabilities), key=lambda x: x[1], reverse=True))
    return {"prediction": prediction}
