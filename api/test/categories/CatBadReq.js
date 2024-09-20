import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const expect = chai.expect;

const urlpart = "/categories";

describe("Tests comportant des erreurs et qui doivent renvoyer des codes d'erreurs", () => {
    it("/find/:id : avec un id vide doit retourner un statut 404", async () => {
        const id = "";
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/find/${id}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(404);
            });
    });

    it("/find/:id : avec un id qui n'est pas un ObjectID conforme doit retourner le statut 400", async () => {
        const id = "ceci-nest-pas-un-objectId";
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/find/${id}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(400);
            });
    });
    
    it("/find/:id : avec un ObjectID conforme mais ne correspondant à aucune catégorie doit retourner le statut 404", async () => {
        const id = "620fdd96ddfa7f45862ef9f7";
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/find/${id}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(404);
            });
    });

});
