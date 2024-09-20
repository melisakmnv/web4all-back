// #region IMPORT
import express from "express";

import categoriesRoutes from "./categories/categoriesRoutes.js";
import gamesRoutes from "./games/gamesRoutes.js";
import usersRoutes from "./users/usersRoutes.js";
// #endregion IMPORT

const router = express.Router();

// Chargement des routes pour la collection categories
router.use("/categories", categoriesRoutes);

// Chargement des routes pour la collection games
router.use("/games", gamesRoutes);

// Chargement des routes pour la collection users
router.use("/users", usersRoutes);

router.use("*", (error, req, res, next) => {
    res.status(error.code).json({msg : error.msg});
});

// Si une route n'existe pas, erreur 404
router.route("*").all((req, res) => {
    res.status(404).json({ error: `La route demandée n'existe pas.` });
});

export default router;
