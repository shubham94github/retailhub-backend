const express = require("express");
const app = express();
var http = require("http");
var bodyParser = require("body-parser");
var chalk = require("chalk");
var config = require("./configuration/config");
var env = config.get("environment");
const elasticSearch = require("./elasticsearch/index");
const initSwagger = require("./swagger/initSwagger");
var morgan = require("morgan");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  morgan(
    "[:date[clf]] :method :url :status :response-time ms - :res[content-length]"
  )
);
// inside public directory.
app.use(express.static("uploads"));
app.use("/images", express.static("/uploads/articles_image"));

// parse requests of content-type - application/json
app.use(express.json());
// init Swagger
initSwagger(app);
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
// const elastic = new elasticSearch();
// elastic.init("articles", "article");
// elastic.initTags("tags", "tag");
// elastic.initStartup("startups", "startup");
// elastic.initMission("missions", "mission");
// elastic.initTables("users", "user");
// elastic.initTables("categories", "category");
// elastic.initTables("countries", "countrie");
// elastic.initTables("retailers", "retailer");
// elastic.initTables("videos", "video");

// simple route
app.use("/api/uploads/article_image", express.static("uploads/"));
app.get("/", (req, res) => {
  res.sendFile(__dirname);
});
require("./configuration/cors")(app);
require("./configuration/routes")(app);

require("./app/routes/retailer.routes")(app);
require("./app/routes/missions.routes")(app);
require("./app/routes/dashboard.routes")(app);
require("./app/routes/users.routes")(app);
require("./app/routes/articles.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/startup.routes")(app);
require("./app/routes/events.route")(app);
require("./app/routes/training.routes")(app);
require("./app/routes/browsepage.routes")(app);
// set port, listen for requests
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

db.sequelize.sync().then(() => {
  console.log(`Server is running on port ${config.get("port")}.`);
  http.createServer(app).listen(config.get("port"));
});
console.log(
  chalk.green(
    "Listening to HTTP port " + config.get("port") + " " + env + "..."
  )
);
