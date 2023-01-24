const Pool = require("pg").Pool;

let poolConnection = null;

const connectDb = () => {
  if (!poolConnection) {
    var connectionString = process.env.DB_URL;

    const connectionInstance = new Pool({
      connectionString,
    })
    connectionInstance.query("SET search_path TO 'learn_space';")

    poolConnection = connectionInstance;
  }
  return poolConnection
}

module.exports = {
  query: (text) => {
    return connectDb().query(text)
  }
}

// const connectionInstance = new Pool({
//   host: "localhost",
//   database: "hue-tech",
//   user: "postgres",
//   password: "Pass2020!",
//   port: 5432,
// });