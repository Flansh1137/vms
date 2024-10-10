import mysql.connector
from sqlDB import mydb

def get_image(start_date_str, end_date_str):

    mycursor=mydb.cursor()
    try:
        sql = 'SELECT DATE(DATE_TIME) AS date, COUNT(DISTINCT UNKNOWN_NAME) AS unique_count, UNKNOWN_IMAGE, UNKNOWN_NAME FROM UNKNOWN_DB WHERE DATE(DATE_TIME) BETWEEN %s AND %s GROUP BY DATE(DATE_TIME)'
        mycursor.execute(sql, (start_date_str, end_date_str))
        results = mycursor.fetchall()
        for row in results:
            date=row[0]
            count=row[1]
            img=row[2]
            name=row[3]

            if img:
                with open (f'img_{name}.jpg', 'wb') as f:
                    f.write(img)
            print(f'Date: {date}, Unique Count: {count}')
    except Exception as e:
        print(f"Error: {e}")


start_date='2024-10-02'
end_date='2024-10-09'
get_image('2024-10-08', '2024-10-10')
