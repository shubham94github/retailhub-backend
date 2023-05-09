# Retailhub-backend-node
this is backend repo for node 

=>dashbord api done
=>all created_at and updated_at collumn do rename like createdAt", "updatedAt" in pg admin.
 
 live db
 module.exports = {
  HOST: "34.105.225.133",
  USER: "retailhub",
  PASSWORD: "kDyh9ndfvYdS3M7DRUcSxExfx5X",
  DB: "retailhub",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

localdb
module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "123",
  DB: "retailhub_dev",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};