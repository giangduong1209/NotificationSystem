const express = require('express')
const Router = express.Router()
const parser = require('parser')
const AccountStudent = require('../models/AccountStudentModel')
const ContentPost = require('../models/ContentModel')
const ObjectID = require('mongodb').ObjectID;
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


Router.post('/upload',(req,res) =>{
    let result=''
    req.on('data',d=>result+=d.toString())

    req.on('end',()=>{
        dataPost = JSON.parse(result)
        console.log(dataPost)
        let contPost = new ContentPost({
            email: dataPost.email,
            titlePost: dataPost.titlePost,
            contextPost: dataPost.contextPost,
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
            res.render('studentInterface', {nameStun: nameSt, emailStun: emailSt, postS: p})    
        })
        
    })
    

})

module.exports = Router

