const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../backend/src/index');
const should = chai.should();

chai.use(chaiHttp);

describe('GET /', () => {
    it('GET l\'index.html', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.a('string');
                done();
            });
    });
});
