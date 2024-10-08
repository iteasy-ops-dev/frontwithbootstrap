# ITEASY Front with Bootstrap

TODO
---------
- 해야 할일은 TODO: 를 검색해서 빠르게 해결하자


Infomation
---------
- ITEASY 운영 플랫폼에서 프론트엔드를 담당합니다.

실행
---------
```sh
docker-compose -f docker-compose.yml -p frontend up -d
```

정지
---------
```sh
docker-compose -f docker-compose.yml -p frontend down --rmi all
```

업데이트 방법
---------
1. `/src/pages/Manage`에서 `추가 옵션 확장` 부분 추가
2. `/src/pages/manageOptions`에 해당 옵션에 맞는 옵션 페이지 추가

주의 사항
---------
- docker repository에 대한 내용이 정리 되기 전까지 
  - ```.env.production``` 파일 관리 필요.
  - config.js에 존재하는 환경변수에 대한 관리임
- nginx 인증서
  - ```cat your_server.crt your_ca.crt > fullchain.pem```
  - ```cat your_server.key > privkey.pem```
