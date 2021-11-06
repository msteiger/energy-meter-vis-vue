export const chartData = {
    type: 'line',
    data: {
      datasets: [
        // to be filled later
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
