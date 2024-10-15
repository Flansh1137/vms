from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import base64
import pickle
import traceback
import mysql.connector
import pandas as pd  # Added to handle dates from the requests
from openpyxl import load_workbook

app = Flask(__name__)
CORS(app)

DATA_FILE = 'NewRegistration.xlsx'
DATA_FORM_FILE = 'DataFormAnalysis.json'
IMAGE_DIR = 'images'

# Initialize registration data file
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as file:
        json.dump([], file)

# Initialize data form file
if not os.path.exists(DATA_FORM_FILE):
    with open(DATA_FORM_FILE, 'w') as file:
        json.dump([], file)

# Ensure image directory exists
if not os.path.exists(IMAGE_DIR):
    os.makedirs(IMAGE_DIR)

def getconnection():
    """Establish a database connection."""
    try:
        mydb = mysql.connector.connect(
            host="xbit.c3i4g8kgexgt.us-east-1.rds.amazonaws.com",
            user="admin",
            password="December2020",
            database="myDB"
        )
        print("Database connection established FLANSH.")
        return mydb
    except mysql.connector.Error as err:
        print("Database connection error:", err)
        return None

mydb = getconnection()

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the API!'})

@app.route('/new-registration', methods=['POST'])
def new_registration():
    try:
        data = request.json
        print('Received data:', data)

        id = data.get('id')
        name = data.get('name')
        phone = data.get("phone")
        age = data.get("age")
        bloodGroup = data.get("bloodGroup")
        height = data.get("height")
        weight = data.get("weight")
        address = data.get("address")
        emergencyContact = data.get("emergencyContact")
        
        print(name)
        registration_data = [[id, name, phone, age, bloodGroup, height, weight, address, emergencyContact]]
        wb = load_workbook(DATA_FILE)
        ws = wb.active
        for row in registration_data:
            ws.append(row)
        wb.save(DATA_FILE)

        mycursor = mydb.cursor()
        sql = "INSERT INTO Members (id, member_name, phone, age, bloodgroup, height, weight, address, emergencyContact) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        val = (id, name, phone, age, bloodGroup, height, weight, address, emergencyContact)
        mycursor.execute(sql, val)
        mydb.commit()

        return jsonify({'message': 'Registration successful', 'data': registration_data}), 200
    except Exception as e:
        print('Error processing request:', e)
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/upload-image', methods=['POST'])
def upload_image():
    try:
        data = request.json
        user_id = data.get('id')
        user_name = data.get('name')
        images = data.get('images', [])
        saved_images = []
        simages = []

        # Check if user_id and user_name are not None
        if not user_id or not user_name:
            return jsonify({'error': 'ID and Name are required.'}), 400

        user_dir = os.path.join(IMAGE_DIR, f'{user_name}_{user_id}')
        if not os.path.exists(user_dir):
            os.makedirs(user_dir)

        for idx, image_data in enumerate(images):
            image_base64 = image_data.split(',')[1]
            image_bytes = base64.b64decode(image_base64)
            image_path = os.path.join(user_dir, f'image_{idx + 1}.jpeg')
            simages.append(image_bytes)
            serialized_data = pickle.dumps(simages)
            with open(image_path, 'wb') as image_file:
                image_file.write(image_bytes)
            saved_images.append(image_path)

        mycursor = mydb.cursor()
        sql = "UPDATE Members SET images = %s WHERE id = %s AND member_name = %s"
        val = (serialized_data, user_id, user_name)
        mycursor.execute(sql, val)
        mydb.commit()

        return jsonify({'message': 'Images uploaded successfully', 'images': saved_images}), 200
    except Exception as e:
        print('Error processing request:', e)
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/unknown-data-analysis', methods=['GET'])
def unknown_data_analysis():
    try:
        start_date_str = request.args.get('startDate')
        end_date_str = request.args.get('endDate')

        if not start_date_str or not end_date_str:
            return jsonify({'error': 'startDate and endDate are required'}), 400

        # Ensure database connection
        mydb = getconnection()
        if mydb is None:
            return jsonify({'error': 'Failed to connect to the database'}), 500

        mycursor = mydb.cursor()

        # Query the MySQL database
        sql = '''
        SELECT DATE(DATE_TIME) AS date, COUNT(DISTINCT UNKNOWN_NAME) AS unique_count
        FROM UNKNOWN_DB
        WHERE DATE(DATE_TIME) BETWEEN %s AND %s
        GROUP BY DATE(DATE_TIME)
        '''
        mycursor.execute(sql, (start_date_str, end_date_str))
        results = mycursor.fetchall()

        # Process results into a dictionary
        date_unique_count_dict = {str(row[0]): row[1] for row in results}

        return jsonify(date_unique_count_dict), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/data-analysis', methods=['GET'])
