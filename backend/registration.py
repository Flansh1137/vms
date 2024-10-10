# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# import openpyxl
# import os
# import base64
# import traceback

# app = Flask(__name__)
# CORS(app)  # Enable CORS for the entire app

# # Define file paths
# DATA_FILE = 'registrations.xlsx'
# IMAGE_DIR = 'images'
# DATA_FORM_FILE = 'data_form.xlsx'
# ADMIN_LOGIN_FILE = 'adminLogin.xlsx'  # New file for frontend details

# def initialize_workbook(file_path, headers):
#     """Create an Excel file with headers if it does not exist."""
#     if not os.path.exists(file_path):
#         wb = openpyxl.Workbook()
#         ws = wb.active
#         ws.append(headers)
#         wb.save(file_path)
#         print(f"Workbook created and saved as {file_path}")

# def read_excel(file_path):
#     """Read data from an Excel file."""
#     if not os.path.exists(file_path):
#         initialize_workbook(file_path, ['ID', 'Name', 'Start Date', 'End Date'])  # Adjust headers if needed
#         return pd.DataFrame(columns=['ID', 'Name', 'Start Date', 'End Date'])
#     df = pd.read_excel(file_path)
#     return df

# def write_excel(file_path, df):
#     """Write data to an Excel file."""
#     df.to_excel(file_path, index=False)

# @app.route('/new-registration', methods=['POST'])
# def new_registration():
#     try:
#         data = request.json
#         print('Received data:', data)  # Log the received data to console

#         df = read_excel(DATA_FILE)
#         new_data = pd.DataFrame([data])
#         df = pd.concat([df, new_data], ignore_index=True)
#         write_excel(DATA_FILE, df)

#         return jsonify({'message': 'Registration successful', 'data': data}), 200
#     except Exception as e:
#         print('Error processing request:', e)
#         return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# @app.route('/get-new-registration', methods=['GET'])
# def get_new_registration():
#     try:
#         df = read_excel(DATA_FILE)
#         data = df.to_dict(orient='records')
#         return jsonify(data), 200
#     except Exception as e:
#         print('Error processing request:', e)
#         return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# @app.route('/upload-image', methods=['POST'])
# def upload_image():
#     try:
#         data = request.json
#         user_id = data.get('id')
#         user_name = data.get('name')
#         images = data.get('images', [])
#         saved_images = []

#         if not user_id or not user_name:
#             return jsonify({'error': 'ID and Name are required.'}), 400

#         user_dir = os.path.join(IMAGE_DIR, f'{user_name}_{user_id}')
#         if not os.path.exists(user_dir):
#             os.makedirs(user_dir)

#         for idx, image_data in enumerate(images):
#             image_base64 = image_data.split(',')[1]
#             image_bytes = base64.b64decode(image_base64)
#             image_path = os.path.join(user_dir, f'image_{idx + 1}.jpeg')

#             with open(image_path, 'wb') as image_file:
#                 image_file.write(image_bytes)
#             saved_images.append(image_path)

#         return jsonify({'message': 'Images uploaded successfully', 'images': saved_images}), 200
#     except Exception as e:
#         print('Error processing request:', e)
#         return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# @app.route('/main-program', methods=['GET'])
# def main_program():
#     return "hi11111111111111111...."

# @app.route('/data-analysis', methods=['GET'])
# def data_analysis():
#     try:
#         start_date_str = request.args.get('startDate')
#         end_date_str = request.args.get('endDate')
        
#         if not start_date_str or not end_date_str:
#             raise ValueError("Missing 'startDate' or 'endDate' parameter")
        
#         start_date = pd.to_datetime(start_date_str, format='%Y-%m-%d')
#         end_date = pd.to_datetime(end_date_str, format='%Y-%m-%d')
        
#         if not os.path.exists('LiveStorage.xlsx'):
#             initialize_workbook('LiveStorage.xlsx', ['Date', 'Name'])
        
#         df = pd.read_excel('LiveStorage.xlsx')
        
#         if 'Date' not in df.columns:
#             raise ValueError("The 'Date' column is missing from the Excel file")
#         df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')
        
#         filtered_df = df[(df['Date'] >= start_date) & (df['Date'] <= end_date)]
#         counts = filtered_df.groupby('Date').size().to_dict()
#         counts = {date.strftime('%Y-%m-%d'): count for date, count in counts.items()}
        
#         return jsonify(counts)
    
