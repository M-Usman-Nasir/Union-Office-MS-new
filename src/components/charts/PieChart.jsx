import Chart from 'react-apexcharts'

const PieChart = ({ data, title }) => {
  const options = {
    chart: {
      type: 'pie',
    },
    labels: data.map(item => item.label),
    legend: {
      position: 'bottom',
    },
    title: {
      text: title,
      align: 'center',
    },
  }

  const series = data.map(item => item.value)

  return <Chart options={options} series={series} type="pie" height={300} />
}

export default PieChart
