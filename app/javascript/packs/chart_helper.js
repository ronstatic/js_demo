import Chart from 'chart.js';
import 'chartjs-plugin-colorschemes';

const chartConfig = {
  type: 'line',
  data: {
    datasets: [],
  },
  options: {
    scales: {
      xAxes: [
        {
          type: 'time', // MANDATORY TO SHOW YOUR POINTS! (THIS IS THE IMPORTANT BIT)
          display: true, // mandatory
          scaleLabel: {
            display: true, // mandatory
            labelString: 'Time', // optional
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
};

export default class ChartHelper {
  constructor() {
    this.charts = {};
    this.datasets = {};
  }

  initPlots() {
    const canvases = document.querySelectorAll('.chart_area_canvas');

    if (canvases.length > 0) {
      canvases.forEach((canvas) => {
        const { plot_id: plotId } = canvas.dataset;
        console.log('The plot id is ', plotId);
        const ctx = canvas.getContext('2d');
        // Clone the config, so that multiple plots may work independently
        this.datasets[plotId] ||= [];
        this.charts[plotId] = new Chart(ctx, {
          ...chartConfig,
          data: {
            datasets: this.datasets[plotId],
          },
        });
      });
    }
  }

  addNewLine(plotId, projectId) {
    let found = false;
    this.datasets[plotId].forEach((dataset) => {
      if (dataset.projectId === projectId) {
        found = true;
      }
    });
    if (!found) {
      this.datasets[plotId].push({
        label: `Project ${projectId}`,
        data: [],
        borderWidth: 1,
        projectId,
      });
      this.charts[plotId].update();
    }
  }

  addNewPoint(plotId, projectId, data) {
    this.datasets[plotId].forEach((dataset) => {
      if (dataset.projectId === projectId) {
        dataset.data.push({
          x: new Date(data.ts),
          y: data.val,
        });
      }
    });
    this.charts[plotId].update();
  }

  clearPlot(plotId) {
    this.datasets[plotId] = [];
    this.charts[plotId].config.data = { datasets: this.datasets[plotId] };
    this.charts[plotId].update();
  }
}
