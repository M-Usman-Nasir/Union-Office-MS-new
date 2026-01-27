import Chart from 'react-apexcharts'

const LineChart = ({ data, title, xLabel, yLabel }) => {
  const options = {
    chart: {
      type: 'line',
      toolbar: { show: false },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: data.map(item => item.category),
      title: { text: xLabel },
    },
    yaxis: {
      title: { text: yLabel },
      labels: {
        formatter: (val) => {
          return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0,
          }).format(val)
        },
      },
    },
    title: {
      text: title,
      align: 'center',
    },
    colors: ['#1976d2'],
  }

  const series = [
    {
      name: yLabel,
      data: data.map(item => item.value),
    },
  ]

  return <Chart options={options} series={series} type="line" height={300} />
}

export default LineChart
