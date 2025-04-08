import mysql from "mysql2/promise";

const MARIADB_CONFIG = {
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
};

export function CreateConnection() {
  const connection = mysql.createConnection(MARIADB_CONFIG);
  return connection;
}
