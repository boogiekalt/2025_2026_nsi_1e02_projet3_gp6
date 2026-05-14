from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(
    __name__,
    static_folder='static',
    template_folder='templates'
)

DATA_FILE = os.path.join('data', 'save.json')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/circuit1')
def circuit1():
    return render_template('circuit1.html')

@app.route('/circuit2')
def circuit2():
    return render_template('circuit2.html')

@app.route('/circuit3')
def circuit3():
    return render_template('circuit3.html')

@app.route('/api/save', methods=['POST'])
def save_data():
    data = request.json
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f)
    return jsonify({"status": "success"})

@app.route('/api/load', methods=['GET'])
def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
        except json.JSONDecodeError:
            data = {"x": 50, "y": 300}
    else:
        data = {"x": 50, "y": 300}
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
