const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));


// =======================
// MYSQL
// =======================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('RDS Connected');
  }
});


// =======================
// AWS S3
// =======================

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
});


// =======================
// POST PENGADUAN
// =======================

app.post('/pengaduan', upload.single('file'), (req, res) => {

  const { nama, deskripsi } = req.body;

  const file_url = req.file.location;

  const sql =
    'INSERT INTO pengaduan (nama, deskripsi, file_url) VALUES (?, ?, ?)';

  db.query(sql, [nama, deskripsi, file_url], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Database error'
      });
    }

    res.json({
      message: 'Pengaduan berhasil dikirim'
    });
  });
});


// =======================
// GET PENGADUAN
// =======================

app.get('/pengaduan', (req, res) => {

  db.query('SELECT * FROM pengaduan ORDER BY id DESC', (err, results) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });
});


// =======================
// FRONTEND
// =======================

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// =======================

app.listen(5000, () => {
  console.log('Server running on port 5000');
});