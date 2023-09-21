import  express  from "express";
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from "cookie-parser";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import multer from "multer";//using store image
import path from "path";//using store image
const app =express();
app.use(cors());
app.use(cookieParser());
//midalwere to call by database data
app.use(express.json());
app.use(express.static('public'));


const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"singup",
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})

con.connect(function (err) {
    if (err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
})

app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee set salary = ? WHERE id = ?";
    con.query(sql, [req.body.salary, id], (err, result) => {
        if (err) return res.json({ Error: "update employee error in sql" });
        return res.json({ Status: "Success" })
    })
})
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete employee error in sql" });
        return res.json({ Status: "Success" })
    })
})


app.post('/login',(req,res)=>{
    const sql="SELECT *FROM users Where email= ? AND password = ?";
    con.query(sql,[req.body.email,req.body.password],(err,result)=>{
        if(err)return res.json({Status:"Error in runnig query"});
        if(result.length>0){
            return res.json({ Status: "Success" });

        }else{
            return res.json({ Status: "Error",Error:"Wrong Email or Password" });
        }
    })
})

app.post('/create',upload.single('image'),(req,res)=>{
    // console.log(req.body);
    const sql ="INSERT INTO employee (`name`,`email`,`password`,`address`,`salary`,`image`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if (err) return res.json({ Error: "Error in hashing password" });
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary,
            req.file.filename
        ]
        con.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "Inside singup query"+ err.message });
            return res.json({ Status: "Success" });
        })
    })
})

app.listen(8081,()=>{
    console.log("Running");
})