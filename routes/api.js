const express = require('express');
const router = express.Router();
const Url = require('../models/url');

// API tạo URL ngắn
router.post('/shorten', async (req, res) => {
  try {
    const { url, customCode } = req.body;
    const result = await Url.create(url, customCode);
    res.json({
      success: true,
      shortCode: result.shortCode,
      shortUrl: `${req.protocol}://${req.get('host')}/${result.shortCode}`
    });
  } catch (err) {
    res.status(400).json({ success: false, error: 'URL không hợp lệ' });
  }
});

// API lấy thông tin URL
router.get('/url/:code', async (req, res) => {
  try {
    const url = await Url.findByCode(req.params.code);
    if (url) {
      res.json({ success: true, url });
    } else {
      res.status(404).json({ success: false, error: 'Không tìm thấy URL' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

module.exports = router; 