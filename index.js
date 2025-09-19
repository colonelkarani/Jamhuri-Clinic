const express = require("express")

const app = express()
const port = 3000

app.set("view engine", "ejs")
app.use(express.static("views"))

app.get("/",(req,res)=>{
    res.send("home.html")
})
app.get("/services",(req,res)=>{
    res.render("navbar")
})


app.listen(port, ()=>{
    console.log(`app is listening on http://localhost:${port}`)
})