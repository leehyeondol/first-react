const express = require('express')
const app = express()
const port = 5000
const config = require('./config/key');

//const bodyParser = requier('body-parser');
const { User } = require("./models/User");

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
}).then(()=> console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

///application/json 처럼 생긴 데이터를 분석해서 가져올 수 있게 하는것 
app.use(express.json());
///application/x-www-from-urlencoded 처럼 생긴 데이터를 분석해서 가져올 수 있게 하는것 
app.use(express.urlencoded({extended: true}));
///

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요!! 노드몬 장착')
})
/*
app.get('/api/hello',(req,res) => {
    res.send("안녕하세요~")
})
*/
app.post('/a', (req, res) => {
  const user = new User(req.body)
  user.save()
.then((userInfo) => res.status(200).json({ success: true }))
.catch((err) => res.json({ success: false, err }));
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

