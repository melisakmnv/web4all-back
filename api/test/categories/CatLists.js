import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

const expect = chai.expect;

const urlpart = "/categories";

describe("Tests des requêtes GET sur les catégories, sans arguments", () => {
    it("/list : doit retourner toutes les thèmes et les modules et le statut 200", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/list`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });

    it("/themes/list : doit retourner toutes les thèmes et le statut 200", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/themes/list`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });

    it("/modules/list : doit retourner toutes les modules et le statut 200", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/modules/list`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });
});
