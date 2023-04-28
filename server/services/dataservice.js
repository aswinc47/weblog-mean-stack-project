const db = require("../db")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 5

register = (uname,email,password)=>{
    return db.User.findOne({email}).then(user=>{
        if(user){
            return {
                status:false,
                statusCode:409,
                message:'User with email id already exist'
            }
        }else{
           
                const newUser = new db.User({uname,email,password})
                newUser.save()
                return {
                    status:true,
                    statusCode:200,
                    message:'Registration successful'
                }
        }
    })
}


login = (email)=>{
    return db.User.findOne({email}).then(user=>{
        if(user){
            // Load hash from your password DB.
                    currentEmail = email
                    currentUser = user.uname
                    const token = jwt.sign({currentEmail},'blogapp123')
                    return{
                        status:true,
                        statusCode:200,
                        message:'Login successful',
                        currentEmail,
                        currentUser,
                        token
                    }
        }else{
            return{
                status:false,
                statusCode:401,
                message:'Incorrect email or password'
            }
        }
    })
}


createBlog = (title,category,description,blogContent,image,uname,email)=>{

    return db.Post.findOne({title,email}).then(data=>{
        if(data){
            return{
                status:false,
                statusCode:401,
                message:'Already exist'
            }
        }
        else{
            const date = new Date()
            const newBlog = db.Post({
                title,category,description,blogContent,image,uname,email,liked:[],date:date
            })
            newBlog.save()
            return{
                status:true,
                statusCode:200,
                message:'Blog posted'
            }
        }
    })
}

updateBlog = (title,category,description,blogContent,image,id)=>{
    return db.Post.findOne({_id:id}).then(data=>{
        if(data){
            db.Post.updateOne({_id:id},{$set:{title:title,category:category,description:description,blogContent:blogContent,image:image}}).then(data=>{
                if(data){
                    return{
                        status:true,
                        statusCode:200,
                        message:'Blog posted'
                    }
                }else{
                    return{
                        status:false,
                        statusCode:401,
                        message:'Updation failed'
                    }
                }
            })
        }else{
            return{
                status:false,
                statusCode:401,
                message:'Blog doesnot exist'
            }
        }
    })
}


viewBlog = (_id)=>{
    return db.Post.findById(_id).then(data=>{
        return{
            status:true,
            statusCode:200,
            message:'Success',
            data
        }
    })
}

like = (uname,_id)=>{
    return db.Post.findById(_id).then(data=>{
        if(data.liked.includes(uname)){
            data.liked = data.liked.filter(n => n != uname )
            data.save()
        }else{
            data.liked.push(uname)
            data.save()
        }
        console.log(data)
        return{
            status:true,
            statusCode:200,
            message:'Success',
            data
        }
    })
}


getBlogs = ()=>{
    return db.Post.find().then(data =>{
        if(data){
            return{
                status:true,
                statusCode:200,
                message:'Success',
                data
            }
        }else{
            return{
                status:false,
                status:409,
                message:'Did not got response'
            }
        }
    })
}
getblogsbyuser = (email)=>{
    return db.Post.find({email}).then(data=>{
        if(data){
            return{
                status:true,
                statusCode:200,
                message:'Success',
                data
            }
        }else{
            return{
                status:false,
                status:409,
                message:'Did not got response'
            }
        }
    })
}

deleteBlog = (id)=>{
        return db.Post.deleteOne({_id:id}).then(()=>{
            console.log("success");
            return{
                status:true,
                statusCode:200,
                message:'Successfully Deleted'
            }
        })
        }

module.exports = {
    register,
    login,
    createBlog,
    getBlogs,
    viewBlog,
    like,
    getblogsbyuser,
    deleteBlog,
    updateBlog
}