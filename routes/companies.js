const ExpressError = require("../expressError");
const express = require('express');
const slugify = require("slugify");
const router = new express.Router();
const db = require('../db')


router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: results.rows });
    } catch (e) {
        next(e);
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`SELECT c.code, c.name, c.description, i.id, ind.industry
                                    FROM companies AS c 
                                    LEFT JOIN invoices AS i ON (c.code=i.comp_code) 
                                    LEFT JOIN industries_companies AS incomp ON (c.code=incomp.comp_code)
                                    LEFT JOIN industries AS ind ON (incomp.industry_code=ind.code) 
                                    WHERE c.code=$1`, [code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can not find company with code of ${code}`, 404)
        }
        const data = results.rows;
        const invoiceList = [...new Set(data.map(v => v.id))];
        const industryList = [...new Set(data.map(v => v.industry))];

        const company = {
            code: data[0].code,
            name: data[0].name,
            description: data[0].description,
            invoices: invoiceList,
            industries: industryList
        }
        return res.json({ company: company });
    } catch (e) {
        next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const slufigyCode = slugify(code, {
            replacement: '-',  // replace spaces with replacement character, defaults to `-`
            remove: /[!@#^*(){},.?~+]/g, // remove characters that match regex, defaults to `undefined`
            lower: true,      // convert to lower case, defaults to `false`
            trim: true         // trim leading and trailing replacement chars, defaults to `true`
        });
        const results = await db.query(`INSERT INTO companies (code, name, description) 
        VALUES ($1, $2, $3) RETURNING code, name, description`, [slufigyCode, name, description]);
        return res.status(201).json({ company: results.rows[0] });
    } catch (e) {
        next(e);
    }
})

router.patch('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3
        RETURNING code, name, description`, [name, description, code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can not find company with code of ${code}`, 404)
        }
        return res.status(201).json({ company: results.rows[0] });
    } catch (e) {
        next(e);
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`DELETE FROM companies WHERE code=$1`, [code]);
        if (results.rowCount === 0) {
            throw new ExpressError(`Can not find company with code of ${code}`, 404)
        }
        return res.send({ status: "Deleted" });
    } catch (e) {
        next(e);
    }
})

module.exports = router;