#     except Exception as e:
#         traceback_str = traceback.format_exc()
#         print(f"Error: {e}\nTraceback: {traceback_str}")
#         return jsonify({"error": str(e)}), 500

# @app.route('/get-data-analysis', methods=['GET'])
# def get_data_analysis():
#     try:
#         if not os.path.exists(DATA_FORM_FILE):
#             initialize_workbook(DATA_FORM_FILE, ['ID', 'Name', 'Start Date', 'End Date'])
        
#         df = read_excel(DATA_FORM_FILE)
#         data = df.to_dict(orient='records')
#         return jsonify(data), 200
#     except Exception as e:
#         print('Error processing request:', e)
#         return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# @app.route('/names-by-date', methods=['GET'])
# def names_by_date():
#     try:
#         date_str = request.args.get('date')
        
#         if not date_str:
#             raise ValueError("Missing 'date' parameter")
        
#         date = pd.to_datetime(date_str, format='%Y-%m-%d')
        
#         if not os.path.exists('LiveStorage.xlsx'):
#             initialize_workbook('LiveStorage.xlsx', ['Date', 'Name'])
        
#         df = pd.read_excel('LiveStorage.xlsx')
        
#         if 'Date' not in df.columns:
#             raise ValueError("The 'Date' column is missing from the Excel file")
#         df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')
        
#         filtered_df = df[df['Date'] == date]
#         names = filtered_df['Name'].tolist()
        
#         return jsonify(names)
    
#     except Exception as e:
#         traceback_str = traceback.format_exc()
#         print(f"Error: {e}\nTraceback: {traceback_str}")
#         return jsonify({"error": str(e)}), 500
     

# @app.route('/unknown-data-analysis', methods=['GET'])
# def unknown_data_analysis():
#     try:
#         start_date_str = request.args.get('startDate')
#         end_date_str = request.args.get('endDate')

#         if not start_date_str or not end_date_str:
#             raise ValueError("Missing 'startDate' or 'endDate' parameter")

#         start_date = pd.to_datetime(start_date_str, format='%Y-%m-%d')
#         end_date = pd.to_datetime(end_date_str, format='%Y-%m-%d')

#         if not os.path.exists('Unknown_DataBase.xlsx'):
#             initialize_workbook('Unknown_DataBase.xlsx', ['Date', 'Name'])

#         df = pd.read_excel('Unknown_DataBase.xlsx')

#         if 'Date' not in df.columns:
#             raise ValueError("The 'Date' column is missing from the Excel file")
#         df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')

#         filtered_df = df[(df['Date'] >= start_date) & (df['Date'] <= end_date)]
#         counts = filtered_df.groupby('Date').size().to_dict()
#         counts = {date.strftime('%Y-%m-%d'): count for date, count in counts.items()}

#         return jsonify(counts)

#     except Exception as e:
#         traceback_str = traceback.format_exc()
#         print(f"Error: {e}\nTraceback: {traceback_str}")
#         return jsonify({"error": str(e)}), 500

# @app.route('/save-admin-details', methods=['POST'])
# def save_admin_details():
#     """Endpoint to save frontend admin login details."""
#     try:
#         admin_data = request.json
#         print('Received admin data:', admin_data)  # Log the received data to console

#         df = read_excel(ADMIN_LOGIN_FILE)
#         new_data = pd.DataFrame([admin_data])
#         df = pd.concat([df, new_data], ignore_index=True)
#         write_excel(ADMIN_LOGIN_FILE, df)

#         return jsonify({'message': 'Admin details saved successfully', 'data': admin_data}), 200
#     except Exception as e:
#         print('Error processing request:', e)
#         return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=5000, debug=True)






# # from flask import Flask, request, jsonify
# # from flask_cors import CORS
# # import pandas as pd
# # import openpyxl
# # import os
# # import base64
# # import mysql.connector  # Importing mysql.connector for MySQL database access
# # import traceback

# # app = Flask(__name__)
# # CORS(app)  # Enable CORS for the entire app

# # # Define file paths
# # DATA_FILE = 'registrations.xlsx'
# # IMAGE_DIR = 'images'
# # DATA_FORM_FILE = 'data_form.xlsx'
# # ADMIN_LOGIN_FILE = 'adminLogin.xlsx'  # New file for frontend details

