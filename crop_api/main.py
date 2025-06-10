from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os
import joblib
import matplotlib.pyplot as plt
import io

app = FastAPI(title="Crop Recommendation API")

# Define input model for prediction
class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

# Load model and related objects
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILE = os.path.join(BASE_DIR, 'crop_recommendation_model.pkl')
SCALER_FILE = os.path.join(BASE_DIR, 'crop_recommendation_scaler.pkl')
LABEL_FILE = os.path.join(BASE_DIR, 'crop_recommendation_label_encoder.pkl')

try:
    model = joblib.load(MODEL_FILE)
    scaler = joblib.load(SCALER_FILE)
    label_encoder = joblib.load(LABEL_FILE)
except FileNotFoundError:
    raise Exception("Model files not found. Please run crop_recommendation.py to train the model first.")

def validate_input(data: CropInput):
    """Validate input ranges"""
    feature_ranges = {
        'N': (0, 200), 'P': (0, 100), 'K': (0, 200),
        'temperature': (0, 50), 'humidity': (0, 100),
        'ph': (4, 9), 'rainfall': (0, 500)
    }
    for field, value in data.dict().items():
        min_val, max_val = feature_ranges[field]
        if not (min_val <= value <= max_val):
            raise HTTPException(
                status_code=422,
                detail=f"{field} must be between {min_val} and {max_val}"
            )
    return data

def get_predictions(data: CropInput):
    """Get model predictions with probabilities"""
    user_data = pd.DataFrame([data.dict()])
    user_data_scaled = scaler.transform(user_data)
    probabilities = model.predict_proba(user_data_scaled)[0] * 100
    class_names = label_encoder.classes_
    crop_probs = dict(zip(class_names, probabilities))
    sorted_probs = sorted(crop_probs.items(), key=lambda x: x[1], reverse=True)
    return sorted_probs[:5]

def create_bar_chart(top_5):
    """Create bar chart for top 5 predictions"""
    plt.figure(figsize=(10, 6))
    crops, probs = zip(*top_5)
    plt.bar(crops, probs)
    plt.title('Top 5 Crop Recommendations')
    plt.xlabel('Crops')
    plt.ylabel('Probability (%)')
    plt.xticks(rotation=45)
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    plt.close()
    buffer.seek(0)
    return buffer

def create_pie_chart(top_5):
    """Create pie chart for top 5 predictions"""
    plt.figure(figsize=(8, 8))
    crops, probs = zip(*top_5)
    plt.pie(probs, labels=crops, autopct='%1.1f%%', startangle=140)
    plt.title('Top 5 Recommended Crops')
    plt.axis('equal')
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    plt.close()
    buffer.seek(0)
    return buffer

# API Endpoints
@app.post("/predict")
async def predict_crop(data: CropInput):
    """Get top 5 crop predictions with probabilities"""
    try:
        validate_input(data)
        top_5 = get_predictions(data)
        return {
            "predictions": [
                {"crop": crop, "probability": f"{prob:.2f}%"} 
                for crop, prob in top_5
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/bar_chart")
async def get_bar_chart(data: CropInput):
    """Generate bar chart of top 5 predictions"""
    try:
        validate_input(data)
        top_5 = get_predictions(data)
        buffer = create_bar_chart(top_5)
        return StreamingResponse(
            buffer,
            media_type="image/png",
            headers={"Content-Disposition": "inline; filename=bar_chart.png"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/pie_chart")
async def get_pie_chart(data: CropInput):
    """Generate pie chart of top 5 predictions"""
    try:
        validate_input(data)
        top_5 = get_predictions(data)
        buffer = create_pie_chart(top_5)
        return StreamingResponse(
            buffer,
            media_type="image/png",
            headers={"Content-Disposition": "inline; filename=pie_chart.png"}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)