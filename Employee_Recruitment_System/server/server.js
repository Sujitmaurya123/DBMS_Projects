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


const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"signup",
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './image')
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
    console.log(req.file);
})

app.listen(8081,()=>{
    console.log("Running");
})