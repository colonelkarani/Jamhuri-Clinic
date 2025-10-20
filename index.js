const express = require("express")
const bcrypt =require("bcrypt")
// const { name } = require("ejs")
const passport = require('passport')
const app = express()
const port = 3000

const init = require('./passport_config.js')
init(passport)


let users = []

app.set("view-engine", 'ejs')
app.use(express.urlencoded({extended: false}))

app.get("/user", (req,res)=>{
    res.render("index.ejs",{name: "Karani"})
})

app.get("/", (req,res)=>{
res.render("login.ejs")
})

app.post("/register", async(req,res)=>{
    try {
        const hashed = await bcrypt.hash(req.body.signupPassword, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.signupName,
            email: req.body.signupEmail, 
            password: hashed
        })
        res.redirect("/user", {name: req.body.signupName})
    } catch (error) {
        res.redirect("/")
    }
    console.log(users)
})

app.listen(port, ()=>{
    console.log(`app is listening on http://localhost:${port}`)
})