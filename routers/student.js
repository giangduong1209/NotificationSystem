const express = require('express')
const Router = express.Router()
const parser = require('parser')
const AccountStudent = require('../models/AccountStudentModel')
const ObjectID = require('mongodb').ObjectID;
Router.post('/update',(req,res)=>{
    let result=''
    req.on('data',d=>result+=d.toString())
    req.on('end',()=>{
        data = JSON.parse(result)
        // let stu = new AccountStudentModel({
        //     title:data,
        //     context:data.context,
        //     permission:data.permission
        // })
        // noti.save()
        res.json({code:0,message:'Khong loi',data:noti._id})
    })
    console.log('da nhan anh')
    
})

module.exports = Router

