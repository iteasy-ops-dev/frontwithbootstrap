import config from '../config';

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const colors = [
  {
    backgroundColor: config.chart.bgColor.blue,
    borderColor: config.chart.borderColor.blue,
  },
  {
    backgroundColor: config.chart.bgColor.red,
    borderColor: config.chart.borderColor.red,
  },
  {
    backgroundColor: config.chart.bgColor.yellow,
    borderColor: config.chart.borderColor.yellow,
  },
  {
    backgroundColor: config.chart.bgColor.green,
    borderColor: config.chart.borderColor.green,
  },
  {
    backgroundColor: config.chart.bgColor.purple,
    borderColor: config.chart.borderColor.purple,
  },
  {
    backgroundColor: config.chart.bgColor.orange,
    borderColor: config.chart.borderColor.orange,
  }
];

export const getChartData = (labels, data) => {
  // 객체 배열을 랜덤으로 섞기
  const shuffledColors = shuffleArray(colors);

  // 섞인 객체 배열에서 backgroundColor와 borderColor 배열 분리하기
  const backgroundColor = shuffledColors.map(color => color.backgroundColor);
  const borderColor = shuffledColors.map(color => color.borderColor);

  return {
    labels, // 데이터 구분자, 예를 들어 x축
    datasets: [
      {
        labels, // 데이터 레이블
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ]
  }
}

const chartColors = () => {
  // 객체 배열을 랜덤으로 섞기
  const shuffledColors = shuffleArray(colors);

  // 섞인 객체 배열에서 backgroundColor와 borderColor 배열 분리하기
  const backgroundColor = shuffledColors.map(color => color.backgroundColor);
  const borderColor = shuffledColors.map(color => color.borderColor);

  return [backgroundColor, borderColor]
}

export const generateChartData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return;
  }

  const type = data[0]._id.title

  switch (type) {
    case "overall":
      return overallChartData(data)
    case "daily":
      return dailyChartData(data)
    default:
      return otherChartData(data)
  }
}

const dailyChartData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const [backgroundColor, borderColor] = chartColors();

  // 데이터의 첫 번째 객체에서 키를 추출하여 동적으로 처리
  const labels = data.map((e) => e._id.date); // 기본적으로 날짜를 라벨로 사용
  const keys = Object.keys(data[0]).filter((key) => key !== '_id'); // '_id'를 제외한 나머지 키를 추출

  const datasets = keys.map((key, index) => ({
    label: key,
    data: data.map((e) => e[key]),
    backgroundColor: backgroundColor[index % backgroundColor.length], // 색상 순환
    borderColor: borderColor[index % borderColor.length], // 색상 순환
    borderWidth: 1,
  }));

  console.log(datasets)
  return {
    labels,
    datasets,
  };
};

const overallChartData = (d) => {
  const [backgroundColor, borderColor] = chartColors()
  const chartData = d[0]
  
  console.log(chartData)
  console.log(typeof chartData)
  console.log(Object.keys(chartData))

  const labels = Object.keys(chartData).filter((key) => key !== '_id')    // '_id'를 제외한 나머지 키를 추출
  const data = labels.map((key) => chartData[key])    // '_id'를 제외한 나머지 키의 값을 추출

  return {
    // labels: ["조치 전", "조치 중", "조치 완료", "자동 정상화"],
    labels: labels,
    datasets: [
      {
        label: chartData._id.title,
        // data: [chartData.before, chartData.processing, chartData.normal, chartData.auto],
        data: data,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ]
  }

}

const otherChartData = (data) => {
  const [backgroundColor, borderColor] = chartColors()

  data = data.filter((e) => e._id.title !== null && e._id.title !== "")

  const labels = data.map((e) => e._id.title)
  const chartData = data.map((e) => e.totalCount)

  return {
    labels,
    datasets: [
      {
        label: "",
        data: chartData,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ]
  }

}

export const createDoughnutChartData = (data) => {
  const labels = data.map((i) => i._id)
  const datasets = [
    generateDataSet("", data.map((i) => i.totalCount))
  ]

  return {
    labels, datasets
  }
}

const generateDataSet = (label, data) => {
  // 객체 배열을 랜덤으로 섞기
  const shuffledColors = shuffleArray(colors);

  // 섞인 객체 배열에서 backgroundColor와 borderColor 배열 분리하기
  const backgroundColor = shuffledColors.map(color => color.backgroundColor);
  const borderColor = shuffledColors.map(color => color.borderColor);

  return {
    label, // 데이터 레이블
    data,
    backgroundColor,
    borderColor,
    borderWidth: 1,
  }
}