def data_analysis():
    try:
        start_date_str = request.args.get('startDate')
        end_date_str = request.args.get('endDate')
        
        if not start_date_str or not end_date_str:
            return jsonify({'error': 'startDate and endDate are required'}), 400

        mydb = getconnection()
        if mydb is None:
            return jsonify({'error': 'Failed to connect to the database'}), 500

        mycursor = mydb.cursor()

        sql = '''
        SELECT DATE(DATE_TIME) AS date, COUNT(DISTINCT MEM_NAME) AS unique_count
        FROM LIVEVIDEODATA
        WHERE DATE(DATE_TIME) BETWEEN %s AND %s
        GROUP BY DATE(DATE_TIME)
        '''
        mycursor.execute(sql, (start_date_str, end_date_str))
        results = mycursor.fetchall()

        date_unique_count_dict = {str(row[0]): row[1] for row in results}

        return jsonify(date_unique_count_dict), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/known-images-by-date', methods=['GET'])
def known_images_by_date():
    global mydb
    try:
        date_str = request.args.get('date')
        
        if not date_str:
            raise ValueError("Missing 'date' parameter")

        date = pd.to_datetime(date_str, format='%Y-%m-%d').date()

        if not mydb or not mydb.is_connected():
            mydb = getconnection()
        
        if not mydb:
            return jsonify({"error": "Database connection failed"}), 500

        mycursor = mydb.cursor()

        sql = 'SELECT DISTINCT KNOWN_IMAGE, MEM_NAME FROM LIVEVIDEODATA WHERE DATE(DATE_TIME)=%s'
        mycursor.execute(sql, (date,))
        results = mycursor.fetchall()

        # Convert image bytes to base64 and store names
        images_with_names = [{'image': base64.b64encode(img).decode('utf-8'), 'name': mem_name} for (img, mem_name) in results]

        return jsonify(images_with_names), 200

    except Exception as e:
        traceback_str = traceback.format_exc()
        print(f"Error: {e}\nTraceback: {traceback_str}")
        return jsonify({"error": str(e)}), 500

@app.route('/unknown-images-by-date', methods=['GET'])
def unknown_images_by_date():
    global mydb
    try:
        date_str = request.args.get('date')
        
        if not date_str:
            raise ValueError("Missing 'date' parameter")

        date = pd.to_datetime(date_str, format='%Y-%m-%d').date()

        if not mydb or not mydb.is_connected():
            mydb = getconnection()
        
        if not mydb:
            return jsonify({"error": "Database connection failed"}), 500

        mycursor = mydb.cursor()

        sql = 'SELECT DISTINCT UNKNOWN_IMAGE, UNKNOWN_NAME FROM UNKNOWN_DB WHERE DATE(DATE_TIME)=%s'
        mycursor.execute(sql, (date,))
        results = mycursor.fetchall()

        # Convert image bytes to base64 and store names
        images_with_names = [{'image': base64.b64encode(img).decode('utf-8'), 'name': unknown_name} for (img, unknown_name) in results]

        return jsonify(images_with_names), 200

    except Exception as e:
        traceback_str = traceback.format_exc()
        print(f"Error: {e}\nTraceback: {traceback_str}")
        return jsonify({"error": str(e)}), 500

@app.route('/names-by-date', methods=['GET'])
def names_by_date():
    global mydb
    try:
        date_str = request.args.get('date')
        
        if not date_str:
            raise ValueError("Missing 'date' parameter")

        date = pd.to_datetime(date_str, format='%Y-%m-%d').date()

        if not mydb or not mydb.is_connected():
            mydb = getconnection()
        
        if not mydb:
            return jsonify({"error": "Database connection failed"}), 500

        mycursor = mydb.cursor()

        sql = 'SELECT DISTINCT MEM_NAME FROM LIVEVIDEODATA WHERE DATE(DATE_TIME)=%s'
        mycursor.execute(sql, (date,))
        results = mycursor.fetchall()

        names = [row[0] for row in results]

        return jsonify(names), 200

    except Exception as e:
        traceback_str = traceback.format_exc()
        print(f"Error: {e}\nTraceback: {traceback_str}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
