const express = require('express');
const router = express.Router();

router.get("/admin/categories/create", (req, res) => {
    res.render('admin/createCategories');
});

module.exports = router;