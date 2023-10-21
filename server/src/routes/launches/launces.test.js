const request = require("supertest");
const app = require("../../app");
const {connectToMondoDb,disconnectMongo} = require("./../../utilities/mongoUtils");

const completeData = {
    mission: "Kepler Exploration X",
    rocket: "Explorer ISL",
    launchDate: new Date("June 18,2023"),
    target: "Kepler-442 b",
};

const dataWithNoData = {
    mission: "Kepler Exploration X",
    rocket: "Explorer ISL",
    target: "Kepler-442 b",
};

describe("testing launches API",()=>{
    
    beforeEach(async()=>{
        await connectToMondoDb();
    });

    afterEach(async()=>{
        await disconnectMongo();
    });

    describe("Test GET /launch", () => {
        test('should respond 200 success', async () => {
            await request(app)
                .get("/v1/launch")
                .expect(200)
                .expect("content-type", /json/);
        })
    });
    
    describe("Test post /launch", () => {
        test('should respond 201 created', async () => {
            const respond = await request(app)
                .post("/v1/launch")
                .send(completeData)
                .expect(201)
                .expect("content-type", /json/);
            const reqDate = new Date(completeData.launchDate).valueOf();
            const resDate = new Date(respond.body.launchDate).valueOf();
    
            expect(reqDate).toBe(resDate);
            expect(respond.body).toMatchObject(dataWithNoData);
        })
    
        test("should respond 400 user error", async () => {
    
            const respond = await request(app)
                .post("/v1/launch")
                .send(dataWithNoData)
                .expect("content-type", /json/)
                .expect(400);
    
            expect(respond.body).toStrictEqual({
                error: "Missing Launch Property"
            })
        })
    
        test("should respond 400 user error", async () => {
            // changing the launch date
            completeData.launchDate = "good";
    
            const respond = await request(app)
                .post("/v1/launch")
                .send(completeData)
                .expect("content-type", /json/)
                .expect(400);
    
            expect(respond.body).toStrictEqual({
                error: "Invalid Date"
            })
        })
    });
})
