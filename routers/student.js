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
            name:dataPost.name,
            email: dataPost.email,
            titlePost: dataPost.titlePost,
            datePost:dataPost.datePost,
            contextPost: encodeText,

        })
        contPost.save()
        res.json({code:0,message:'Khong loi',dataPost:contPost._id})
    })
    console.log('Da Nhan')
})

Router.post('/post',(req,res) =>{
    let {id} = req.body
    ContentPost.findOne({_id:ObjectID(id)})
    .then(p=>{
        return res.json({code:0,message:'Lấy thành công',data:p})
    })
})

Router.post('/post/edit', (req, res) =>{
    let result=''
    req.on('data',d=>{
        result+=d.toString()
    })
    req.on('end',()=>{
        let data = JSON.parse(result)
        ContentPost.findByIdAndUpdate({_id:ObjectID(data.id)},{titlePost:data.titlePost, contextPost:htmlToText(data.contextPost)})
        .then(p=>{
            if(p){
                return res.json({code:1,message:'Sửa thành công'})
            }
            return  res.json({code:0,message:'Sửa thất bại'})
        })
        
    })
    req.on('error',(e)=>{
        console.log(e)
    })
})

Router.post('/post/delete/:id', (req, res) =>{
    if(!req.params.id){
        return res.json({code:1,message:'Invalid ID'})
    }else{
        console.log(req.params.id)
        console.log('Đang xoá')
        ContentPost.findByIdAndDelete({_id:ObjectID(req.params.id)})
        .then(p=>{
            if(p){
                return res.json({code:0,message:'Xoá thành công'})
            }else{
                return res.json({code:1,message:'Xoá thất bại'})
            }
        })
    }
})


Router.get('/', (req, res) =>{
    let emailStu = req.session.user
    AccountStudent.findOne({email: emailStu})
    .then(p =>{
        var nameSt = p.name;
        var emailSt = p.email;
        ContentPost.find({email: emailStu})
        .then(p =>{
            console.log(p)
            p = p.reverse()
            Notification.find({})
            .then(n=>{
                res.render('studentInterface', {notifications:n,nameStun: nameSt, emailStun: emailSt, postS: p})  
            })
              
        })
        
    })
    

})

module.exports = Router

