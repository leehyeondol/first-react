const express = require('express')
const app = express()
const port = 5000
const config = require('./config/key');
const cookieParser = require('cookie-parser'); // 쿠기 파서 설치하고 사용 
const { auth } = require('./middleware/auth');

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
app.use(cookieParser());// 쿠키 사용할 수 있게 해주는거.

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요!! 노드몬 장착')
})
/*
app.get('/api/hello',(req,res) => {
    res.send("안녕하세요~")
})
*/
app.post('/api/users/a', (req, res) => {
  const user = new User(req.body)

  user.save()
  .then((userInfo) => res.status(200).json({ success: true }))
  .catch((err) => res.json({ success: false, err }));
})



app.post('/api/users/login',(req, res) =>{
  // 요청된 이메일을 데이터베이스 찾기
  User.findOne({email: req.body.email})
  .then(docs=>{
      if(!docs){
          return res.json({
              loginSuccess: false,
              messsage: "제공된 이메일에 해당하는 유저가 없습니다."
          })
      }
      docs.comparePassword(req.body.password, (err, isMatch) => {
          if(!isMatch) return res.json({loginSuccess: false, messsage: "비밀번호가 틀렸습니다."})
  // Password가 일치하다면 토큰 생성
          docs.generateToken((err, user)=>{
              if(err) return res.status(400).send(err);
              // 받아온 user정보에 생성된 토큰 저장되어있음. / err가 오면 ststus400이랑 에러 메세지 띄움
        //토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지 => f12에 applicaition 클릭하면 쿠키랑 로컬스토리지 볼 수 있음 
              // 토큰을 저장
              res.cookie("x_auth", user.token)//user가 잘 오면 쿠키에 유저네임/토큰 형식으로 저장. 
              .status(200)
              .json({loginSuccess: true, userId: user._id})// 성공 status랑 유저 아이디 보냄
          })
      })
  })
  .catch((err)=>{
      return res.status(400).send(err);
  })
})


app.get('/api/users/auth', auth , (res, req) => {
  //여기까지 미들웨어를 통과해왔다는 얘기는 Athentication이 True라는 말.
  //그러면 클라이언트에 이제 정보전달해줘야함.정보는 user.js의 내용. 전부 줄필요는 없음
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, // role이 0이면 일반유져, 나머지는 관리자
    isAuth: true,
    rmail: req.user.eamil,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image//////이렇게 정보를 넘겨주면 어떤페이지에서든지 유저정보를 이용할 수 있어서 편해짐.
  })

})

////일단 이놈 안됨.

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user.User_id},//하나찾아서 업데이트하는것/아이디로 찾음. auth 미들웨어에서 받아서 찾은것. 
    {token: ""} // 토큰을 지워주는것
    , (err,user) =>{// 콜백펑션
      if (err) return res.json({succes: false,err});
      return res.status(200).send({
        success: true
      })
    })
})







app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

