from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)  # เปิดใช้งาน CORS เพื่อให้ React สามารถเรียก API ได้

API_URL = "https://api.findip.net"
TOKEN = "c8c8313f10c8467fbf476591de4022e9"

@app.route('/api/ip', methods=['GET'])
def get_ip_info():
    ip_address = request.args.get('ip')
    if not ip_address:
        return jsonify({"error": "IP address is required"}), 400

    url = f"{API_URL}/{ip_address}/?token={TOKEN}"
    response = requests.get(url)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch data from findip.net"}), response.status_code


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
