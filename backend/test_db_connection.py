from db_connection import get_db_connection

def test_connection():
    conn = get_db_connection()

    if conn is None:
        print("❌ Connection failed")
        return

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        print("✅ Database connected successfully:", result)
        cursor.close()
    except Exception as e:
        print("❌ Query failed:", e)
    finally:
        conn.close()
        print("🔒 Connection closed")

if __name__ == "__main__":
    test_connection()
