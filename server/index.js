const express = require("express")
const cors = require("cors")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 5
const db = require('./db.js')

const dataService = require('./services/dataservice')
const { Connection } = require("./db")
require("dotenv").config()
const app = express()
app.use(express.json())

app.use(cors({origin:'http://localhost:4200'}))


// Jwt middleware start
const jwtmiddleware = (req,res,next)=>{
    try{
        const token = req.headers["access_token"]
        const data = jwt.verify(token,'blogapp123')
        console.log(data)
        next()
    }catch(error) {
        return{
            status:false,
            statusCode:422,
            message:'Login Failed'
        }
    }
}
// Jwt middleware end


app.post('/register',(req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        dataService.register(req.body.uname,req.body.email,hash).then(result=>{
            res.status(result.statusCode).json(result)
        })
    })
})

app.post("/login", (req, res) => {
  db.User.findOne({ email:req.body.email }).then((user) => {
    if (user) {
      // Load hash from your password DB.
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
          dataService
            .login(req.body.email)
            .then((result) => {
              res.status(result.statusCode).json(result);
            });
        }
      });
    }
  });
});

app.get('/getblogs',jwtmiddleware,(req,res)=>{
    dataService.getBlogs().then(result=>{res.status(result.statusCode).json(result)})
})

app.post('/getblogsbyuser', jwtmiddleware, (req,res)=>{
    dataService.getblogsbyuser(req.body.email).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.delete('/delete/:id',jwtmiddleware,(req,res,next)=>{
    dataService.deleteBlog(req.params.id).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/viewblog',jwtmiddleware,(req,res)=>{
    dataService.viewBlog(req.body.id).then(result=>{res.status(result.statusCode).json(result)})
})

app.post('/like',jwtmiddleware,(req,res)=>{
    dataService.like(req.body.uname,req.body.id).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/updateblog',jwtmiddleware,(req,res)=>{
    dataService.updateBlog(req.body.title,
        req.body.category,
        req.body.description,
        req.body.blogContent,
        req.body.image,
        req.body.id).then(result=>{
            res.status(result.statusCode).json(result)
        })
    })

app.post('/createblog',jwtmiddleware,(req,res)=>{
    dataService.createBlog(req.body.title,
        req.body.category,
        req.body.description,
        req.body.blogContent,
        req.body.image,
        req.body.uname,
        req.body.email).then(result=>{
            res.status(result.statusCode).json(result)
        })
    })

const port = process.env.PORT || 3000
app.listen(port,()=>{console.log(`server stared at ${port}`)})

USERNAME = process.env.uname 
PASSWORD = process.env.PASSWORD

Connection(USERNAME,PASSWORD)