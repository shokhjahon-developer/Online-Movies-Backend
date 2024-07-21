const { port } = require("../../config");

const runner = (app) => {
  app.listen(port, () => {
    console.log("This server is listening on port: ", port);
  });
};

module.exports = runner;
