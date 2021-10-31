export const chartData = {
    type: 'line',
    data: {
      datasets: [
        {
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
        }
      ]
    },
    options: {
      animation: false,
      scales: {
        xAxis: {
          // The axis for this scale is determined from the first letter of the id as `'x'`
          // It is recommended to specify `position` and / or `axis` explicitly.
          type: 'time',
          time: {
            unit: 'hour'
          }
        },
        yAxis: {
        }
      },
      plugins: {
        legend: {
          display: false,
        }
      }
    }
};

export default chartData;