# # def initialize_workbook(file_path, headers):
# #     """Create an Excel file with headers if it does not exist."""
# #     if not os.path.exists(file_path):
# #         wb = openpyxl.Workbook()
# #         ws = wb.active
# #         ws.append(headers)
# #         wb.save(file_path)
# #         print(f"Workbook created and saved as {file_path}")

# # def read_excel(file_path):
# #     """Read data from an Excel file."""
# #     if not os.path.exists(file_path):
# #         initialize_workbook(file_path, ['ID', 'Name', 'Start Date', 'End Date'])  # Adjust headers if needed
# #         return pd.DataFrame(columns=['ID', 'Name', 'Start Date', 'End Date'])
# #     df = pd.read_excel(file_path)
# #     return df

# # def write_excel(file_path, df):
# #     """Write data to an Excel file."""
# #     df.to_excel(file_path, index=False)

# # def get_db_connection():
# #     """Function to establish a connection with the MySQL database."""
# #     try:
# #         mydb = mysql.connector.connect(
# #             host="xbit.c3i4g8kgexgt.us-east-1.rds.amazonaws.com",
# #             user="admin",
# #             password="December2020",
# #             database="myDB"
# #         )
# #         if mydb.is_connected():
# #             print("Successfully connected to the database")
# #         return mydb
# #     except mysql.connector.Error as e:
# #         print(f"Error connecting to MySQL: {e}")
# #         return None

# # @app.route('/new-registration', methods=['POST'])
# # def new_registration():
# #     try:
# #         data = request.json
# #         print('Received data:', data)  # Log the received data to console

# #         # Save registration data in an Excel file
# #         df = read_excel(DATA_FILE)
# #         new_data = pd.DataFrame([data])
# #         df = pd.concat([df, new_data], ignore_index=True)
# #         write_excel(DATA_FILE, df)

# #         return jsonify({'message': 'Registration successful', 'data': data}), 200
# #     except Exception as e:
# #         print('Error processing request:', e)
# #         return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# # @app.route('/get-new-registration', methods=['GET'])
# # def get_new_registration():
# #     try:
# #         df = read_excel(DATA_FILE)
# #         data = df.to_dict(orient='records')
# #         return jsonify(data), 200
# #     except Exception as e:
# #         print('Error processing request:', e)
# #         return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# # @app.route('/upload-image', methods=['POST'])
# # def upload_image():
# #     try:
# #         data = request.json
# #         user_id = data.get('id')
# #         user_name = data.get('name')
# #         images = data.get('images', [])
# #         saved_images = []

# #         if not user_id or not user_name:
# #             return jsonify({'error': 'ID and Name are required.'}), 400

# #         user_dir = os.path.join(IMAGE_DIR, f'{user_name}_{user_id}')
# #         if not os.path.exists(user_dir):
# #             os.makedirs(user_dir)

# #         for idx, image_data in enumerate(images):
# #             image_base64 = image_data.split(',')[1]
# #             image_bytes = base64.b64decode(image_base64)
# #             image_path = os.path.join(user_dir, f'image_{idx + 1}.jpeg')

# #             with open(image_path, 'wb') as image_file:
# #                 image_file.write(image_bytes)
# #             saved_images.append(image_path)

# #         return jsonify({'message': 'Images uploaded successfully', 'images': saved_images}), 200
# #     except Exception as e:
# #         print('Error processing request:', e)
# #         return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# # @app.route('/data-analysis', methods=['GET'])
# # def data_analysis():
# #     try:
# #         # Get startDate and endDate from the query parameters
# #         start_date_str = request.args.get('startDate')
# #         end_date_str = request.args.get('endDate')
        
# #         if not start_date_str or not end_date_str:
# #             raise ValueError("Missing 'startDate' or 'endDate' parameter")
        
# #         # Convert to datetime format
# #         start_date = pd.to_datetime(start_date_str, format='%Y-%m-%d')
# #         end_date = pd.to_datetime(end_date_str, format='%Y-%m-%d')

# #         # Connect to the MySQL database
# #         mydb = get_db_connection()
# #         if mydb:
# #             cursor = mydb.cursor(dictionary=True)
            
# #             # Fetch data from the MySQL database
# #             query = """
# #             SELECT * FROM registrations 
# #             WHERE start_date >= %s AND end_date <= %s
# #             """
# #             cursor.execute(query, (start_date_str, end_date_str))
# #             result = cursor.fetchall()
            
# #             cursor.close()
# #             mydb.close()

# #             # Transform the result into a dict and return it as JSON
# #             return jsonify(result), 200
# #         else:
# #             return jsonify({'error': 'Failed to connect to the database'}), 500
    
