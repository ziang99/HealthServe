/* 
  Promise 封装操作 mysql数据库 的通用api
 */
const mysql = require('mysql')

exports.base = (sql, data) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'health'
    });
    connection.connect();
    connection.query(sql, data, (error, results) => {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
    });
    connection.end();
  })
}
