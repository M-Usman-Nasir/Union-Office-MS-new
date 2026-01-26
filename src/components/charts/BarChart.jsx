import Chart from 'react-apexcharts'

const BarChart = ({ data, title, xLabel, yLabel }) => {
  const options = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    xaxis: {
      categories: data.map(item => item.category),
      title: { text: xLabel },
    },
    yaxis: {
      title: { text: yLabel },
    },
    title: {
      text: title,
      align: 'center',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
  }

  const series = [
    {
      name: yLabel,
      data: data.map(item => item.value),
    },
  ]

  return <Chart options={options} series={series} type="bar" height={300} />
}

export default BarChart