# #     except Exception as e:
# #         print(f"Error processing request: {e}")
# #         return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# # @app.route('/get-data-analysis', methods=['GET'])
# # def get_data_analysis():
# #     try:
# #         if not os.path.exists(DATA_FORM_FILE):
# #             initialize_workbook(DATA_FORM_FILE, ['ID', 'Name', 'Start Date', 'End Date'])
        
# #         df = read_excel(DATA_FORM_FILE)
# #         data = df.to_dict(orient='records')
# #         return jsonify(data), 200
# #     except Exception as e:
# #         print('Error processing request:', e)
# #         return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# # @app.route('/names-by-date', methods=['GET'])
# # def names_by_date():
# #     try:
# #         date_str = request.args.get('date')
        
# #         if not date_str:
# #             raise ValueError("Missing 'date' parameter")
        
# #         date = pd.to_datetime(date_str, format='%Y-%m-%d')
        
# #         if not os.path.exists('LiveStorage.xlsx'):
# #             initialize_workbook('LiveStorage.xlsx', ['Date', 'Name'])
        
# #         df = pd.read_excel('LiveStorage.xlsx')
        
# #         if 'Date' not in df.columns:
# #             raise ValueError("The 'Date' column is missing from the Excel file")
# #         df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')
        
# #         filtered_df = df[df['Date'] == date]
# #         names = filtered_df['Name'].tolist()
        
# #         return jsonify(names)
    
# #     except Exception as e:
# #         traceback_str = traceback.format_exc()
# #         print(f"Error: {e}\nTraceback: {traceback_str}")
# #         return jsonify({"error": str(e)}), 500
     
# # @app.route('/unknown-data-analysis', methods=['GET'])
# # def unknown_data_analysis():
# #     try:
# #         start_date_str = request.args.get('startDate')
# #         end_date_str = request.args.get('endDate')

# #         if not start_date_str or not end_date_str:
# #             raise ValueError("Missing 'startDate' or 'endDate' parameter")

# #         start_date = pd.to_datetime(start_date_str, format='%Y-%m-%d')
# #         end_date = pd.to_datetime(end_date_str, format='%Y-%m-%d')

# #         if not os.path.exists('Unknown_DataBase.xlsx'):
# #             initialize_workbook('Unknown_DataBase.xlsx', ['Date', 'Name'])

# #         df = pd.read_excel('Unknown_DataBase.xlsx')

# #         if 'Date' not in df.columns:
# #             raise ValueError("The 'Date' column is missing from the Excel file")
# #         df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')

# #         filtered_df = df[(df['Date'] >= start_date) & (df['Date'] <= end_date)]
# #         counts = filtered_df.groupby('Date').size().to_dict()
# #         counts = {date.strftime('%Y-%m-%d'): count for date, count in counts.items()}

# #         return jsonify(counts)

# #     except Exception as e:
# #         traceback_str = traceback.format_exc()
# #         print(f"Error: {e}\nTraceback: {traceback_str}")
# #         return jsonify({"error": str(e)}), 500

# # @app.route('/save-admin-details', methods=['POST'])
# # def save_admin_details():
# #     """Endpoint to save frontend admin login details."""
# #     try:
# #         admin_data = request.json
# #         print('Received admin data:', admin_data)  # Log the received data to console

# #         df = read_excel(ADMIN_LOGIN_FILE)
# #         new_data = pd.DataFrame([admin_data])
# #         df = pd.concat([df, new_data], ignore_index=True)
# #         write_excel(ADMIN_LOGIN_FILE, df)

# #         return jsonify({'message': 'Admin details saved successfully', 'data': admin_data}), 200
# #     except Exception as e:
# #         print('Error saving admin details:', e)
# #         return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# # if __name__ == '__main__':
# #     initialize_workbook(DATA_FILE, ['ID', 'Name', 'Start Date', 'End Date'])  # Initialize on startup
# #     initialize_workbook(ADMIN_LOGIN_FILE, ['ID', 'Username', 'Password'])  # Initialize admin login file on startup
# #     app.run(debug=True)
























from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import base64
import pickle
import traceback
import mysql.connector
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

# @app.route('/unknown-data-analysis', methods=['GET'])
# def unknown_data_analysis():
#     date_unique_count_dict={}
#     try:
#         global mydb
#         # Get start and end dates from query parameters
#         start_date_str = request.args.get('startDate')
#         end_date_str = request.args.get('endDate')
        
