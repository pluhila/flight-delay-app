import os
import pickle
import csv
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load model from ../data/model.pkl
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'model.pkl')
print(f"Loading model from: {MODEL_PATH}")
if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
else:
    model = None

# Load airport data from ../data/airports.csv
AIRPORTS_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'airports.csv')
airports = []
try:
    with open(AIRPORTS_PATH, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            airports.append({'id': row['OriginAirportID'], 'name': row['OriginAirportName']})
except Exception as e:
    print(f"Error loading airports: {e}")
    airports = []

# Load all flight data from ../data/flights.csv
FLIGHTS_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'flights.csv')
flights = []
try:
    with open(FLIGHTS_PATH, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            flights.append(row)
except Exception as e:
    print(f"Error loading flights: {e}")
    flights = []

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    airport_id = int(data.get('airport_id'))
    day_of_week = int(data.get('day_of_week'))
    if model:
        try:
            # Predict using the loaded model
            prediction = model.predict_proba([[day_of_week, airport_id]])[0]
            # Extract certainty and delay from prediction
            certainty = float(prediction[0])
            delay = float(prediction[1])
            print(f"Prediction: certainty={certainty}, delay={delay}")
            return jsonify({'certainty': certainty, 'delay': delay})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        print("No model loaded, using mock prediction.")
        delay = 0.25
        certainty = 0.85
    return jsonify({
        'delay': delay,
        'certainty': certainty
    })

@app.route('/airports', methods=['GET'])
def get_airports():
    sorted_airports = sorted(airports, key=lambda x: x['name'])
    return jsonify(sorted_airports)

@app.route('/data', methods=['GET'])
def get_data():
    return jsonify(flights)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)