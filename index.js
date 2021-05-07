const { urlencoded } = require('express')
const express = require('express')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const socketio = require('socket.io')
const ObjectID = require('mongodb').ObjectID;
const AccountFaculty = require('./models/AccountFacultyModel')
const AccountAdmin = require('./models/AccountAdminModel')
const Notification = require('./models/NotificationModel')
const mongoose = require('mongoose')
const app = express()
const KhoaRouter = require('./routers/khoa')
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '192862003971-e3ne3er14ijgit447n760d6vsbcrq6g2.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(__dirname + '/stylesheets'))
app.use('/public',express.static('./public'))

app.use(cookieParser('giangduong'))
app.use(session({cookie: {maxAge: 60000}}))
app.use(flash())

app.use('/khoa',KhoaRouter)
app.get('/', (req, res) =>{
    res.render('LoginForm')
})



app.get('/faculty', (req, res) =>{
    res.render('facultyInterface')
})
const validatorlogin = [

    check('email').exists().withMessage('Vui lòng nhập email')
    .notEmpty().withMessage('Không được để trống email')
    .isEmail().withMessage('Đây không phải là email hợp lệ'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Không được để trống mật khẩu')
    .isLength({min: 6}).withMessage('Mật khẩu phải từ 6 ký tự'),
]

app.get('/logout', (req, res) =>{
    req.session.user = null
    res.clearCookie('session-token')
    res.redirect("/")
})

app.get('/thongbao',(req,res)=>{
    res.send('Trang thong bao')
})
app.get('/thongbao/:id',(req,res)=>{
    let id=(req.params)
    console.log(id.id)
    Notification.find({_id: ObjectID(id.id)})
    .then(p=>{
        if(p){
           res.render('detailnotification',{p:p[0]})
        }else{
            console.log('khong tim thay')
        }
    })
    .catch(e=>console.log(e))
})
app.get('/admin', (req,res) =>{
    if(!req.session.user){
        return res.redirect('/')
    }
    res.render('adminInterface')
})
app.post('/', validatorlogin, (req, res) =>{
    if(req.session.user){
        return res.redirect('/')
    }
    let result = validationResult(req);
    if(result.errors.length === 0){
        let {email, password} = req.body
        let account = undefined
        if(email === "admin@gmail.com" && password==="123456"){
            req.session.user='admin'
            return res.redirect('/admin')
        }    
        else{
            AccountFaculty.findOne({email:email})
            .then( p=>{
                console.log(p)
                if(!p){
                    message ="Tài khoản không tồn tại"
                    req.flash('error', message)
                    return res.redirect('/')
                }else{
                    account=p
                    bcrypt.compare(password,p.password,(err,result)=>{
                        if(result!==true){
                            message ="Tài khoản không tồn tại"
                            req.flash('error', message)
                            return res.redirect('/')
                        }else{
                            delete p.password
                            req.session.user = p.email
                            console.log("Gia tri session: ",req.session.user)
                            return res.redirect('/khoa')
                        }
                    })
                }
            })
            .catch(e =>{console.log(e)})
        }
    }
    else{
        result = result.mapped()
        let message;
        for (fields in result){
            message = result[fields].msg
            break;
        }
        const {email, password} = req.body
        req.flash('error', message)
        req.flash('email', email)
        req.flash('password', password)
        res.redirect('/')
    }
})
app.get('/admin/create_account',(req,res) =>{
    const error = req.flash('error') || ''
    const name = req.flash('name') || ''
    const email = req.flash('email') || ''
    const password = req.flash('password') || ''
    res.render('register', {error, name, email, password})
})
 
app.post('/loginGG', (req, res) =>{
    let token = req.body.token;
    console.log(token)
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload)
        // If request specified a G Suite domain:
        const domain = payload['hd'];
        console.log(domain)
      }
      verify()
      .then(() =>{
        res.cookie('session-token', token)
        res.send('success')
      })
      .catch(console.error);
})


