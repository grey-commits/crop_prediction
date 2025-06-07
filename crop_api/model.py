import joblib
import pandas as pd
from app.schemas import CropInput, CropOutput, CropRecommendation

model = joblib.load("app/models/crop_model.pkl")
scaler = joblib.load("app/models/crop_scaler.pkl")
label_encoder = joblib.load("app/models/crop_label_encoder.pkl")

def predict(input_data: CropInput) -> CropOutput:
    # Convert input to DataFrame for scaling
    df = pd.DataFrame([input_data.dict()])
    
    # Scale input features
    scaled_features = scaler.transform(df)
    
    # Predict probabilities
    probs = model.predict_proba(scaled_features)[0]
    
    crops = label_encoder.classes_
    
    # Pair crops with probabilities and sort descending
    sorted_crops = sorted(zip(crops, probs), key=lambda x: x[1], reverse=True)
    
    # Prepare top 5 recommendations
    recommendations = [
        CropRecommendation(crop=crop, probability=round(prob * 100, 2))
        for crop, prob in sorted_crops[:5]
    ]
    
    return CropOutput(recommendations=recommendations)

from fastapi import FastAPI
from app.schemas import CropInput, CropOutput
from app.model import predict

app = FastAPI(title="Crop Recommendation API")

@app.post("/predict", response_model=CropOutput)
async def get_recommendation(data: CropInput):
    """
    Accepts soil and weather parameters and returns crop recommendations.
    """
    return predict(data)