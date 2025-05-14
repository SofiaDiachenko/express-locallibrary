var express = require('express');
var router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/catalog");
});

// Новий маршрут /my-page
router.get('/my-page', (req, res) => {
  res.render('my_page', {
    title: 'My route',
    items: ['Element 1', 'Element 2', 'Element 3']
  });
});

module.exports = router;
