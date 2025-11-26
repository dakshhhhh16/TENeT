from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "TENeT Backend is running"})

if __name__ == '__main__':
    print("Starting TENeT Backend on http://localhost:5000")
    app.run(debug=True, port=5000)
