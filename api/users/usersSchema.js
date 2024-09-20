// #region IMPORT
import mongoose from "mongoose";
// #endregion IMPORT

const Schema = mongoose.Schema;

const schemaOptions = {
    timestamps: { createdAt: "created_at", updatedAt: "edited_at" },
    versionKey: false,
};

const GamesFinished = new Schema({
    gameSlug: {
        type: String,
        required: true,
        unique: true,
    },
    points: { type: Number },
});

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            match: /^[A-Za-z0-9]{5,20}$/,
        },
        password: {
            type: String,
            required: true,
        },

        avatar: { type: String },

        isAdmin: { type: Boolean, required: true, default: false },
        achieved: [GamesFinished],
        totalPoints: { type: Number, required: true, default: 0 },
    },
    schemaOptions
);

export default mongoose.model("Users", UserSchema, "users");
