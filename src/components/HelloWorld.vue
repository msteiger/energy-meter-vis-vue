<template>
  <div class="container">
    <div class="row">
        <div class="col-md-3">
            <button type="button" class="btn btn-outline-primary" id="buttonPrev" v-on:click="selectDate(-1)" >
                <i class="bi bi-arrow-left-square"></i>
            </button>
            <input type="text" readonly class="form-control align-bottom text-center" id="dateInput" style="display:inline; width:calc(100% - 93px);" >
            <button type="button" class="btn btn-outline-primary" id="buttonNext" v-on:click="selectDate(1)">
                <i class="bi bi-arrow-right-square"></i>
            </button>
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action my-1"
                    text="Daily"
                    data-type="timerange-button"
                    data-name="daily"
                    v-on:click="selectEvent($event.target)">
                </a>
            </div>
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action my-1"
                    text="Monthly"
                    data-type="timerange-button"
                    data-name="monthly"
                    v-on:click="selectEvent($event.target)">
                </a>
            </div>
        </div>
        <div class="col-md-9">
            <canvas id="myChart" style="height: 400px"></canvas>
        </div>
    </div>
</div>


</template>

<script>

import {DateTime} from 'luxon';
import 'chartjs-adapter-luxon';

const axios = require('axios').default;

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import chartData from './chart-data.js'

    var date = DateTime.now();
    var currentScaleButton = null;
    var myChart = null;

function getData(id, datestr, promise) {
    axios
    .get('http://raspberrypi:9090/data/inverter-ac-power/daily', { 
      params: { date: datestr } 
    })
    .then(response => {
      promise(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}

export default {
  name: 'HelloWorld',
  methods: {
   selectEvent: function(obj) {

        obj.classList.add("active"); // newly activated tab
        const dateStr = date.toISO().slice(0, 10);
        const scale = obj.getAttribute('data-name');
        if (currentScaleButton) {
            currentScaleButton.classList.remove("active") // previous active tab
        }
        currentScaleButton = obj;

        getData(scale, dateStr, function(response) {
            let root = response.data;

            myChart.data.labels = [];
            myChart.data.datasets[0].data = root.data;
            myChart.options.scales.xAxis.min = root.start;
            myChart.options.scales.xAxis.max = root.end;
            myChart.update();

            document.getElementById("dateInput").value = root.current;
            document.getElementById("buttonPrev").title = root.prev;
            document.getElementById("buttonNext").title = root.next;
        });
   },
   selectDate: function(delta) {
       date = date.plus({ days: delta });
       this.selectEvent(currentScaleButton);
    }
  },
  mounted() {
    const ctx = document.getElementById('myChart');
    myChart = new Chart(ctx, chartData);

    var first = document.querySelector('a[data-type="timerange-button"]');
    this.selectEvent(first);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
