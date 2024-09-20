// #region IMPORT
import mongoose from "mongoose";
// #endregion IMPORT

const Schema = mongoose.Schema;

const ObjectId = mongoose.Types.ObjectId;

const schemaOptions = {
    timestamps: { createdAt: "created_at", updatedAt: "edited_at" },
    versionKey: false,
};

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            required: true,
        },
        parentTheme: { type: ObjectId, required: false },
        helpUrl: { type: String },
    },
    schemaOptions
);

export default mongoose.model("Categories", CategorySchema, "categories");
