const { httpServer } = require("./app");

const PORT = 3000;
httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
