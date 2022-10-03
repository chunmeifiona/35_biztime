process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const { createData } = require('./testdata')

beforeEach(createData);

afterAll(async () => {
    await db.end();
})

describe("GET /invoices", () => {
    test("Get a list of invoices", async () => {
        const res = await request(app).get('/invoices')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "invoices": [
                {
                    "id": 1,
                    "comp_code": "apple"
                },
                {
                    "id": 2,
                    "comp_code": "apple"
                },
                {
                    "id": 3,
                    "comp_code": "ibm"
                }
            ]
        })
    })
})

// describe("GET /invoices/:id", () => {
//     test("Get a single company", async () => {
//         const res = await request(app).get(`/invoices/1`)
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({
//             "invoice": {
//                 "id": 1,
//                 "amt": 100,
//                 "paid": false,
//                 "add_date": "2018-01-01T06:00:00.000Z",
//                 "paid_date": null,
//                 "company": {
//                     "name": "Apple",
//                     "description": "Maker of OSX."
//                 }
//             }
//         })
//     })
//     test("Responds with 404 for invalid id", async () => {
//         const res = await request(app).get(`/invoices/1111111`)
//         expect(res.statusCode).toBe(404);
//     })
// })

// describe("POST /invoices", () => {
//     test("Create a single invoice", async () => {
//         const res = await request(app).post('/invoices')
//             .send({ comp_code: 'ibm', amt: 500 })
//         expect(res.statusCode).toBe(201);
//         expect(res.body).toEqual({
//             "invoice": {
//                 "id": 4,
//                 "comp_code": "ibm",
//                 "amt": 500,
//                 "paid": false,
//                 "add_date": expect.any(String),
//                 "paid_date": null
//             }
//         })
//     })
// })

// describe("PATCH /invoices/:id", () => {
//     test("Updates a single invoice", async () => {
//         const res = await request(app).patch(`/invoices/3`).send({ amt: 1000 })
//         expect(res.statusCode).toBe(201);
//         expect(res.body).toEqual({
//             "invoice": {
//                 "id": 3,
//                 "comp_code": "ibm",
//                 "amt": 1000,
//                 "paid": false,
//                 "add_date": expect.any(String),
//                 "paid_date": null
//             }
//         })
//     })
//     test("Responds with 404 for invalid code", async () => {
//         const res = await request(app).patch(`/invoices/1111111`).send({ amt: 1000 })
//         expect(res.statusCode).toBe(404);
//     })
//     test("It should return 500 for missing data", async () => {
//         const res = await request(app).patch(`/invoices/3`)
//         expect(res.statusCode).toBe(500);
//     })
// })

// describe("DELETE /invoices/:id", () => {
//     test("Deletes a single invoice", async () => {
//         const res = await request(app).delete(`/invoices/3`)
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({
//             "status": "Deleted"
//         })
//     })
//     test("Responds with 404 for invalid code", async () => {
//         const res = await request(app).get(`/invoices/1111`)
//         expect(res.statusCode).toBe(404);
//     })
// })

