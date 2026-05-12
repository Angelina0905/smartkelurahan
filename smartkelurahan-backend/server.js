const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(() => {
    console.log('RDS Connected');
});

app.get('/', (req, res) => {
    res.send('SmartKelurahan Backend Jalan');
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(5000, () => {
    console.log('Server running');
});