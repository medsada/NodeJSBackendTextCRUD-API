require("dotenv").config();
const dbConnection = require("./dbConnection");

const app = require("./app");

dbConnection();
const port = process.env.PORT || 5050;
server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = server;
