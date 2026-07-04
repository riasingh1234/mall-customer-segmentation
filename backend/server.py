from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

kmeans = joblib.load("../src/kmeans_model.pkl")
scaler = joblib.load("../src/scaler.pkl")


@app.route("/")
def home():
    return "Customer Segmentation API Running"


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    age = data["age"]
    income = data["income"]
    spending = data["spending"]

    input_data = np.array([[age, income, spending]])
    scaled_data = scaler.transform(input_data)

    cluster = kmeans.predict(scaled_data)[0]

    return jsonify({
    "cluster": int(cluster)
})


if __name__ == "__main__":
    app.run(debug=True, port=5000)