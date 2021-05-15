const express = require('express')
const Router = express.Router()
const parser = require('parser')
const AccountStudent = require('../models/AccountStudentModel')
const Notification = require('../models/NotificationModel')
const ContentPost = require('../models/ContentModel')
const ObjectID = require('mongodb').ObjectID;
const {htmlToText} = require('html-to-text')
const app = express()
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

Router.post('/allStatus',(req,res)=>{
    ContentPost.find({})
    .then(p=>{
        res.json({code:0,status:p})
    })
    .catch(e=>{
        res.json({code:1,message:'Lỗi '+e})
    })
    
})
Router.post('/upload', (req,res) =>{
    let result=''
    req.on('data',d=>result+=d.toString())
    req.on('end',()=>{
        dataPost = JSON.parse(result)

        var encodeText = htmlToText(dataPost.contextPost)
        let contPost = new ContentPost({
            email: dataPost.email,
            titlePost: dataPost.titlePost,
            contextPost: encodeText
        })
        contPost.save()
        res.json({code:0,message:'Khong loi',dataPost:contPost._id})
    })
    console.log('Da Nhan')
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

