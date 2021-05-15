const express = require('express')
const multer = require('multer')
const Router = express.Router()
const parser = require('parser')
const AccountStudent = require('../models/AccountStudentModel')
const Notification = require('../models/NotificationModel')
const ContentPost = require('../models/ContentModel')
const { htmlToText } = require('html-to-text');
const formidable = require('formidable')
const fs = require('fs')
const ObjectID = require('mongodb').ObjectID;
const app = express()
const upload = multer({dest:'uploads', 
fileFilter: (req, file, callback) => {

    if (file.mimetype.startsWith('image/')) {
        callback(null, true) // cho phep upload
    }
    else callback(null, false) // không cho upload loại file khác ảnh
    
}, limits: {fileSize: 500000}})

app.set('view engine','ejs')

Router.post('/update',(req,res)=>{
    let result=''
    req.on('data',d=>result+=d.toString())

    req.on('end',()=>{
        data = JSON.parse(result)
        AccountStudent.findOneAndUpdate(data['emailStu'], data, {
            new: true
        })
        .then(p =>{
            if(p){
                return console.log({data: p})
            }
            else return console.log("Error")
        })
    })
    return res.render('studentInterface',{data})
})
Router.get('/:id',(req,res)=>{
    let email = (req.params.id)
    AccountStudent.findOne({email:email})
    .then(a=>{
        ContentPost.find({email:email})
        .then(p=>{
            if(p){
                return res.render('oneStudent',{name:a.name,posts:p})
            }
        })  
    })
    
})
Router.post('/allStatus',(req,res)=>{
    ContentPost.find({})
    .then(p=>{
        res.json({code:0,status:p})
    })
    .catch(e=>{
        res.json({code:1,message:'Lỗi '+e})
    })
    
})
Router.post('/do-upload-image',(req,res)=>{
    var formData = new formidable.IncomingForm();
    formData.parse(req,(error,fields,files)=>{
        var oldPath = files.file.path;
        var newPath = "static/images/"+files.file.name;
        fs.rename(oldPath,newPath,(err)=>{
            res.send("/"+newPath)
        })
        
    })
})
Router.post('/upload',(req,res) =>{
    let result=''
    req.on('data',d=>result+=d.toString())
    req.on('end',()=>{
        dataPost = JSON.parse(result)

        var encodeText = htmlToText(dataPost.contextPost)
        let contPost = new ContentPost({
            name:dataPost.name,
            email: dataPost.email,
            titlePost: dataPost.titlePost,
            datePost:dataPost.datePost,
            contextPost: htmlToText(dataPost.contextPost),
            image:dataPost.image
        })
        contPost.save()
        res.json({code:0,message:'Khong loi',dataPost:contPost._id})
    })
})
Router.get('/', (req, res) =>{
    let emailStu = req.session.user
    AccountStudent.findOne({email: emailStu})
    .then(p =>{
        var nameSt = p.name;
        var emailSt = p.email;
        ContentPost.find({email: emailStu})
        .then(p =>{
            p = p.reverse()
            Notification.find({})
            .then(n=>{
                res.render('studentInterface', {notifications:n,nameStun: nameSt, emailStun: emailSt, postS: p})  
            })
              
        })
        
    })
    

})

module.exports = Router

