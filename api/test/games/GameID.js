import chai, { assert } from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

const expect = chai.expect;

const urlpart = "/games";

describe("Tests des requêtes GET,POST,PUT,DELETE sur les jeux, avec arguments", () => {

    let moduleId = 0;

    let gameSlug = "";
    const gameName = "gameName";
    const gameContent = [{"question":"Quelle balise doit on utiliser pour afficher un titre ?", "codeSnippet":"<_>Hello World !</_>", "answers":[{"entitled": "img", "isGood": false}, {"entitled": "h1", "isGood": true},{"entitled": "div", "isGood": false}]}];

    it("categories/modules/list : on récupère l'id d'un module existant", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .get(`/categories/modules/list`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
                moduleId = res.body[0]._id;
                console.log("moduleId", moduleId);
            });
    });

    it("/new : Ajout d'un module avec un nom, et l'id de son module parent doit retourner le statut 201", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .post(`${urlpart}/new`)
            .type("form")
            .send({
                name: gameName,
                points: 10,
                parentModule: moduleId,
                gameContent: JSON.stringify(gameContent)
            })
            .then((res) => {
                expect(res).to.have.status(201);
                //Récupération de la clef pour les autres tests
                gameSlug = res.body.slug;
            });
    })

    it("/find/:slug : Récuperation du jeu et vérification de ses valeurs", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/find/${gameSlug}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);

                assert.equal(gameName, res.body.name);
            });
    });

    it("/find/:slug : Suppression du jeu doit retourner le statut 200", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .delete(`${urlpart}/find/${gameSlug}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });
});
