import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const middlewareRegister = [
    body("email").isEmail().withMessage("Indiquez un email valide"),
    body("password").isLength({ min: 5 }).withMessage("5 caractères minimum"),
    body("password").custom((value, { req }) => {
        if (value !== req.body.passwordRepeat) {
            throw new Error("Vérifiez vos mot de passe");
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log("ERRORSS :", errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

const middlewareJwtCheck = [
    (req, res, next) => {
        try {
            const access_token =
                req.headers.authorization
                    .match(/^(\S+)\s(.*)/)
                    .slice(1)[1]
                    .trim() || null;

            jwt.verify(access_token, process.env.SECRET_KEY, (err, data) => {

                req.email = data.email;

                next();
            });

        } catch (error) {
            next({
                code : 400,
                msg: "Problème d'authentification",
            });
        }
    },
];
export { middlewareRegister, middlewareJwtCheck };
