// API tiket untuk pelanggan: ambil nomor dan lihat posisi.
const express = require('express');
const crypto = require('crypto');
const { pool } = require('../db');

const router = express.Router();

