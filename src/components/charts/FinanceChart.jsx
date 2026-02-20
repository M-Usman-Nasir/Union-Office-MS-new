import { useMemo } from 'react'
import Chart from 'react-apexcharts'

const FinanceChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || !data.length) {
      return null
    }

    // Group by date
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item.transaction_date).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0 }
      }
      if (item.transaction_type === 'income') {
        acc[date].income += parseFloat(item.amount || 0)
      } else {
        acc[date].expense += parseFloat(item.amount || 0)
      }
      return acc
    }, {})

    const categories = Object.keys(grouped).sort()
    const income = categories.map(date => grouped[date].income)
    const expense = categories.map(date => grouped[date].expense)

    return { income, expense, categories }
  }, [data])

  if (!chartData) {
    return null
  }

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
      categories: chartData.categories,
    },
    yaxis: {
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
    legend: {
      position: 'top',
    },
    colors: ['#4caf50', '#f44336'],
  }

  const series = [
    {
      name: 'Income',
      data: chartData.income,
    },
    {
      name: 'Expense',
      data: chartData.expense,
    },
  ]

  return <Chart options={options} series={series} type="line" height={300} />
}

export default FinanceChart
