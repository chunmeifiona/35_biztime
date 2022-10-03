const ExpressError = require("../expressError");
const express = require('express');
const slugify = require("slugify");
const router = new express.Router();
const db = require('../db')


router.get('/', async (req, res, next) => {
    //listing all industries, which should show the company code(s) for that industry
    try {
        const results = await db.query(`SELECT ind.industry, c.code FROM industries AS ind
        LEFT JOIN industries_companies AS incomp ON (ind.code=incomp.industry_code)
        LEFT JOIN companies AS c ON (incomp.comp_code=c.code)`);
        return res.json({ industries: results.rows });
    } catch (e) {
        next(e);
    }
})

router.post('/', async (req, res, next) => {
    // adding an industry
    try {
        const { code, industry } = req.body;
        const slufigyCode = slugify(code, {
            replacement: '-',  // replace spaces with replacement character, defaults to `-`
            remove: /[!@#^*(){},.?~+]/g, // remove characters that match regex, defaults to `undefined`
            lower: true,      // convert to lower case, defaults to `false`
            trim: true         // trim leading and trailing replacement chars, defaults to `true`
        });
        const results = await db.query(`INSERT INTO industries (code, industry) 
        VALUES ($1, $2) RETURNING code, industry`, [slufigyCode, industry]);
        return res.status(201).json({ industry: results.rows[0] });
    } catch (e) {
        next(e);
    }
})

router.post('/:code', async (req, res, next) => {
    // associating an industry to a company
    try {
        const industry_code = req.params.code;
        const { comp_code } = req.body;
        const results = await db.query(`INSERT INTO industries_companies (comp_code, industry_code) 
        VALUES ($1, $2) RETURNING comp_code, industry_code`, [comp_code, industry_code]);
        return res.status(201).json({ industry: results.rows[0] });
    } catch (e) {
        next(e);
    }
})



module.exports = router;