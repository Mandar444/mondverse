@app.route("/save_stress", methods=["POST"])
def save_stress():
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO stress_records (user_id, stress_level, source)
        VALUES (%s, %s, %s)
        """,
        (data["user_id"], data["stress_level"], data.get("source", "Manual"))
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Stress record saved"})
