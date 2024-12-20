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
      kor = "✅ SSL 연장"
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

export const replaceWord = (str, prev, next) => {
  return str.replaceAll(prev, next)
}

export const translateMonitorAlarmType = (type) => {
  let kor

  switch (type) {
    case "resource":
      kor = "서버 자원 점유"
      break;
    case "url":
      kor = "URL 응답"
      break;
    case "data_gathering":
      kor = "데이터 미수집"
      break;
    case "erp":
      kor = "ERP 알람"
      break;
    case "port":
      kor = "포트 응답"
      break;
    default:
      kor = type
      break;
  }

  return kor
}

export const viewMonitorDetail = (obj) => {
  switch (obj.AlarmType) {
    case "url":
      return `URL: ${obj.Url}`
    case "port":
      return `Port: ${obj.Port}`
    case "erp":
    case "resource":
    case "data_gathering":
    default:
      return ""
  }
}

export const viewUnixtime = (t) => {
  const date = new Date(t * 1000);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

export const translateMonitorCurrentStatus = (n) => {
  switch (n) {
    case -1:
      return "❌"
    case 0:
      return "⚠️"
    case 1:
      return "✅"
    case 100:
      return "🔄"

  }

}
