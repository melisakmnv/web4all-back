import chai, { assert } from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const expect = chai.expect;

const urlpart = "/categories";

describe("Tests des requêtes GET,POST,PUT,DELETE sur les catégories, avec arguments", () => {
    let themeId = 0;
    const themeName = "themeName";
    const themeDescription = "themeDescription";
    const themeLevel = 3;

    let moduleId = 0;
    const moduleName = "moduleName";
    const moduleDescription = "moduleDescription";
    const moduleLevel = 1;

    const themeNameNew = "themeNameNew";
    const themeDescriptionNew = "themeDescriptionNew";
    const themeLevelNew = 2;

    it("/new : Ajout d'un thème avec un nom et une description doit retourner le statut 201", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .post(`${urlpart}/new`)
            .type("form")
            .send({
                name: themeName,
                description: themeDescription,
                level: themeLevel,
            })
            .then((res) => {
                expect(res).to.have.status(201);
                //Récupération de la clef pour les autres tests
                themeId = res.body._id;
            });
    });

    it("/new : Ajout d'un module avec un nom, une description, et l'id de son thème parent doit retourner le statut 201", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .post(`${urlpart}/new`)
            .type("form")
            .send({
                name: moduleName,
                description: moduleDescription,
                level: moduleLevel,
                parentTheme: themeId,
            })
            .then((res) => {
                expect(res).to.have.status(201);
                //Récupération de la clef pour les autres tests
                moduleId = res.body._id;
            });
    });

    it("/find/:id : Récuperation du thème et vérification de ses valeurs", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/find/${themeId}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);

                assert.equal(themeName, res.body.name);
                assert.equal(themeDescription, res.body.description);
            });
    });

    it("/find/:id : Récuperation du module et vérification de ses valeurs", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/find/${moduleId}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);

                assert.equal(moduleName, res.body.name);
                assert.equal(moduleDescription, res.body.description);
            });
    });

    it("/find/:id : Modification du thème avec un nouveau nom et une nouvelle description doit retourner le statut 201", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .put(`${urlpart}/find/${themeId}`)
            .type("form")
            .send({
                name: themeNameNew,
                description: themeDescriptionNew,
                level: themeLevelNew,
            })
            .then((res) => {
                expect(res).to.have.status(201);
            });
    });

    it("/find/:id : Récuperation du thème modifié et vérification de ses valeurs", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/find/${themeId}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);

                assert.equal(themeNameNew, res.body.name);
                assert.equal(themeDescriptionNew, res.body.description);
            });
    });

    it("/find/:id : Suppression du thème doit retourner le statut 200", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .delete(`${urlpart}/find/${themeId}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });

    it("/find/:id : Suppression du module doit retourner le statut 200", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .delete(`${urlpart}/find/${moduleId}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });

    it("/find/:id : On vérifie que le thème est bien supprimé doit retourner le statut 404", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/find/${themeId}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(404);
            });
    });

    it("/find/:id : On vérifie que le module est bien supprimé doit retourner le statut 404", async () => {
        await chai
            .request(process.env.URL_TEST_API)
            .get(`${urlpart}/find/${moduleId}`)
            .send()
            .then((res) => {
                expect(res).to.have.status(404);
            });
    });
});
