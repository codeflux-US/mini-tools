import os
from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN")

CORS(app)

@app.route('/')
def home():
    return "Backend Running 🚀"

@app.route('/fetch')
def fetch_site():
    url = request.args.get('url')

    if not url:
        return jsonify({"error": "URL required"}), 400

    # 🔐 Safe origin check
    origin = request.headers.get("Origin")
    if origin and origin != ALLOWED_ORIGIN:
        return jsonify({"error": "Blocked"}), 403

    try:
        res = requests.get(url, timeout=8)

        soup = BeautifulSoup(res.text, 'html.parser')

        css = [link.get('href') for link in soup.find_all('link')]
        js = [script.get('src') for script in soup.find_all('script')]

        return jsonify({
            "html": res.text,
            "css": css,
            "js": js,
            "status": res.status_code
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
