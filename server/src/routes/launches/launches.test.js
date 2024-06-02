const request = require('supertest')
const app = require('../../app')
const {mongoConnect, mongoDisconnect} = require('../../services/mongo')

describe('Launches API', () => {

    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe('Test GET /v1/launches', () => {
        test('It should respond with 200 success', async () => {
            await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200)
        })
    })

    describe('Test POST /v1/launch', () => {
        const launchDataComplete = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1652 b',
            launchDate: 'July 7, 2025',
        }

        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1652 b',
        }

        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-1652 b',
            launchDate: 'hello',
        }

        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataComplete)
                .expect('Content-Type', /json/)
                .expect(201)

            const requestDate = new Date(launchDataComplete.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()

            expect(requestDate).toBe(responseDate)
            expect(response.body).toMatchObject(launchDataWithoutDate)
        })

        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            })
        })

        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            })
        })
    })
})
