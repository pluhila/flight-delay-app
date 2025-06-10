"""
API server to expose flight delay prediction and airport list.
"""

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import numpy as np
import joblib
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and airport data at startup
MODEL_PATH = "/Users/taneltallo/Documents/testing/flight-delay-app/solution/random_forest_flight_delay_model.joblib"
DATA_PATH = "./data/flights.csv"

# Load model
model = joblib.load(MODEL_PATH)

# Load airport data
flight_data_df = pd.read_csv(DATA_PATH, usecols=["OriginAirportID", "OriginAirportName"])
airports_df = flight_data_df.drop_duplicates().sort_values("OriginAirportName")

class PredictionRequest(BaseModel):
    day_of_week: int
    airport_id: int

@app.get("/airports")
def get_airports():
    airports = [
        {"id": int(row["OriginAirportID"]), "name": row["OriginAirportName"]}
        for _, row in airports_df.iterrows()
    ]
    return {"airports": airports}

@app.post("/predict")
def predict_delay(request: PredictionRequest):
    # Prepare input for the model (dummy example, adjust as needed)
    # You may need to match the model's expected input features
    input_df = pd.DataFrame([{
        "DayOfWeek": request.day_of_week,
        "OriginAirportID": request.airport_id
    }])

    # Add missing columns with zeros if needed (avoid fragmentation)
    missing_cols = [col for col in model.feature_names_in_ if col not in input_df.columns]
    if missing_cols:
        zeros_df = pd.DataFrame(0, index=input_df.index, columns=missing_cols)
        input_df = pd.concat([input_df, zeros_df], axis=1)
    input_df = input_df[model.feature_names_in_].copy()  # De-fragment the DataFrame

    pred = float(model.predict(input_df)[0])
    # Calculate standard deviation of predictions from all trees as a proxy for confidence
    tree_preds = np.array([tree.predict(input_df)[0] for tree in model.estimators_])
    std = float(np.std(tree_preds))
    # Convert std to a confidence score: higher std = lower confidence
    confidence = float(1 / (1 + std))
    return {
        "predicted_delay": pred,
        "confidence": confidence
    }
@app.get("/")
def read_root():
    return {"message": "Welcome to the Flight Delay Prediction API. Use /predict for predictions and /airports for airport list."}
@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": True, "airports_loaded": not airports_df.empty}
