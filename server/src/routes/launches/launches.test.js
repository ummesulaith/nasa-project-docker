const request = require('supertest')
const app = require('../../app')
const {mongoConnect, mongoDisconnect} = require('../../services/mongo')

describe('Launches API',()=>{
    beforeAll(async ()=>{
        await mongoConnect()
    })
    afterAll(async()=>{
        await mongoDisconnect()
    })
    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app).get('/launches')
            expect(response.statusCode).toBe(200)
        })
    })
    
    describe('Test POST /launch', () => {
        const completeLaunchDate = {
            mission: 'Uss enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
            launchDate: 'January 4,2020'
        }
    
        const launchDataWithoutDate = {
            mission: 'Uss enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b'
        }
        const launchDataWithInvalidDate = {
            mission: 'Uss enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
            launchDate: 'Janua'
        }
        test('It should respond with 201 success', async () => {
            const response = await request(app).post('/launches')
                .send(completeLaunchDate)
                .expect('Content-Type', /json/)
                .expect(201)
    
            const requestDate = new Date(completeLaunchDate.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()
            expect(responseDate).toBe(requestDate)
            expect(response.body).toMatchObject(launchDataWithoutDate)
            // expect(response).toBe(200)
        })
        test('It should catch missing required properties', async () => {
            const response = await request(app).post('/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property'
            })
        })
    
        test('It should catch invalid dates', async () => {
            const response = await request(app).post('/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date'
            })
        })
    
    })
})
