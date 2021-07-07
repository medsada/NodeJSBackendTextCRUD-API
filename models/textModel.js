const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const textSchema = mongoose.Schema({
  text: {
    ar: {
      type: String,
      required: true,
    },
    fr: {
      type: String,
      required: false,
    },
    en: {
      type: String,
      required: false,
    },
  },
});
textSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.confidenceScore;
  },
});
textSchema.plugin(mongoose_fuzzy_searching, {
  fields: [{ name: "text", minSize: 3, keys: ["ar", "fr", "en"] }],
});

module.exports = mongoose.model("Text", textSchema);
