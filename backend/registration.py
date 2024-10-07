from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import openpyxl
import os
import base64
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Define file paths
DATA_FILE = 'registrations.xlsx'
IMAGE_DIR = 'images'
DATA_FORM_FILE = 'data_form.xlsx'
ADMIN_LOGIN_FILE = 'adminLogin.xlsx'  # New file for frontend details

def initialize_workbook(file_path, headers):
    """Create an Excel file with headers if it does not exist."""
    if not os.path.exists(file_path):
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.append(headers)
        wb.save(file_path)
        print(f"Workbook created and saved as {file_path}")

def read_excel(file_path):
    """Read data from an Excel file."""
    if not os.path.exists(file_path):
        initialize_workbook(file_path, ['ID', 'Name', 'Start Date', 'End Date'])  # Adjust headers if needed
        return pd.DataFrame(columns=['ID', 'Name', 'Start Date', 'End Date'])
    df = pd.read_excel(file_path)
    return df

def write_excel(file_path, df):
    """Write data to an Excel file."""
    df.to_excel(file_path, index=False)

@app.route('/new-registration', methods=['POST'])
def new_registration():
    try:
        data = request.json
        print('Received data:', data)  # Log the received data to console

        df = read_excel(DATA_FILE)
        new_data = pd.DataFrame([data])
        df = pd.concat([df, new_data], ignore_index=True)
        write_excel(DATA_FILE, df)

        return jsonify({'message': 'Registration successful', 'data': data}), 200
    except Exception as e:
        print('Error processing request:', e)
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

@app.route('/get-new-registration', methods=['GET'])
def get_new_registration():
    try:
        df = read_excel(DATA_FILE)
        data = df.to_dict(orient='records')
        return jsonify(data), 200
    except Exception as e:
        print('Error processing request:', e)
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

@app.route('/upload-image', methods=['POST'])
def upload_image():
    try:
        data = request.json
        user_id = data.get('id')
        user_name = data.get('name')
        images = data.get('images', [])
        saved_images = []

        if not user_id or not user_name:
            return jsonify({'error': 'ID and Name are required.'}), 400

        user_dir = os.path.join(IMAGE_DIR, f'{user_name}_{user_id}')
        if not os.path.exists(user_dir):
            os.makedirs(user_dir)

        for idx, image_data in enumerate(images):
            image_base64 = image_data.split(',')[1]
            image_bytes = base64.b64decode(image_base64)
            image_path = os.path.join(user_dir, f'image_{idx + 1}.jpeg')

            with open(image_path, 'wb') as image_file:
                image_file.write(image_bytes)
            saved_images.append(image_path)

        return jsonify({'message': 'Images uploaded successfully', 'images': saved_images}), 200
    except Exception as e:
        print('Error processing request:', e)
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

@app.route('/main-program', methods=['GET'])
def main_program():
    return "hi11111111111111111...."

@app.route('/data-analysis', methods=['GET'])
def data_analysis():
    try:
        start_date_str = request.args.get('startDate')
        end_date_str = request.args.get('endDate')
        
        if not start_date_str or not end_date_str:
            raise ValueError("Missing 'startDate' or 'endDate' parameter")
        
        start_date = pd.to_datetime(start_date_str, format='%Y-%m-%d')
        end_date = pd.to_datetime(end_date_str, format='%Y-%m-%d')
        
        if not os.path.exists('LiveStorage.xlsx'):
            initialize_workbook('LiveStorage.xlsx', ['Date', 'Name'])
        
        df = pd.read_excel('LiveStorage.xlsx')
        
        if 'Date' not in df.columns:
            raise ValueError("The 'Date' column is missing from the Excel file")
        df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')
        
        filtered_df = df[(df['Date'] >= start_date) & (df['Date'] <= end_date)]
        counts = filtered_df.groupby('Date').size().to_dict()
        counts = {date.strftime('%Y-%m-%d'): count for date, count in counts.items()}
        
        return jsonify(counts)
    
    except Exception as e:
        traceback_str = traceback.format_exc()
        print(f"Error: {e}\nTraceback: {traceback_str}")
        return jsonify({"error": str(e)}), 500

@app.route('/get-data-analysis', methods=['GET'])
def get_data_analysis():
    try:
        if not os.path.exists(DATA_FORM_FILE):
            initialize_workbook(DATA_FORM_FILE, ['ID', 'Name', 'Start Date', 'End Date'])
        
        df = read_excel(DATA_FORM_FILE)
        data = df.to_dict(orient='records')
        return jsonify(data), 200
    except Exception as e:
        print('Error processing request:', e)
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

@app.route('/names-by-date', methods=['GET'])
def names_by_date():
    try:
        date_str = request.args.get('date')
        
        if not date_str:
            raise ValueError("Missing 'date' parameter")
        
        date = pd.to_datetime(date_str, format='%Y-%m-%d')
        
        if not os.path.exists('LiveStorage.xlsx'):
            initialize_workbook('LiveStorage.xlsx', ['Date', 'Name'])
        
        df = pd.read_excel('LiveStorage.xlsx')
        
        if 'Date' not in df.columns:
            raise ValueError("The 'Date' column is missing from the Excel file")
        df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')
        
        filtered_df = df[df['Date'] == date]
        names = filtered_df['Name'].tolist()
        
        return jsonify(names)
    
    except Exception as e:
        traceback_str = traceback.format_exc()
        print(f"Error: {e}\nTraceback: {traceback_str}")
        return jsonify({"error": str(e)}), 500
     

@app.route('/unknown-data-analysis', methods=['GET'])
def unknown_data_analysis():
    try:
        start_date_str = request.args.get('startDate')
        end_date_str = request.args.get('endDate')

        if not start_date_str or not end_date_str:
            raise ValueError("Missing 'startDate' or 'endDate' parameter")

        start_date = pd.to_datetime(start_date_str, format='%Y-%m-%d')
        end_date = pd.to_datetime(end_date_str, format='%Y-%m-%d')

        if not os.path.exists('Unknown_DataBase.xlsx'):
            initialize_workbook('Unknown_DataBase.xlsx', ['Date', 'Name'])

        df = pd.read_excel('Unknown_DataBase.xlsx')

        if 'Date' not in df.columns:
            raise ValueError("The 'Date' column is missing from the Excel file")
        df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')

        filtered_df = df[(df['Date'] >= start_date) & (df['Date'] <= end_date)]
        counts = filtered_df.groupby('Date').size().to_dict()
        counts = {date.strftime('%Y-%m-%d'): count for date, count in counts.items()}

        return jsonify(counts)

    except Exception as e:
        traceback_str = traceback.format_exc()
        print(f"Error: {e}\nTraceback: {traceback_str}")
        return jsonify({"error": str(e)}), 500

@app.route('/save-admin-details', methods=['POST'])
def save_admin_details():
    """Endpoint to save frontend admin login details."""
    try:
        admin_data = request.json
        print('Received admin data:', admin_data)  # Log the received data to console

        df = read_excel(ADMIN_LOGIN_FILE)
        new_data = pd.DataFrame([admin_data])
        df = pd.concat([df, new_data], ignore_index=True)
        write_excel(ADMIN_LOGIN_FILE, df)

        return jsonify({'message': 'Admin details saved successfully', 'data': admin_data}), 200
    except Exception as e:
        print('Error processing request:', e)
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
