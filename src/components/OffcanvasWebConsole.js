import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css"; // xterm 스타일 적용

import config from '../config';

const OffcanvasWebConsole = ({ consoleState, setConsoleState, connectionInfo }) => {
  const terminalRef = useRef(null); // 터미널 DOM 레퍼런스
  const term = useRef(null);        // xterm 터미널 인스턴스
  const fitAddon = useRef(null);    // 터미널 사이즈 맞춤 플러그인
  const socket = useRef(null);      // WebSocket
  const [isSocketReady, setIsSocketReady] = useState(false);  // WebSocket 준비 상태

  useEffect(() => {
    if (!connectionInfo.host || !connectionInfo.port || !connectionInfo.username || !connectionInfo.password) {
      console.error("Connection info is missing");
      return;
    }

    // WebSocket 연결 설정
    socket.current = new WebSocket(config.ws.url);

    // WebSocket 연결 성공 시
    socket.current.onopen = () => {
      setIsSocketReady(true);
      console.log("WebSocket connected!");

      // 서버로 SSH 접속 정보를 전송
      socket.current.send(JSON.stringify({
        host: connectionInfo.host,
        port: connectionInfo.port,
        username: connectionInfo.username,
        password: connectionInfo.password
      }));
    };

    // // WebSocket 오류 발생 시
    // socket.current.onerror = (error) => {
    //   console.error("WebSocket Error:", error);
    // };

    // // 서버로부터의 메시지를 터미널에 출력
    // socket.current.onmessage = (event) => {
    //   if (term.current) {
    //     term.current.write(event.data); // 서버에서 온 데이터 터미널에 출력
    //     setConsoleState((prevState) => prevState + event.data); // 상태에 저장
    //   }
    // };

    socket.current.onmessage = function(event) {
      // console.log("Message from server:", event.data); // 서버로부터의 메시지 출력
      try {
        term.current.write(event.data); // 서버에서 온 데이터 터미널에 출력
        setConsoleState((prevState) => prevState + event.data); // 상태에 저장
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    // 컴포넌트 언마운트 시 WebSocket 및 터미널 정리
    return () => {
      if (term.current) {
        term.current.dispose();
      }
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [setConsoleState]);
  // }, [connectionInfo, setConsoleState]);

  useEffect(() => {
    if (isSocketReady) {
      // xterm.js 터미널 생성
      term.current = new Terminal({
        cols: 80,
        rows: 24,
        cursorBlink: true,      // 깜박이는 커서
        theme: {
          background: "#000000",  // 터미널 배경 색상
          foreground: "#FFFFFF"   // 터미널 글자 색상
        }
      });

      // 터미널 DOM에 xterm 터미널 부착
      fitAddon.current = new FitAddon();
      term.current.loadAddon(fitAddon.current);
      term.current.open(terminalRef.current);

      // 화면 크기에 맞게 터미널 사이즈 조정
      fitAddon.current.fit();

      // 터미널에서 사용자 입력을 서버로 전송
      term.current.onData((input) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
          socket.current.send(input); // 사용자가 입력한 값을 서버로 전송
        }
        setConsoleState((prevState) => prevState + input); // 터미널 입력 상태 관리
      });

      // 컴포넌트 언마운트 시 터미널 정리
      return () => {
        if (term.current) {
          term.current.dispose();
        }
      };
    }
  }, [isSocketReady, setConsoleState]);

  return (
    <>
      {isSocketReady ? (
        <div
          ref={terminalRef}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            borderRadius: "10px", // 모서리를 둥글게
            padding: "10px", // 안쪽 여백 추가
            boxSizing: "border-box" // padding이 너비에 포함되도록 설정 
          }}
        ></div>
      ) : (
        <p>Connecting to WebSocket...</p> 
      )}
    </>
  );
};

export default OffcanvasWebConsole;