const Text = require("../models/textModel");

const postText = async (req, res) => {
  const { text } = req.body;

  if (!text || !text.ar || !text.fr || !text.en) {
    return res.status(400).json({ error: "empty text" });
  }

  try {
    const newText = await Text.create({ text });
    res.status(201).json({
      newText,
    });
  } catch (error) {
    res.status(500).json({ error: "has not been created, error on db" });
  }
};

const getTexts = async (req, res) => {
  const pageSize = 4;
  const pageIndex = Number(req.query.pageIndex) || 1;

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
    res.status(500).json({ error: "has not been getted, error on db" });
  }
};

const updateText = async (req, res) => {
  const id = req.params.textId;
  const { text } = req.body;

  if (!text || !text.ar || !text.fr || !text.en) {
    return res.status(400).json({ error: "empty text to update" });
  }

  try {
    const textToUpdate = await Text.findById(id);
    if (!textToUpdate) {
      return res.status(400).json({ error: "not found" });
    }
    textToUpdate.text = text;
    const updatedProduct = await textToUpdate.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "not updated" });
  }
};

const getCountWordText = async (req, res) => {
  const id = req.params.textId;
  try {
    const text = await Text.findById(id);
    if (!text) {
      return res.status(400).json({ error: "not found" });
    }
    const { ar, fr, en } = text.text;
    const arCount = ar.split(" ").length;
    const frCount = fr.split(" ").length;
    const enCount = en.split(" ").length;
    const totalCount = arCount + frCount + enCount;

    res.json({ count: { arCount, frCount, enCount, totalCount } });
  } catch (error) {
    res.status(500).json({ error: "not counted" });
  }
};

const getCountWordTextByLanguage = async (req, res) => {
  const id = req.params.textId;
  const lang = req.params.language;
  try {
    const text = await Text.findById(id);
    if (!text) {
      return res.status(400).json({ error: "not found" });
    }
    const langText = text.text[lang];
    const count = langText.split(" ").length;
    res.json({ [lang]: count });
  } catch (error) {
    res.status(500).json({ error: "not counted" });
  }
};

const getTextBySearch = async (req, res) => {
  const s = req.query.q;
  if (!s) {
    return res.status(400).json({ error: "empty search text" });
  }
  try {
    const textsSearched = await Text.fuzzySearch(s);
    res.json({ searchResults: textsSearched });
  } catch (error) {
    res.status(401).json({ error: "has not been getted, error on db" });
  }
};

const getMostOccurentWord = async (req, res) => {
  try {
    const textsList = await Text.find({});
    let arrayAll = [];

    textsList.forEach((text) => {
      const { ar, fr, en } = text.text;
      arrayAll = arrayAll.concat(ar.split(" "));
      arrayAll = arrayAll.concat(fr.split(" "));
      arrayAll = arrayAll.concat(en.split(" "));
    });

    let mostOccurrent = { word: "", n: 0 };
    let arrUnique = {};

    arrayAll.forEach((word) => {
      if (arrUnique[word]) {
        arrUnique[word] += 1;
        if (arrUnique[word] > mostOccurrent.n) {
          mostOccurrent = { word: word, n: arrUnique[word] };
        }
      } else {
        arrUnique[word] = 1;
      }
    });

    res.json(mostOccurrent);
  } catch (error) {
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
