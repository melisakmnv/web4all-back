import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

const expect = chai.expect;

const urlpart = "/games";

describe("Tests des requêtes GET sur les jeux, sans arguments", () => {
    it("/list : doit retourner toutes les jeux et le statut 200", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/list`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });
});
