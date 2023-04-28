const mongoose = require("mongoose")

const Connection = async (username,password)=>{
    URL =  `mongodb+srv://${username}:${password}@cluster0.vslmnj5.mongodb.net/?retryWrites=true&w=majority`
    try {
        await mongoose.connect(URL,{useNewUrlParser:true})  
        console.log("Connected to mongodb")
    } catch (error) {
        console.log("Failed to connect to mongodb",error)
    }
}

const User = mongoose.model('User',{
    uname:String,
    email:String,
    password:String
})

const Post = mongoose.model('Post',{
    title:String,
    uname:String,
    email:String,
    description:String,
    category:String,
    blogContent:String,
    image:String,
    liked:[String],
    date:String
})

module.exports={
    User,Post,Connection
}