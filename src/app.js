const express = require("express");
const app = express();

require("./start/modules")(app, express);

require("./start/run")(app);
