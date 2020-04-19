const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;

db.on("open", () => console.log("Database connection opened."));
db.on("error", err => console.log(err));
db.on("close", () => console.log("Database connection closed."));

module.exports = db;
