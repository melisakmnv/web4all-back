// #region IMPORT
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import color from "colors";

import apiRoutes from "./apiRoutes.js";
import { connectDB } from "./config/connectDB.js";
// #endregion IMPORT
dotenv.config()

connectDB()
const app = express();

// permet de parser le contenu du body des requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

//--------------------------------------------------------------------
//      Chargement des routes liées à l'API
//--------------------------------------------------------------------
app.use("/api", apiRoutes);
app.get("/" , (req, res) => {
    res.send("Welcome")
})

app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status).json(err);
});

//--------------------------------------------------------------------
//     Ecoute du serveur HTTP
//--------------------------------------------------------------------
app.listen(process.env.PORT, () => console.log(`Le serveur est démarré : http://localhost:${process.env.PORT}`.magenta.bold));


export default app;
