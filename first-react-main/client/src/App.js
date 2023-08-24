import "./App.css";
import { useCookies } from "react-cookie";
import React, { useEffect, useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["rememberText"]);
  //cookies는 쿠키의 정의,
  //setCookie는 쿠키를 재정의,
  //removeCookie는 쿠키 제거이다.
  //useCookies 안에는 초기값을 넣는다.

  let now = new Date();
  let after1m = new Date();

  useEffect(() => {
    if (cookies.rememberText !== undefined) {
      setText(cookies.rememberText);
      setIsRemember(true);
    }
  });

  function onChange(e) {
    setText(e.target.value);
  }

  const handleOnChange = (e) => {
    after1m.setMinutes(now.getMinutes() + 1); // after1m를 현재시간의 1분뒤로 정의
    setIsRemember(e.target.checked);
    if (e.target.checked) {
      setCookie("remeberText", text, { path: "/", expires: after1m });
      // remeberText에 text라는 값을 넣는다.
      // path는 적용되는 도메인
      // expires = 만료시간은 1분뒤
    } else {
      removeCookie("rememberText");
      // checkBox의 체크를 지울시
      // 쿠키 remeberText를 지운다
    }
  };

  return (
    <>
      {" "}
      <input value={text} onChange={onChange} />{" "}
      <input type="checkBox" onChange={handleOnChange} checked={isRemember} />{" "}
      <h1>{text}</h1>{" "}
    </>
  );
}

export default App;