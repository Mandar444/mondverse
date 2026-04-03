const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✅ MySQL Database connected successfully');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        connection.release();
    })
    .catch(err => {
        console.error('❌ MySQL connection failed:', err.message);
        console.error('Make sure MySQL is running and credentials are correct');
        // process.exit(1);
    });

async function initializeDatabase() {
    const queries = [
        // 1. Users Table
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            display_name VARCHAR(100),
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('user', 'psychiatrist', 'admin') DEFAULT 'user',
            psychiatrist_id INT NULL,
            phone VARCHAR(20),
            is_active TINYINT(1) DEFAULT 1,
            deleted_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (psychiatrist_id) REFERENCES users(id) ON DELETE SET NULL
        )`,

        // 2. Chat Sessions
        `CREATE TABLE IF NOT EXISTS chat_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ended_at TIMESTAMP NULL,
            avg_stress_score FLOAT DEFAULT 0,
            sentiment_label ENUM('positive', 'neutral', 'negative'),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

        // 3. Messages
        `CREATE TABLE IF NOT EXISTS messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            session_id INT NOT NULL,
            sender ENUM('user', 'bot') NOT NULL,
            content TEXT NOT NULL,
            sentiment_score FLOAT DEFAULT 0,
            stress_score FLOAT DEFAULT 0,
            flagged_keywords JSON NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (session_id),
            INDEX (created_at),
            FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
        )`,

        // 4. Stress Logs
        `CREATE TABLE IF NOT EXISTS stress_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            score FLOAT NOT NULL,
            source ENUM('chat', 'quiz', 'face') DEFAULT 'chat',
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (user_id, logged_at),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

        // 5. Quiz Results
        `CREATE TABLE IF NOT EXISTS quiz_results (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            quiz_id INT NOT NULL,
            score INT NOT NULL,
            answers JSON NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

        // 6. Emergency Alerts
        `CREATE TABLE IF NOT EXISTS emergency_alerts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            trigger_type ENUM('stress_threshold', 'keyword') NOT NULL,
            severity ENUM('high', 'critical') DEFAULT 'high',
            notified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP NULL,
            notes TEXT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,

        // 7. User Preferences
        `CREATE TABLE IF NOT EXISTS user_preferences (
            user_id INT PRIMARY KEY,
            voice_enabled TINYINT(1) DEFAULT 0,
            voice_name VARCHAR(100),
            autoplay TINYINT(1) DEFAULT 0,
            theme ENUM('light', 'dark') DEFAULT 'light',
            notifications_enabled TINYINT(1) DEFAULT 1,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`
    ];

    try {
        for (const query of queries) {
            await pool.query(query);
        }
        console.log('✅ MindBridge Database initialized with PRD v1.0.0 schema');
    } catch (error) {
        console.error('❌ Database Initialization Failed:', error.message);
        throw error;
    }
}

// Ensure the pool is ready before initializing
pool.getConnection()
    .then(async (connection) => {
        connection.release();
        await initializeDatabase();
    })
    .catch(err => {
        console.error('❌ Initial Database Connection Error:', err.message);
    });

module.exports = pool;