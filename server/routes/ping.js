const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {res.send(<p>System is working!</p>)});

module.exports = router;