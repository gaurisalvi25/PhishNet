import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS

from features.url_features import extract_url_features

app = Flask(__name__)
CORS(app)

# Load trained model
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data or "url" not in data:
        return jsonify({"error": "URL not provided"}), 400

    url = data["url"]

    # Extract features
    features = extract_url_features(url)
    prediction = model.predict([features])[0]
    probability = model.predict_proba([features])[0].max()

    return jsonify({
        "url": url,
        "prediction": int(prediction),   # 0 or 1
        "confidence": round(float(probability), 3)
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
