// #region IMPORT
import mongoose from "mongoose";
import Users from "./usersSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// #endregion IMPORT

const ObjectID = mongoose.Types.ObjectId;

const jwtConfig = {
    secret: process.env.SECRET_KEY,
    expiresIn: "30 days",
};

class User {
    // #region GET
    //   Get all users
    get(req, res) {
        Users.find().exec((err, records) => {
            if (!err) return res.status(200).json(records);
            else {
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
            }
        });
    }

    //   Get users by rank
    rank(req, res) {
        Users.find()
            .sort({ totalPoints: -1 })
            .exec((err, records) => {
                if (!err) return res.status(200).json(records);
                else {
                    return res
                        .status(400)
                        .json({ error: `Une erreur est survenue.` });
                }
            });
    }

    //   Get user by id
    getById(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true) {
            return res
                .status(400)
                .json({ error: `La demande n'est pas valide.` });
        }

        Users.findById(req.params.id).exec((err, record) => {
            if (!err) {
                if (record) return res.status(200).json(record);
                else
                    return res
                        .status(404)
                        .json({ error: `L'utilisateur n'existe pas.` });
            } else {
                // On devrait plus arriver ici car le control de l'ObjectID la gere directement
                return res
                    .status(400)
                    .json({ error: `La demande n'est pas valide.` });
            }
        });
    }
    // #endregion GET

    // #region POST

    //   Sign up user
    add(req, res) {
        console.log("req.body", req.body);


        const { email, password, username } = req.body

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (!err) {

                    const newRecord = new Users({
                        email: email,
                        username: username,
                        password: hash,
                    });

                    newRecord.save((error, record) => {

                        if (!error) return res.status(201).json(record);

                        else if (error.code == 11000) {
                            return res.status(400).json({
                                error: `L'utilisateur est déjà existant`,
                            });

                        } else {
                            console.log("error from sign up : ", error)
                            return res.status(400).json({ error: error });
                        }
                    });

                } else {
                    // return res.status(400).json({
                    //     error: `Problème de cryptage du mot de passe`,
                    // });
                    console.error("err from sign up : ", err)
                    return res.status(400).json({

                        error: err,
                    });
                }
            });
        });
    }

    //   Sign in user
    login(req, res) {

        const { email, password } = req.body;

        Users.findOne({ email: email }).exec((err, user) => {
            if (!err && user) {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (!err) {
                        if (isMatch) {
                            //générer le token
                            const access_token = jwt.sign(
                                { email: email, isAdmin: user.isAdmin },
                                process.env.SECRET_KEY,
                                {
                                    expiresIn: jwtConfig.expiresIn,
                                }
                            );
                            user.password = null;
                            user._id = null;
                            user.isAdmin = null;
                            res.json({ user, token: access_token });
                        } else {
                            //erreur à générer
                            return res.status(400).json({
                                error: `l'email ou le mot de passe ne correspondent pas`,
                            });
                        }
                    } else {
                        return res
                            .status(400)
                            .json({ error: `Problème de serveur` });
                    }
                });
            } else {
                return res
                    .status(400)
                    .json({ error: `La demande n'est pas valide.` });
            }
        });
    }
    // #endregion POST

    // #region PUT

    //   Update user 
    update(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true) {
            return res
                .status(400)
                .json({ error: `L'id envoyé n'est pas valide.` });
        }

        Users.findById(req.params.id).exec((err, record) => {
            if (!err) {
                if (record) {
                    // On ne permet pas la modification du mot de passe et ou de l'apiKey
                    // avec cette API, il faut un niveau d'information complémentaire
                    const updateRecord = {
                        email: req.body.email || record.email,
                        username: req.body.username || record.username,
                    };
                    Users.findByIdAndUpdate(
                        req.params.id,
                        { $set: updateRecord },
                        (err) => {
                            if (!err) return res.status(201).json(record);
                            else {
                                return res.status(400).json({
                                    error: `La modification a échoué.`,
                                });
                            }
                        }
                    );
                } else
                    return res
                        .status(404)
                        .json({ error: `L'utilisateur n'existe pas.` });
            } else
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
        });
    }

    //   Add level to user
    leveling(req, res) {
        const { points, gameSlug, totalPoints } = req.body;
        //on a accès à l'email grace au JWT
        Users.findOne({ email: req.email }).exec((err, records) => {
            if (!err) {
                if (records) {
                    let msgResponse = "";
                    if (records.achieved.length) {
                        const alreadyDone = records.achieved.find(
                            (game) => game.gameSlug === gameSlug
                        );
                        if (alreadyDone) {
                            if (alreadyDone.points >= points) {
                                if (alreadyDone.points == totalPoints) {
                                    msgResponse =
                                        "Vous avez déjà plié le game !!";
                                    console.log(msgResponse);
                                }
                                else if (points == 0) {
                                    msgResponse =
                                        "Zut alors ! ce n'est toujours pas ça, peut-être que vous devriez revoir ce point 😉 !";
                                    console.log(msgResponse);
                                } else {
                                    msgResponse =
                                        `Vous n'avez pas amélioré votre dernier score de ${alreadyDone.points}/${totalts} points.`;
                                    console.log(msgResponse);
                                }
                            } else {
                                const diffPoints =
                                    points - alreadyDone.points;
                                alreadyDone.points = points;
                                if (points == totalPoints) {
                                    msgResponse = `Bravo ! vous avez gagnez ! +${diffPoints} points 🤩`;
                                    console.log(msgResponse);
                                } else {
                                    msgResponse = `Bien joué ! vous avez amélioré votre score de ${diffPoints} points (${points}/${totalPoints}) 😎`;
                                    console.log(msgResponse);
                                }
                            }
                        } else {
                            const newRecord = {
                                gameSlug: gameSlug,
                                points: points,
                            };
                            records.achieved.push(newRecord);
                            if (points == 0) {
                                msgResponse = `Oh non ! Ce n'est pas ça 😔 persévérez !`;
                            } else if (points == totalPoints) {
                                msgResponse = `Parfait ! +${points} points`;
                            }
                            else {
                                msgResponse = `Presque parfait ! Vous avez gagné ${points}/${totalPoints} points, réessayez pour le finir entièrement !`;
                            }
                            console.log(msgResponse);
                        }
                    } else {
                        const newRecord = [
                            {
                                gameSlug: gameSlug,
                                points: points,
                            },
                        ];
                        records.achieved = newRecord;
                        if (points == 0) {
                            msgResponse = `Oh non ! Vous n'avez pas gagné de points, Réessayez !`;
                        } else if (points == totalPoints) {
                            msgResponse = `Bravo ! vous avez fini le jeu ! Vous avez gagné ${points} points`;
                        }
                        else {
                            msgResponse = `Bravo ! Vous avez gagné ${points}/${totalPoints} points, réessayez pour le finir entièrement !`;
                        }
                        console.log(msgResponse);
                    }

                    records.save().then(() => {
                        let total = 0;

                        records.achieved.map((game) => {
                            total += game.points;
                        });

                        records.totalPoints = total;
                        records.save();

                        return res.status(201).json(msgResponse);
                    });
                } else
                    return res
                        .status(404)
                        .json({ error: `L'utilisateur n'existe pas.` });
            } else {
                // On devrait plus arriver ici car le control de l'ObjectID la gere directement
                return res
                    .status(400)
                    .json({ error: `La demande n'est pas valide.` });
            }
        });
    }
    // #endregion PUT

    // #region DELETE
    //   Delete user
    delete(req, res) {
        // Validation de l'id
        if (ObjectID.isValid(req.params.id) !== true) {
            return res
                .status(400)
                .json({ error: `La demande n'est pas valide.` });
        }
        Users.deleteOne({ id: req.params.id }, (err) => {
            if (!err) return res.status(200).send();
            else {
                return res
                    .status(400)
                    .json({ error: `La suppression a échoué.` });
            }
        });
    }
    // #endregion DELETE


    //   Get user profile
    profile(req, res) {
        //on a accès à l'email
        Users.findOne({ email: req.email }).exec((err, records) => {
            if (!err) {
                if (records) {
                    const user = {
                        achieved: records.achieved,
                        username: records.username,
                        totalPoints: records.totalPoints,
                    };
                    return res.status(200).json(user);
                } else
                    return res
                        .status(404)
                        .json({ error: `L'utilisateur n'existe pas.` });
            } else {
                // On devrait plus arriver ici car le control de l'ObjectID la gere directement
                return res
                    .status(400)
                    .json({ error: `La demande n'est pas valide.` });
            }
        });
    }
}

export default new User();
