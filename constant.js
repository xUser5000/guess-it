module.exports = {
    PORT: parseInt(process.env["PORT"]),
    CONTEST_PLAYERS: parseInt(process.env["CONTEST_PLAYERS"]),
    CONTEST_ROUNDS: parseInt(process.env["CONTEST_ROUNDS"]),
    CORS_ORIGINS : process.env["CORS_ORIGINS"].split(",").map(origin => origin.trim()),
};
