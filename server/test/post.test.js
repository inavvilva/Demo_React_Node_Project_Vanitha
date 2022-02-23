import request from 'supertest';
const routes = require('../routes/post.route');


describe("Testing the Comment Api", () => {
    it("tests the base route and returns true for status", async () => {
        const response = await request(routes).get('/getCommentsandReplyList/1');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");

    })
})