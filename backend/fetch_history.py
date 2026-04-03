@app.route("/history/<int:user_id>", methods=["GET"])
def history(user_id):
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

    history = [
        {
            "stress_level": r[0],
            "source": r[1],
            "time": str(r[2])
        }
        for r in rows
    ]

    return jsonify(history)
