-- Initialize the time_tracking_app database and create the timesheets table
CREATE DATABASE IF NOT EXISTS time_tracking_app;
USE time_tracking_app;

CREATE TABLE IF NOT EXISTS timesheets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(255) NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
