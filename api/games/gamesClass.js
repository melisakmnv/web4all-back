// #region IMPORT
import mongoose from "mongoose";
import Games from "./gamesSchema.js";
// #endregion IMPORT

const ObjectID = mongoose.Types.ObjectId;

class Game {
    // #region GET
    get(req, res) {
        Games.find().exec((err, records) => {

            if (!err) {
                records.map((gamelist) =>
                    gamelist.gameContent.map((game) =>
                        game.answers.map((answer) => (answer.isGood = null))
                    )
                );
                return res.status(200).json({
                    message :"Success",
                    records
                });
            } else {
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
            }
        });
    }

    getBySlug(req, res) {
        let filter = { slug: req.params.slug };

        Games.findOne(filter).exec((err, records) => {
            if (!err) {
                records.gameContent.map((game) =>
                    game.answers.map((answer) => (answer.isGood = null))
                );
                return res.status(200).json(records);
            } else {
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
            }
        });
    }

    getPreviousAndNext(req, res) {
        let filter = { slug: req.params.slug };

        Games.findOne(filter).exec((err, records) => {
            if (!err) {
                records.gameContent.map((game) =>
                    game.answers.map((answer) => (answer.isGood = null))
                );
                return res.status(200).json(records);
            } else {
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
            }
        });
    }

    getGamesInModule(req, res) {
        const moduleid = req.params.moduleid;
        // Validation de l'id du module
        if (ObjectID.isValid(moduleid) !== true) {
            return res
                .status(400)
                .json({ error: `L'id envoyé n'est pas valide.` });
        }

        let filter = { parentModule: ObjectID(moduleid) };

        Games.find(filter).exec((err, records) => {
            if (!err) {
                records.map((gamelist) =>
                    gamelist.gameContent.map((game) =>
                        game.answers.map((answer) => (answer.isGood = null))
                    )
                );
                return res.status(200).json(records);
            } else {
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
            }
        });
    }
    // #endregion GET

    // #region POST
    add(req, res) {

        console.log(req.body.gameContent);
        const newRecord = new Games({
            name: req.body.name,
            parentModule: req.body.parentModule,
            points: parseInt(req.body.points) || 0,
            gameContent: JSON.parse(req.body.gameContent),
        });

        // console.log(newRecord);

        newRecord.save((error, record) => {
            if (!error) return res.status(201).json(record);
            else if (error.code == 11000) {
                return res.status(400).json({ error: `Jeu déjà existant` });
            } else {
                return res
                    .status(400)
                    .json({ error: `L'enregistrement a échoué.` });
            }
        });
    }

    validation(req, res) {
        let filter = { slug: req.body.slug };

        const answersToCheck = req.body.finalAnswers

        let feedback = {answersFeedback: [], score: 0};
        let goodAnswersCount = 0;

        Games.findOne(filter).exec((err, records) => {
            if (!err) {
                records.gameContent.map((game, gameIndex) => {
                    game.answers.map((answer) => {
                        if(answer.entitled === answersToCheck[gameIndex]){
                            feedback.answersFeedback.push(answer.isGood);
                            if(answer.isGood === true){
                                goodAnswersCount++;
                            }
                        }
                    })
                });
                
                if(feedback.answersFeedback.length === goodAnswersCount){
                    feedback.score = records.points;
                } else {
                    feedback.score = Math.floor((records.points / feedback.answersFeedback.length) * goodAnswersCount);
                }

                console.log(feedback)
                return res.status(200).json(feedback);
                
            } else {
                console.error("error : ", err)
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
            }
        });
    }

    delete(req, res) {
        let filter = { slug: req.params.slug };

        Games.findOneAndDelete(filter).exec((err, records) => {
            if (!err) {
                return res.status(200).json();
            } else {
                return res
                    .status(400)
                    .json({ error: `Une erreur est survenue.` });
            }
        });
    }
    // #endregion POST
}

export default new Game();
