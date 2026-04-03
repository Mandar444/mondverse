import psycopg2

def get_db_connection():
    """
    Creates and returns a PostgreSQL database connection
    (JDBC-style direct connectivity)
    """
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="stress_detection_db",
            user="postgres",
            password="postgre123"
        )
        return conn
    except Exception as e:
        print("❌ Database connection error:", e)
        return None
