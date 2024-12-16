const express = require('express');
const router = express.Router();
const Url = require('../models/url');

// Trang chủ
router.get('/', async (req, res) => {
  try {
    const history = await Url.getHistory();
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    res.render('index', { 
      history,
      baseUrl
    });
  } catch (err) {
    res.render('index', { history: [] });
  }
});

// Tạo URL ngắn
router.post('/shorten', async (req, res) => {
  try {
    const { url, customCode } = req.body;
    const result = await Url.create(url, customCode);
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    res.json({
      success: true,
      shortCode: result.shortCode,
      shortUrl: `${baseUrl}/${result.shortCode}`
    });
  } catch (err) {
    res.status(400).json({ success: false, error: 'URL không hợp lệ' });
  }
});

// Chuyển hướng URL ngắn
router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findByCode(req.params.code);
    if (url) {
      await Url.incrementClicks(req.params.code);
      res.redirect(url.original_url);
    } else {
      res.status(404).render('404');
    }
  } catch (err) {
    res.status(500).render('error');
  }
});

// Trang thống kê
router.get('/stats/:code', async (req, res) => {
  try {
    const url = await Url.findByCode(req.params.code);
    if (url) {
      res.render('stats', { url });
    } else {
      res.status(404).render('404');
    }
  } catch (err) {
    res.status(500).render('error');
  }
});

module.exports = router; 