app.get('/student',checkAuthentication, (req, res) =>{
    let user = req.user;
    if(user.hd == "student.tdtu.edu.vn"){
        return res.render('studentInterface', { user });
    }
    else {
        return res.redirect('/')
    }
    
})




const validator = [
    check('name').exists().withMessage('Vui lòng nhập tên của văn phòng/khoa')
    .notEmpty().withMessage('Không được để trống tên của văn phòng/khoa'),

    check('email').exists().withMessage('Vui lòng nhập email')
    .notEmpty().withMessage('Không được để trống email')
    .isEmail().withMessage('Đây không phải là email hợp lệ'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Không được để trống mật khẩu')
    .isLength({min: 6}).withMessage('Mật khẩu phải từ 6 ký tự'),

    check('rePassword').exists().withMessage('Vui lòng nhập xác nhận mật khẩu')
    .notEmpty().withMessage('Vui lòng nhập xác nhận mật khẩu')
    .custom((value, {req}) =>{
        if(value !== req.body.password){
            throw new Error('Mật khẩu không khớp')
        }
        return true;
    })
]
app.get('/logout',(req,res)=>{
    req.session.user = null
    res.redirect('/')
})
app.get('/allthongbao/:page',(req,res)=>{
    let perPage = 5; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1; 
    Notification
      .find() // find tất cả các data
      .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(perPage)
      .exec((err, notifications) => {
        Notification.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
          if (err) return next(err);
           res.render('notification',{notifications,current:page,pages:Math.ceil(count/perPage)}) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
        });
      });
})
app.get('/thongbao/:id',(req,res)=>{
    let id=(req.params)
    console.log(id.id)
    Notification.find({_id: ObjectID(id.id)})
    .then(p=>{
        if(p){
           res.render('detailnotification',{p:p[0]})
        }else{
            console.log('khong tim thay')
        }
    })
    .catch(e=>console.log(e))

})
app.post('/admin/create_account', validator, (req, res) =>{
    let result = validationResult(req);
    if (result.errors.length === 0){
        let {name, email, password, FAC} = req.body
        var temp = ""
        temp += FAC
        bcrypt.hash(password, 10)
        .then(hashed => {
            let user = new AccountFaculty({
                name: name,
                email: email,
                password: hashed,
                permission: temp
            })
            return user.save()
        })
    }

    else{
        result = result.mapped()
        let message;
        for (fields in result){
            message = result[fields].msg
            break;
        }
        const {name, email, password} = req.body
        req.flash('error', message)
        req.flash('name', name)
        req.flash('email', email)
        req.flash('password', password)
        res.redirect('/admin/create_account')
    }
    res.redirect('/admin')
   
})
mongoose.connect('mongodb://localhost/accountfaculty', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() =>{
    const port = process.env.PORT || 8080
        const httpServer = app.listen(port,()=>console.log('http://localhost:'+port))
        const io = socketio(httpServer)
        io.on('connection',client=>{
            client.free= true
            client.loginAt=new Date().toLocaleDateString()
            console.log(`Client ${client.id} connected`)
            let users= Array.from(io.sockets.sockets.values()).map(socket=>({id:socket.id, username: socket.username, free: socket.loginAt, free:socket.free}))
            console.log(users)
            client.on('disconnect',()=>{
                console.log(`${client.id} has left`)
                
                client.broadcast.emit('user-leave', client.id)
                 }
            )
            client.on('notify',n=>{
                console.log(n)
                client.broadcast.emit('alertNoti',{message:`Có thông báo mới:<a href="/thongbao/${n}">Xem chi tiết</a>`})
            })
            client.on('regiter-nameUser', username=>{
                client.username = username
                client.broadcast.emit("register-name",{id:client.id, username: username})
            })
            client.send(" this  is messsage from server")
           
            client.emit('list-users',users)
            client.broadcast.emit('new-user',{id: client.id, username: client.name, free: client.free, loginAt: client.loginAt})
        })
})
.catch(e => console.log('Không thể kết nối đến database: ' +e.message))

