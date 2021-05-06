const express = require('express')
const Router = express.Router()
const notification = require('../models/NotificationModel')
const AccountFaculty = require('../models/AccountFacultyModel')
const CheckLogin = require('../auth/CheckLogin')
Router.get('/',(req,res)=>{
    if(!req.session.user){
        return res.redirect('/')
    }
    AccountFaculty.find({})
    .then(p=>{
        res.render('khoa',{khoa:p})
    
    })
    console.log(req.session.user)
   
})
Router.post('/khoa/upload',(req,res)=>{
    console.log('da nhan anh')
})
module.exports = Router