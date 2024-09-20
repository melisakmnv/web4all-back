// #region IMPORT
import express from "express";
import User from "./usersClass.js";
import { middlewareRegister, middlewareJwtCheck } from "./usersMiddleware.js";
// #endregion IMPORT

const usersRoutes = express.Router();

//-------------------------------------------------------------------------------------------------------------------------------
//  route('/list') => get : Recupere tout les utilisateurs |
//--------------------------------------------------------------------------------------------------------------------------------
usersRoutes.route("/list").get(User.get);
usersRoutes.route("/rank").get(User.rank);

// post : Vérification avec un middleware et création d'un utilisateur
usersRoutes.route("/signup").post(User.add);

// Connexion
usersRoutes.route("/login").post(User.login);

//-------------------------------------------------------------------------------------------------------------------------------
//  route('/find/:id') via son ID => get : Recupere l'utilisateur, put : Modifie l'utilisateur, delete : Supprime l'utilisateur |
//--------------------------------------------------------------------------------------------------------------------------------
usersRoutes
    .route("/find/:id")
    .get(User.getById)
    .put(User.update)
    .delete(User.delete);

usersRoutes.route("/profile").get(middlewareJwtCheck, User.profile);

usersRoutes.route("/leveling").put(middlewareJwtCheck, User.leveling);

//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------| Les autres méthodes sont donc non allouées |-----------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------

usersRoutes.route("/list").all((req, res) => {
    res.status(405).send();
});
usersRoutes.route("/signin").all((req, res) => {
    res.status(405).send();
});
usersRoutes.route("/login").all((req, res) => {
    res.status(405).send();
});
usersRoutes.route("/find/:id").all((req, res) => {
    res.status(405).send();
});
usersRoutes.route("/profile").all((req, res) => {
    res.status(405).send();
});

export default usersRoutes;
