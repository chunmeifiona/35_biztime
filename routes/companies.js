const ExpressError = require("../expressError");
const express = require('express');
const router = new express.Router();
const db = require('../db')

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM biztime`);
        return res.json({ companies: results.rows });
    } catch (e) {
        next(e);
    }
})

module.exports = router;