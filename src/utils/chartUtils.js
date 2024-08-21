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
  // console.log(data)
   // 객체 배열을 랜덤으로 섞기
   const shuffledColors = shuffleArray(colors);

   // 섞인 객체 배열에서 backgroundColor와 borderColor 배열 분리하기
   const backgroundColor = shuffledColors.map(color => color.backgroundColor);
   const borderColor = shuffledColors.map(color => color.borderColor);

  return {
    labels,
    datasets: [
      {
				labels,
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  }
}