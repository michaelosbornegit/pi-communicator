require("dotenv/config");

module.exports = {
  development: {
    client: "postgresql",
    connection: process.env.PG_CONNECTION_STRING,
  },
};
