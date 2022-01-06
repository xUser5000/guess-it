require("dotenv").config();
const { PORT } = require("./constant");
const { httpServer } = require("./app");

httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
