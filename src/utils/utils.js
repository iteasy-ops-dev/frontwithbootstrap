export const translateManageType = (type) => {
  let kor

  switch (type) {
    case "change_password":
      kor = "❌ 비밀번호 변경(계정 관리를 사용하세요.)"
      break;
    case "prune_firewall":
      kor = "❌ 방화벽 청소"
      break;
    case "change_ssh_port":
      kor = "SSH 포트 변경"
      break;
    case "change_ssl":
      kor = "✅ SSL 연장(테스트 중)"
      break;
    case "web_conf_scout":
      kor = "✅ 웹서버 탐색기"
      break;
    case "package_manager":
      kor = "패키지 관리"
      break;
    case "webhost_manager":
      kor = "❌ 웹호스팅 관리"
      break;
    case "account_manager":
      kor = "✅ 계정 관리"
      break;
    case "3way_manager":
      kor = "✅ 쓰리웨이 관리"
      break;
    default:
      kor = type
      break;
  }

  return kor
}