#         if not start_date_str or not end_date_str:
#             raise ValueError("Missing 'startDate' or 'endDate' parameter")
       
#         if not mydb.is_connected():
#             mydb = getconnection()
#         mycursor = mydb.cursor()
        
#         # Prepare your SQL statement with placeholders
#         try:
#             sql = 'SELECT DATE(DATE_TIME) AS date, COUNT(DISTINCT UNKNOWN_NAME) AS unique_count FROM UNKNOWN_DB WHERE DATE(DATE_TIME) BETWEEN %s AND %s GROUP BY DATE(DATE_TIME)'
#             mycursor.execute(sql, (start_date_str, end_date_str))
#             results = mycursor.fetchall()
#             print("unknownnnnnnn ", results)
            
#             date_unique_count_dict = {date.strftime('%Y-%m-%d'): count for date, count in results}
#             #date_unique_count_dict = {row[0].strftime('%Y-%m-%d'): row[1] for row in results}
            
#         except Exception as e:
#             print("An error occurred:", e)       
        
#     except Exception as e:
#         # Log the error with traceback
#         traceback_str = traceback.format_exc()
#         print(f"Error: {e}\nTraceback: {traceback_str}")
#         return jsonify({"error": str(e)}), 500
#     return jsonify(date_unique_count_dict)

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


# @app.route('/data-analysis', methods=['GET'])
# def data_analysis():
#     date_unique_count_dict={}
#     try:
#         global mydb
#         # Get start and end dates from query parameters
#         start_date_str = request.args.get('startDate')
#         end_date_str = request.args.get('endDate')
        
#         if not start_date_str or not end_date_str:
#             raise ValueError("Missing 'startDate' or 'endDate' parameter")
       
#         if not mydb.is_connected():
#             mydb = getconnection()
#         mycursor = mydb.cursor()
        
#         # Prepare your SQL statement with placeholders
#         try:
#             sql = 'SELECT DATE(DATE_TIME) AS date, COUNT(DISTINCT MEM_NAME) AS unique_count FROM LIVEVIDEODATA WHERE DATE(DATE_TIME) BETWEEN %s AND %s GROUP BY DATE(DATE_TIME)'
#             mycursor.execute(sql, (start_date_str, end_date_str))
#             results = mycursor.fetchall()
        
            
#             date_unique_count_dict = {date.strftime('%Y-%m-%d'): count for date, count in results}
#             #date_unique_count_dict = {row[0].strftime('%Y-%m-%d'): row[1] for row in results}
            
#         except Exception as e:
#             print("An error occurred:", e)       
        
#     except Exception as e:
#         # Log the error with traceback
#         traceback_str = traceback.format_exc()
#         print(f"Error: {e}\nTraceback: {traceback_str}")
#         return jsonify({"error": str(e)}), 500
#     return jsonify(date_unique_count_dict)

@app.route('/data-analysis', methods=['GET'])
def data_analysis():
    date_unique_count_dict = {}
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




@app.route('/names-by-date', methods=['GET'])
def names_by_date():
    global mydb
    try:
        # Get the date from query parameters
        date_str = request.args.get('date')
        
        if not date_str:
            raise ValueError("Missing 'date' parameter")

        # Convert date to datetime object
        date = pd.to_datetime(date_str, format='%Y-%m-%d').date()  # Use .date() to get a date object

        # Ensure database connection
        if not mydb or not mydb.is_connected():
            mydb = getconnection()
        
        if not mydb:
            return jsonify({"error": "Database connection failed"}), 500

        mycursor = mydb.cursor()

        # SQL query to fetch distinct names for the specific date
        sql = 'SELECT DISTINCT MEM_NAME FROM LIVEVIDEODATA WHERE DATE(DATE_TIME) = %s'
    
        # Debugging: Print the SQL and parameters
        print("Executing SQL:", sql)
        print("With parameter:", date)

        # Execute the SQL query
        mycursor.execute(sql, (date,))  # Ensure to pass the date as a tuple

        results = mycursor.fetchall()

        # Debugging: Print the results
        print("names==", results)

        # Extract names from the results
        names = [row[0] for row in results]  # Assuming MEM_NAME is the first column

        return jsonify(names)

    except Exception as e:
        # Log the error with traceback
        traceback_str = traceback.format_exc()
        print(f"Error: {e}\nTraceback: {traceback_str}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
