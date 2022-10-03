const ExpressError = require("../expressError");
const express = require('express');
const router = new express.Router();

const db = require('../db')

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({ invoices: results.rows });
    } catch (e) {
        next(e);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`SELECT i.id, i.amt, i.paid, i.add_date, i.paid_date, c.code, c.name, c.description
                                        FROM invoices AS i 
                                        JOIN companies AS c ON (i.comp_code=c.code)
                                        WHERE id=$1`, [id]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can not find invoice with code of ${id}`, 404)
        }
        const data = results.rows[0];
        const invoice = {
            id: data.id,
            amt: data.amt,
            paid: data.paid,
            add_date: data.add_date,
            paid_date: data.paid_date,
            company: {
                code: data.comp_code,
                name: data.name,
                description: data.description,
            },
        };
        return res.json({ invoice: invoice });
    } catch (e) {
        next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { amt, comp_code } = req.body;
        const results = await db.query(`INSERT INTO invoices (comp_code, amt) 
                                 VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]);
        return res.status(201).json({ invoice: results.rows[0] });
    } catch (e) {
        next(e);
    }
})

router.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt, paid } = req.body;
        let paid_date = null;

        const current = await db.query(`SELECT paid, paid_date FROM invoices WHERE id=$1`, [id]);
        console.log(current.rows[0].paid_date)
        if (current.rows.length === 0) {
            throw new ExpressError(`Can not find invoice with code of ${id}`, 404)
        }
        const paidState = current.rows[0].paid;
        if (paidState === false && paid === true) {
            paid_date = new Date();
        } else if (paid === false) {
            paid_date = null;
        } else
            paid_date = current.rows[0].paid_date;
        const results = await db.query(`UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4
        RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, paid, paid_date, id]);

        return res.status(201).json({ invoice: results.rows[0] });
    } catch (e) {
        next(e);
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`DELETE FROM invoices WHERE id=$1`, [id]);

        if (results.rowCount === 0) {
            throw new ExpressError(`Can not find invoice with code of ${id}`, 404)
        }
        return res.send({ status: "Deleted" });
    } catch (e) {
        next(e);
    }
})

module.exports = router;

