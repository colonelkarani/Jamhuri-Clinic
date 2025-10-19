const express = require("express")

const app = express()
const port = 3000

app.set("view-engine", 'ejs')

app.get("/user", (req,res)=>{
    res.render("index.ejs",{name: "Karani"})
})

app.get("/", (req,res)=>{
res.render("login.ejs")
})

app.listen(port, ()=>{
    console.log(`app is listening on http://localhost:${port}`)
})