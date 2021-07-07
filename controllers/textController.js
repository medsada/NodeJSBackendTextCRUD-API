const Text = require("../models/textModel");
const fuzzy = require("mongoose-fuzzy-searching");

const postText = async (req, res) => {
  const { text } = req.body;

  if (!text || !text.ar) {
    return res.status(400).json({ error: "empty text" });
  }

  try {
    const newText = await Text.create({ text });
    res.status(201).json({
      newText,
    });
  } catch (error) {
    console.log("error with creating on db :", error);
    res.status(500).json({ error: "has not been created, error on db" });
  }
};

const getTexts = async (req, res) => {
  const pageSize = 4;
  const pageIndex = Number(req.body.pageIndex) || 1;

  try {
    const count = await Text.countDocuments({});
    const textsList = await Text.find({})
      .limit(pageSize)
      .skip(pageSize * (pageIndex - 1));

    res.json({
      textsList,
      pageIndex,
      pagesNumbers: Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.log("error with getting on db :", error);
    res.status(500).json({ error: "has not been getted, error on db" });
  }
};

const updateText = async (req, res) => {
  const id = req.params.textId;
  const { text } = req.body;

  if (!text || !text.ar) {
    return res.status(400).json({ error: "empty text to update" });
  }

  try {
    const textToUpdate = await Text.findById(id);
    if (!textToUpdate) {
      console.log("error : not found");
      return res.status(400).json({ error: "not found" });
    }
    textToUpdate.text = text;
    const updatedProduct = await textToUpdate.save();
    res.json(updatedProduct);
  } catch (error) {
    console.log("error :", error);
    res.status(500).json({ error: "not updated" });
  }
};

const getCountWordText = async (req, res) => {
  const id = req.params.textId;
  try {
    const text = await Text.findById(id);
    if (!text) {
      console.log("error : not found");
      return res.status(400).json({ error: "not found" });
    }
    const { ar, fr, en } = text.text;
    const arCount = ar.split(" ").length;
    const frCount = fr ? fr.split(" ").length : 0;
    const enCount = en ? en.split(" ").length : 0;
    const totalCount = arCount + frCount + enCount;

    res.json({ count: { arCount, frCount, enCount, totalCount } });
  } catch (error) {
    console.log("error :", error);
    res.status(500).json({ error: "not counted" });
  }
};

const getCountWordTextByLanguage = async (req, res) => {
  const id = req.params.textId;
  const lang = req.params.language;
  try {
    const text = await Text.findById(id);
    if (!text) {
      console.log("error : not found");
      return res.status(400).json({ error: "not found" });
    }
    const langText = text.text[lang];
    const count = langText ? langText.split(" ").length : 0;
    res.json({ [lang]: count });
  } catch (error) {
    console.log("error :", error);
    res.status(500).json({ error: "not counted" });
  }
};

const getTextBySearch = async (req, res) => {
  const s = req.query.q;
  if (!s) {
    return res.status(400).json({ error: "empty text" });
  }
  try {
    const textsSearched = await Text.fuzzySearch(s);
    console.log(textsSearched, textsSearched.length);
    res.json({ searchResults: textsSearched });
  } catch (error) {
    console.log("error with getting on db :", error);
    res.status(401).json({ error: "has not been getted, error on db" });
  }
};

const getMostOccurentWord = async (req, res) => {
  try {
    const textsList = await Text.find({});
    let arrayAll = [];
    console.log(textsList);
    textsList.forEach((text) => {
      const { ar, fr, en } = text.text;
      const arrAr = ar.split(" ");
      arrayAll = arrayAll.concat(arrAr);
      if (fr) {
        const arrFr = fr.split(" ");
        arrayAll = arrayAll.concat(arrFr);
      }
      if (en) {
        const arrEn = en.split(" ");
        arrayAll = arrayAll.concat(arrEn);
      }
    });
    console.log("arrayAll : ", arrayAll);
    let mostOccurrent = { word: "", n: 0 };
    const arrOne = [...new Set(arrayAll)];
    console.log("arrOne : ", arrOne);
    arrOne.forEach((word) => {
      const num = arrayAll.filter((w) => w == word).length;
      if (num > mostOccurrent.n) {
        mostOccurrent = { word: word, n: num };
      }
    });
    console.log(mostOccurrent);
    res.json(mostOccurrent);
  } catch (error) {
    console.log("error with getting on db :", error);
    res.status(401).json({ error: "has not been getted, error on db" });
  }
};

module.exports = {
  postText,
  getTexts,
  updateText,
  getCountWordText,
  getCountWordTextByLanguage,
  getTextBySearch,
  getMostOccurentWord,
};
