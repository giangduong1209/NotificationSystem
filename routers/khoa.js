const express = require('express')
const Router = express.Router()
const parser = require('parser')
const Notification = require('../models/NotificationModel')
const ObjectID = require('mongodb').ObjectID;
const AccountFaculty = require('../models/AccountFacultyModel')
const bcrypt = require('bcrypt')

Router.post('/allthongbao',(req,res)=>{
   let {name}=req.body
   console.log(typeof(name))
   
    Notification.find({faculity:name})
    .then(p=>{
        if(p){
            res.json({code:0,message:'Thành công', data:p})
        }else{
            res.json({code:0,message:'Thất Bại'})
        }
    })
})
Router.post('/thongbao',(req,res)=>{
    let {id} = req.body
    console.log(id)
    Notification.findOne({_id:ObjectID(id)})
    .then(p=>{
        return res.json({code:0,message:'Lấy thành công',data:p})
    })
})
Router.post('/EditPassword',(req,res)=>{
    let result=''
    req.on('data',d=> result += d.toString())
    req.on('end',()=>{
        let data = JSON.parse(result)
        console.log(data.id)
        AccountFaculty.findById({_id:ObjectID(data.id)})
        .then(p=>{
            if(!p){
                return res.json({code:0,message:'Không tìm thấy tài khoản'})
            }
            let matched = bcrypt.compareSync(data.oldPassword,p.password)
            if(!matched){
                return res.json({code:0,message:'Mật khẩu cũ không đúng'})
            }
            AccountFaculty.findByIdAndUpdate({_id:ObjectID(data.id)},{password:bcrypt.hashSync(data.newPassword,10)})
            .then(p=>{
                if(!p){
                    return res.json({code:0,message:'Đổi mật khẩu thất bại'})
                }else{
                    return res.json({code:1,message:'Đổi mật khẩu thành công'})
                }
            })
           
        })
       
    })
   
})
Router.post('/thongbao/edit',(req,res)=>{
    let result=''
    req.on('data',d=>{
        result+=d.toString()
    })
    req.on('end',()=>{
        let data = JSON.parse(result)
        Notification.findByIdAndUpdate({_id:ObjectID(data.id)},{title:data.title,permission:data.permission,context:data.context,facutily:data.facutily})
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
Router.post('/thongbao/delete/:id',(req,res)=>{
    if(!req.params.id){
        return res.json({code:1,message:'Invalid ID'})
    }else{
        console.log(req.params.id)
        console.log('Đang xoá')
        Notification.findByIdAndDelete({_id:ObjectID(req.params.id)})
        .then(p=>{
            if(p){
                return res.json({code:0,message:'Xoá thành công'})
            }else{
                return res.json({code:1,message:'Xoá thất bại'})
            }
        })
    }
})
Router.get('/',(req,res)=>{
    if(!req.session.user){
        return res.redirect('/')
    }
    else if(req.session.user === "admin"){
        return res.redirect('/admin')
    }
    console.log(req.session.user)
    let data = {
        "CTHSSV":"Phòng Công tác học sinh, sinh viên",
        "PDH":"Phòng Đại học",
        "PSDH":"Phòng Sau Đại học",
        "PDTVMT":"Phòng điện toán và máy tính",
        "PKTVKDCL":"Phòng khảo thí và kiểm định chất lượng",
        "PTC":"Phòng tài chính",
        "CLC":"TDT Creative Language Center",
        "TTTH":"Trung tâm tin học",
        "SDTC":"TT đào tạo phát triển xã hội (SDTC)",
        "ATEM":"TT phát triển KHQL và UDCN (ATEM)",
        "TTHTDNVCSV":"TT hợp tác doanh nghiệp và cựu sinh viên",
        "KL":"Khoa Luật",
        "TTNG":"TT ngoại ngữ - tin học – bồi dưỡng văn hóa",
        "VCSKTVKD":"Viện chính sách kinh tế và kinh doanh",
        "MTCN":"Khoa Mỹ thuật công nghiệp",
        "DDT":"Khoa Điện – Điện tử",
        "CNTT":"Khoa Công nghệ thông tin",
        "QTKD":"Khoa Quản trị kinh doanh",
        "MTVBHLD":"Khoa Môi trường và bảo hộ lao động",
        "LDCD":"Khoa Lao động công đoàn",
        "TCNH":"Khoa Tài chính ngân hàng",
        "GDQT":"Khoa giáo dục quốc tế"
    }
    AccountFaculty.findOne({email:req.session.user})
    .then(p=>{
        var temp =p.permission
        var name=p.name
        var id = p._id
        var array = temp.split(',')
        var a=[]
        for(var i=0;i<array.length;i++){
            a.push(data[array[i]])
        }
        Notification.find({faculity:name})
        .then(p=>{
            res.render('khoa',{id:id,name:name,permission:a, tag:array, notifications:p})
        })    
    }) 
})
Router.post('/upload',(req,res)=>{
    let result=''
    req.on('data',d=>result+=d.toString())
    req.on('end',()=>{
        data = JSON.parse(result)
        console.log(data.name)
        let noti = new Notification({
            title:data.title,
            context:data.context,
            permission:data.permission,
            faculity:data.name
        })
        noti.save()
        res.json({code:0,message:'Khong loi',data:noti._id})
    })
    console.log('da nhan anh')
    
})

module.exports = Router