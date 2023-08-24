import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const LoginCheck = (props) => {
	const [cookies, setCookie, removeCookie] = useCookies(['id']);
	const [userID, setUserId] = useState(null);
	const navigate = useNavigate();

	const authCheck = () => { // 페이지에 들어올때 쿠키로 사용자 체크
		const token = cookies.id; // 쿠키에서 id 를 꺼내기
		axios
			.post('/users/loginCheck', { token: token }) // 토큰으로 서버에 인증 요청
			.then((res) => {
				setUserId(res.data.id); // 유저 아이디 표시를 위해 작성
			})
			.catch(() => {
				logOut(); // 에러 발생시 실행
			});
	};

	useEffect(() => {
		authCheck(); // 로그인 체크 함수
	});

	const logOut = () => {
		removeCookie('id'); // 쿠키를 삭제
		navigate('/'); // 메인 페이지로 이동
	};

	return (
		<>
			{userID && <h1>{userID}</h1>} // 로그인 되어있으면 아이디 표시
			<button onClick={logOut}>로그아웃</button> // 로그아웃 버튼
		</>
	);
};
export default LoginCheck;