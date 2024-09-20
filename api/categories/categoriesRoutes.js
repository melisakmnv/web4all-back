// #region IMPORT
import express from "express";
import Category from "./categoriesClass.js";
// #endregion IMPORT

const categoriesRoutes = express.Router();

//-------------------------------------------------------------------------------------------------------------------------------
//  route('/list') => get : Recupere tout les categories, post : Ajoute une nouvelle catégorie (admin) |
//-------------------------------------------------------------------------------------------------------------------------------
categoriesRoutes.route("/list").get(Category.get);

// post : créer une nouvelle catégorie (thème ou module)
categoriesRoutes.route("/new").post(Category.add);

//-------------------------------------------------------------------------------------------------------------------------------
//  route('/find/:id') via son ID => get : Recupere la catégorie |
//-------------------------------------------------------------------------------------------------------------------------------
categoriesRoutes
    .route("/find/:id")
    .get(Category.getById)
    .put(Category.update)
    .delete(Category.delete);

//-------------------------------------------------------------------------------------------------------------------------------
//  route('/themes/list') get : Recupere les catégories thèmes |
//-------------------------------------------------------------------------------------------------------------------------------
categoriesRoutes.route("/themes/list").get(Category.getThemesList);

//-------------------------------------------------------------------------------------------------------------------------------
//  route('/modules/list') get : Recupere les catégories modules |
//-------------------------------------------------------------------------------------------------------------------------------
categoriesRoutes.route("/modules/list").get(Category.getModulesList);

//-------------------------------------------------------------------------------------------------------------------------------
//  route('/modules/find/:themeid') get : Recupere les catégories modules dans le thème donné |
//-------------------------------------------------------------------------------------------------------------------------------
categoriesRoutes
    .route("/modules/find/:themeid")
    .get(Category.getModulesInTheme);

//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------| Les autres méthodes sont donc non allouées |-----------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------

categoriesRoutes.route("/list").all((req, res) => {
    res.status(405).send();
});
categoriesRoutes.route("/new").all((req, res) => {
    res.status(405).send();
});
categoriesRoutes.route("/find/:id").all((req, res) => {
    res.status(405).send();
});
categoriesRoutes.route("/themes/list").all((req, res) => {
    res.status(405).send();
});
categoriesRoutes.route("/modules/list").all((req, res) => {
    res.status(405).send();
});
categoriesRoutes.route("/modules/find/:themeid").all((req, res) => {
    res.status(405).send();
});

export default categoriesRoutes;
