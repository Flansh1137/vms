import mysql.connector

mydb=mysql.connector.connect(
    host="xbit.c3i4g8kgexgt.us-east-1.rds.amazonaws.com",
    user="admin",
    password="December2020",
    database="myDB"
)

if mydb.is_connected():
        print("Successfully connected to the database")
        
        # Create a cursor object
        mycursor = mydb.cursor()
        
        # Example query to show databases
        mycursor.execute("SHOW DATABASES")
        databases = mycursor.fetchall()
        print(databases)
        
'''
if mydb.is_connected():
        mycursor.close()
        mydb.close()
        print("MySQL connection is closed")
        '''