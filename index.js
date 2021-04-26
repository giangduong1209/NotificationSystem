const { urlencoded } = require('express')
const express = require('express')

const app = express()
app.set('view engine','ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname + '/stylesheets'))
app.get('/admin', (req,res) =>{
    res.render('adminInterface')
})

app.get('/admin/create_account',(req,res) =>{
    res.render('register')
})

app.post('/admin/create_account', (req, res) =>{
    
})



const port = process.env.PORT || 8080
app.listen(8080, () =>{
    console.log(`http://localhost:${port}`)
})