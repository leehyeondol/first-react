const { User } = require('../models/User');

let auth = (req, res, next) => {
    //인증 처리를 하는곳 
    //클라이언트 쿠키에서 토큰을 가져온다.

    let token = req.cookies.x_auth;
    // 토큰을 복호화 한후  유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })


        // console.log('userh', user)

        req.token = token;//리퀘스트에 토큰이랑 유저를 줘야, index.js에서 호출한 함수가 토큰이랑 유저를 사용할 수 있음
        req.user = user;
        next();
    })
}


module.exports = { auth };