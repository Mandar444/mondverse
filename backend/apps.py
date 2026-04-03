from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db_connection import get_db_connection

app = Flask(__name__)

# ----------------------------------
# 1️⃣ REGISTER USER API
# ----------------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    hashed_password = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"message": "User already exists"}), 409

    # Insert new user
    cursor.execute(
        """
        INSERT INTO users (name, email, password)
        VALUES (%s, %s, %s)
        RETURNING id
        """,
        (name, email, hashed_password)
    )

    user_id = cursor.fetchone()[0]
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "User registered successfully",
        "user_id": user_id
    })


# ----------------------------------
# 2️⃣ LOGIN USER API
# ----------------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, password FROM users WHERE email = %s",
        (email,)
    )
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user and check_password_hash(user[1], password):
        return jsonify({
            "message": "Login successful",
            "user_id": user[0]
        })
    else:
        return jsonify({"message": "Invalid email or password"}), 401


# ----------------------------------
# 3️⃣ SAVE STRESS SCORE API
# ----------------------------------
@app.route("/save_stress", methods=["POST"])
def save_stress():
    data = request.json

    user_id = data.get("user_id")
    stress_level = data.get("stress_level")
    source = data.get("source", "Self Reported")

    if not user_id or stress_level is None:
        return jsonify({"message": "User ID and stress level required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO stress_records (user_id, stress_level, source)
        VALUES (%s, %s, %s)
        """,
        (user_id, stress_level, source)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Stress record saved successfully"})


# ----------------------------------
# 4️⃣ FETCH STRESS HISTORY API
# ----------------------------------
@app.route("/history/<int:user_id>", methods=["GET"])
def get_history(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT stress_level, source, created_at
        FROM stress_records
        WHERE user_id = %s
        ORDER BY created_at DESC
        """,
        (user_id,)
    )

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    history = []
    for r in rows:
        history.append({
            "stress_level": r[0],
            "source": r[1],
            "time": str(r[2])
        })

    return jsonify(history)


# ----------------------------------
# RUN SERVER
# ----------------------------------
if __name__ == "__main__":
    print("🚀 Starting Stress Detection Bot Backend (JDBC Style)...")
    app.run(host="127.0.0.1", port=8000, debug=True)
