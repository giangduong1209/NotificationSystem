const { urlencoded } = require('express')
const express = require('express')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const AccountFaculty = require('./models/AccountFacultyModel')
const AccountAdmin = require('./models/AccountAdminModel')
const mongoose = require('mongoose')
const app = express()
const KhoaRouter = require('./routers/khoa')
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static(__dirname + '/stylesheets'))
app.get('/admin', (req,res) =>{
    res.render('adminInterface')
})

app.use(cookieParser('giangduong'))
app.use(session({cookie: {maxAge: 60000}}))
app.use(flash())

app.use('/khoa',KhoaRouter)
app.get('/', (req, res) =>{
    res.render('LoginForm')
})


const validatorlogin = [

    check('email').exists().withMessage('Vui lòng nhập email')
    .notEmpty().withMessage('Không được để trống email')
    .isEmail().withMessage('Đây không phải là email hợp lệ'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
    .notEmpty().withMessage('Không được để trống mật khẩu')
    .isLength({min: 6}).withMessage('Mật khẩu phải từ 6 ký tự'),
]


app.post('/', validatorlogin, (req, res) =>{
    let result = validationResult(req);
    if(result.errors.length === 0){
        let admin = new AccountAdmin({
            email: "admin@gmail.com",
            password: "123456"
        })
        admin.save()
        let {email, password} = req.body
        AccountAdmin.findOne({email: email, password: password})
        .then(ac => {
            if(!ac){
                res.redirect('/')
            }
            return res.redirect('/admin')
        })

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



const port = process.env.PORT || 8080

mongoose.connect('mongodb://localhost/accountfaculty', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() =>{
    app.listen(8080, () =>{
        console.log(`http://localhost:${port}`)
    })
})
.catch(e => console.log('Không thể kết nối đến database: ' +e.message))

