const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})
///////////////////////////////////////////



userSchema.pre('save', function (next) {//index.js의 save하기 전에 행동해라.
    var user = this; // 바로 위의 user를 가리키는 것.
    if (user.isModified('password')) {//모델 필드중 패스워드가 수정될때만 작동.
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err) //bcrypt에서 비밀번호를 암호화하기위해 salt 필요.
                                        //salt를 만들기 위해 saltRounds필요 => 만들어질 솔트 길이.
                                        //err가 나면 next에 err를 주고, 아니면 salt를 줌.
                                        //next는 index.js에 save한 직후 상태임

            bcrypt.hash(user.password, salt, function (err, hash) {//salt가 만들어졌으면 해시.
                                                                    //해시할 값은 this로 가져온 바로 위의 user에password부분
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})



userSchema.methods.comparePassword = function (plainPassword, cb) { // 1. comparePassword라는 메소드를 만든것.
                                                                    // 이 메소드이름은 index.js의 메소드 호출부분과 이름이 같을것.
                                                                    // 2. 함수를 만들껀데, 그 함수에서 받아오는것은  plainPassword
                                                                    // 주는 것은 callback으로 cb 

    //plainPassword 1234567    암호회된 비밀번호 $2b$10$l492vQ0M4s9YUBfwYkkaZOgWHExahjWC
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {// 현재 사용자가 입력한 패스워드인 plainPassword와 암호화된 비밀번호 비교
                                                                            // 비교할때 현재 입력한 비밀번호를 암호화해서 맞는지 확인. 
        if (err) return cb(err);
        cb(null, isMatch);
    })
}


userSchema.methods.generateToken = function (cb) { // 토큰 생성하는 메소드. jsonwebtoken이거 깔아야함.
    var user = this;
    // console.log('user._id', user._id)

    // jsonwebtoken을 이용해서 token을 생성하기 
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token 
    // -> 
    // 'secretToken' -> user._id

    user.token = token


    //*** 중요! save하는 부분 변경하였음. 콜백함수 문제. */
    user.save().then(() => {
        return cb(null, user)
    }).catch((err)=>{
        return cb(err)
    })
}


userSchema.statics.findByToken = function(token, cb) { // 미들웨어에 의해 새로 생성된 메소드 
    var user = this;
    // user._id + ''  = token
    //토큰을 decode 한다. 
    jwt.verify(token, 'secretToken', function (err, decoded) {// 디코드하는 명령어. 토큰을 받고 아이디랑 토큰부분 나눌꺼임.
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}



const User = mongoose.model('User', userSchema)

module.exports = { User }