const { urlencoded } = require('express')
const express = require('express')
const {check, validationResult} = require('express-validator')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()
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
        return res.send('Input Ok')
    }
    
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
})



const port = process.env.PORT || 8080
app.listen(8080, () =>{
    console.log(`http://localhost:${port}`)
})