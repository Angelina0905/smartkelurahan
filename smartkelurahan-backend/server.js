const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));


// =======================
// RDS CONNECTION
// =======================

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(() => {
    console.log('RDS Connected');
});


// =======================
// AWS S3 CONFIG
// =======================

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();


// =======================
// MULTER S3
// =======================

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
});


// =======================
// UPLOAD ROUTE
// =======================

app.post('/upload', upload.single('file'), (req, res) => {

    const fileUrl = req.file.location;

    const sql = `
        INSERT INTO pengaduan (nama, deskripsi, file_url)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            req.body.nama,
            req.body.deskripsi,
            fileUrl
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            res.json({
                success: true,
                fileUrl
            });
        }
    );
});


// =======================
// FRONTEND
// =======================

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// =======================
// SERVER
// =======================

app.listen(5000, () => {
    console.log('Server running');
});