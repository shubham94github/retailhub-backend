const elasticsearch = require("elasticsearch");
const db = require("../app/models");
const Articles = db.articles;
const Tags = db.tags;
const Startups = db.startups;
const Missions = db.missions;
const Users = db.user;
const Category = db.category;
const Video = db.video;
const Retailers = db.retailers;
const Countries = db.countries;
var config = require("../configuration/config");
let environment = require("../configuration/environment");
class ElasticSearch {
  #client = new elasticsearch.Client({
    host: environment.isProduction()
      ? config.get("elasticsearchProdhost")
      : config.get("elasticsearchLocalhost"),
    log: "error"
  });
  constructor() {
    this.#client.ping({ requestTimeout: 30000 }, (error) => {
      if (error) {
        console.error("elasticsearch cluster is down!");
      } else {
        console.log("Everything is ok");
      }
    });
  }
  async init(index, type) {
    const data = await Articles.findAll();
    this.bulkIndex(index, type, data);
  }
  async initStartup(index, type) {
    const data = await Startups.findAll();
    this.bulkIndex(index, type, data);
  }
  async initMission(index, type) {
    const data = await Missions.findAll();
    this.bulkIndex(index, type, data);
  }
  async initTags(index, type) {
    const data = await Tags.findAll();
    this.bulkIndex(index, type, data);
  }
  async initTables(index, type) {
    let data;
    switch (index) {
      case "users":
        data = await Users.findAll();
        break;
      case "categories":
        data = await Category.findAll();
        break;
      case "countries":
        data = await Countries.findAll();
        break;
      case "retailers":
        data = await Retailers.findAll();
        break;
      case "videos":
        data = await Video.findAll();
        break;
    }
    this.bulkIndex(index, type, data);
  }

  async bulkIndex(index, type, data) {
    try {
      let bulkBody = [];
      data.forEach((item) => {
        bulkBody.push({
          index: {
            _index: index,

            _id: item.id
          }
        });

        bulkBody.push(item);
      });

      let errorCount = 0;
      const response = await this.#client.bulk({ body: bulkBody });
      response.items.forEach((item) => {
        if (item.index && item.index.error) {
          console.log(++errorCount, item.index.error);
        }
      });
      console.log(
        `Successfully indexed ${data.length - errorCount}out of ${
          data.length
        } items`
      );
      await this.verify();
    } catch (e) {
      console.error(e);
    }
  }

  async verify() {
    try {
      return await this.#client.cat.indices({ v: true }).then(console.log);
    } catch (err) {
      console.error(`Error connecting to the es elasticsearch: ${err}`);
    }
  }

  async searchData(index, body) {
    return await this.#client.search({ index: index, body: body });
  }
}

module.exports = ElasticSearch;
