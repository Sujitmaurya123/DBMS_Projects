import mysql from 'mysql2'

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Suj@$12*",
    database: "employeems"
})

con.connect(function(err) {
    if(err) {
        console.log("connection error"+err.message)
    } else {
        console.log("Connected")
    }
})

export default con;

