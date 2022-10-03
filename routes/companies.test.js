process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const { createData } = require('./testdata')

beforeEach(createData);

afterAll(async () => {
    await db.end();
})

describe("GET /companies", () => {
    test("Get a list of companies", async () => {
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "companies": [
                {
                    "code": "apple",
                    "name": "Apple",
                    "description": "Maker of OSX."
                },
                {
                    "code": "ibm",
                    "name": "IBM",
                    "description": "Big blue."
                }
            ]
        })
    })
})

describe("GET /companies/:code", () => {
    test("Get a single company", async () => {
        const res = await request(app).get(`/companies/ibm`)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "company": {
                "code": "ibm",
                "name": "IBM",
                "description": "Big blue.",
                "invoices": [3]
            }
        })
    })
    test("Responds with 404 for invalid code", async () => {
        const res = await request(app).get(`/companies/iibbmm`)
        expect(res.statusCode).toBe(404);
    })
})

describe("POST /companies", () => {
    test("Create a single company", async () => {
        const res = await request(app).post('/companies')
            .send({ code: 'samsung', name: 'galaxy', description: 'smart phone maker' })
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            "company": {
                "code": "samsung",
                "name": "galaxy",
                "description": "smart phone maker"
            }
        })
    })
})

describe("PATCH /companies/:code", () => {
    test("Updates a single company", async () => {
        const res = await request(app).patch(`/companies/ibm`).send({ name: "IBM PC", description: "Big Big blue." })
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            "company": {
                "code": "ibm",
                "name": "IBM PC",
                "description": "Big Big blue."
            }
        })
    })
    test("Responds with 404 for invalid code", async () => {
        const res = await request(app).patch(`/companies/iibbmm`).send({ name: "IBM PC", description: "Big Big blue." })
        expect(res.statusCode).toBe(404);
    })
})

describe("DELETE /companies/:code", () => {
    test("Deletes a single company", async () => {
        const res = await request(app).delete(`/companies/ibm`)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "status": "Deleted"
        })
    })
    test("Responds with 404 for invalid code", async () => {
        const res = await request(app).delete(`/companies/iibbmm`)
        expect(res.statusCode).toBe(404);
    })
})

