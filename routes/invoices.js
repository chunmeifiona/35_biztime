const ExpressError = require("../expressError");
const express = require('express');
const router = new express.Router();

router.get('/', (req, res) => {
    res.send("hello")
})

module.exports = router;