const express = require('express')
const Router = express.Router()
const parser = require('parser')
const Notification = require('../models/NotificationModel')
const AccountFaculty = require('../models/AccountFacultyModel')
Router.get('/',(req,res)=>{
    if(!req.session.user){
        return res.redirect('/')
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
        var array = temp.split(',')
        var a=[]
        for(var i=0;i<array.length;i++){
            a.push(data[array[i]])
        }
        Notification.find().then(d=>{
            d.forEach(e=>{
                console.log(e.context)
            })
            res.render('khoa',{name:p.name,permission:a, tag:array, noti:d})
        })
        
    })
    
})
Router.post('/upload',(req,res)=>{
    let result=''
    req.on('data',d=>result+=d.toString())
    req.on('end',()=>{
        data = JSON.parse(result)
        let noti = new Notification({
            title:data.title,
            context:data.context,
            permission:data.permission
        })
        noti.save()
        Notification.find()
        .then(e=>{
            console.log(e)
        })
    })
    console.log('da nhan anh')
    res.json({code:0,message:'Khong loi'})
})

module.exports = Router