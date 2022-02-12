require("dotenv").config();
const PORT = 5000;
const { httpServer } = require("./app");

httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
