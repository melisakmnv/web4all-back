// #region IMPORT
import mongoose from "mongoose";
import slug from "mongoose-slug-generator";
// #endregion IMPORT

const Schema = mongoose.Schema;

const ObjectId = mongoose.Types.ObjectId;

mongoose.plugin(slug);

const schemaOptions = {
    timestamps: { createdAt: "created_at", updatedAt: "edited_at" },
    versionKey: false,
};

const GameContent = new Schema({
    question: { type: String, required: true },
    codeSnippet: { type: String },
    answers: [
        {
            entitled: { type: String },
            isGood: { type: Boolean },
        },
    ],
});

const GameSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: { type: String, slug: "name", unique: true },
        parentModule: { type: ObjectId, required: true },
        points: { type: Number },
        gameContent: [GameContent],
    },
    schemaOptions
);

export default mongoose.model("Games", GameSchema, "games");
