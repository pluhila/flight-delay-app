from flask import Flask, request, jsonify
import pickle
import pandas as pd
import os

app = Flask(__name__)

# Load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../data/model.pkl')
model = pickle.load(open(MODEL_PATH, 'rb'))

# Load airports CSV
AIRPORTS_CSV = os.path.join(os.path.dirname(__file__), '../data/airports.csv')

def get_airports():
    df = pd.read_csv(AIRPORTS_CSV)
    airports = df.drop_duplicates().sort_values('DestAirportName')
    return [
        {'id': int(row['DestAirportID']), 'name': row['DestAirportName']}
        for _, row in airports.iterrows()
    ]

@app.route('/predict', methods=['GET'])
def predict():
    """
    Expects query params: day_of_week (int), airport_id (int)
    Returns: JSON with 'delay' (probability) and 'certainty' (probability of not delayed)
    """
    try:
        day_of_week = int(request.args.get('day_of_week'))
        airport_id = int(request.args.get('airport_id'))
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid or missing parameters'}), 400
    proba = model.predict_proba([[day_of_week, airport_id]])[0]
    return jsonify({'certainty': float(proba[0]), 'delay': float(proba[1])})

@app.route('/airports', methods=['GET'])
def airports():
    """
    Returns: JSON list of airports (id, name), sorted alphabetically by name
    """
    return jsonify(get_airports())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
