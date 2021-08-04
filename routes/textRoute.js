const express = require("express");
const router = express.Router();
const {
  postText,
  getTexts,
  updateText,
  getCountWordText,
  getCountWordTextByLanguage,
  getTextBySearch,
  getMostOccurentWord,
} = require("../controllers/textController");

router.route("/").post(postText).get(getTexts);

router.put("/:textId", updateText);

router.get("/:textId/count", getCountWordText);

router.get("/:textId/count/:language", getCountWordTextByLanguage);

router.get("/search", getTextBySearch);

router.get("/mostOccurrent", getMostOccurentWord);

module.exports = router;
