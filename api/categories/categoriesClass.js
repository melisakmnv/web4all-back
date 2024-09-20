// #region IMPORT
import mongoose from "mongoose";
import Categories from "./categoriesSchema.js";
// #endregion IMPORT

const ObjectID = mongoose.Types.ObjectId;

class Category {
    // #region GET
    get(req, res) {
        Categories.find().exec((err, records) => {
            if (!err) return res.status(200).json(records);
            else {
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
            }
        });
    }

    getById(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true) {
            return res
                .status(400)
                .json({ error: `L'id envoyé n'est pas valide.` });
        }

        Categories.findById(req.params.id).exec((err, record) => {
            if (!err) {
                if (record) return res.status(200).json(record);
                else
                    return res
                        .status(404)
                        .json({ error: `La catégorie n'existe pas.` });
            } else {
                // On devrait plus arriver ici car le control de l'ObjectID la gere directement
                return res
                    .status(400)
                    .json({ error: `La demande n'est pas valide.` });
            }
        });
    }

    getThemesList(req, res) {
        let filter = { parentTheme: { $exists: false } };

        Categories.find(filter).exec((err, records) => {
            if (!err) return res.status(200).json(records);
            else {
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
            }
        });
    }

    getModulesList(req, res) {
        let filter = { parentTheme: { $exists: true } };

        Categories.find(filter).exec((err, records) => {
            if (!err) return res.status(200).json(records);
            else {
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
            }
        });
    }

    getModulesInTheme(req, res) {
        const themeid = req.params.themeid;
        // Validation de l'id du theme
        if (ObjectID.isValid(themeid) !== true) {
            return res
                .status(400)
                .json({ error: `L'id envoyé n'est pas valide.` });
        }

        let filter = { parentTheme: ObjectID(themeid) };

        Categories.find(filter).exec((err, records) => {
            if (!err) return res.status(200).json(records);
            else {
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
            }
        });
    }
    // #endregion GET

    // #region POST
    add(req, res) {
        console.log("req.body : ",req.body);
        const newRecord = new Categories({
            name: req.body.name,
            description: req.body.description,
            level: req.body.level,
            parentTheme: req.body.parentTheme,
        });
        newRecord.save((error, record) => {
            if (!error) return res.status(201).json(record);
            else if (error.code == 11000) {
                return res
                    .status(405)
                    .json({ error: `Catégorie déjà existante` });
            } else {
                return res
                    .status(400)
                    .json({ error: `L'enregistrement a échoué.` });
            }
        });
    }
    // #endregion POST

    // #region DELETE
    delete(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true) {
            return res
                .status(400)
                .json({ error: `L'id envoyé n'est pas valide.` });
        }

        Categories.findByIdAndDelete(req.params.id, (err) => {
            if (!err) return res.status(200).json();
            return res.status(400).json({ error: `La suppression a échoué.` });
        });
    }
    // #endregion DELETE

    // #region UPDATE
    update(req, res) {
        Categories.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            level: req.body.level,
            parentTheme: req.body.parentTheme,
        }).exec((error, record) => {
            if (!error) return res.status(201).json(record);
            else if (error.code == 11000) {
                return res.status(400).json({ error: `Déjà existant` });
            } else {
                return res
                    .status(400)
                    .json({ error: `L'enregistrement a échoué.` });
            }
        });
    }
    // #endregion UPDATE
}

export default new Category();