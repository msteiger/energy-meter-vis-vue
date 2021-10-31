<template>
  <div class="container">
    <div class="row">
        <div class="col-md-3">
            <button type="button" class="btn btn-outline-primary" id="buttonPrev" v-on:click="selectDate(myPrev)" >
                <i class="bi bi-arrow-left-square"></i>
            </button>
            <input type="text" readonly class="form-control align-bottom text-center" id="dateInput" style="display:inline; width:calc(100% - 93px);" >
            <button type="button" class="btn btn-outline-primary" id="buttonNext" v-on:click="selectDate(myNext)">
                <i class="bi bi-arrow-right-square"></i>
            </button>
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action my-1" v-bind:class="(myScale == 'daily') && 'active'"
                    text="Daily"
                    data-type="timerange-button"
                    data-name="daily"
                    v-on:click="selectScale('daily')">
                </a>
            </div>
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action my-1" v-bind:class="(myScale == 'monthly') && 'active'"
                    text="Monthly"
                    data-type="timerange-button"
                    data-name="monthly"
                    v-on:click="selectScale('monthly')">
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

import 'chartjs-adapter-luxon';

const axios = require('axios').default;

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import chartData from './chart-data.js'

var myChart = null;

function getData(scale, datestr, promise) {
  axios
    .get('http://raspberrypi:9090/data/inverter-ac-power/' + scale, { 
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
  data () {
    return {
      myPrev: null,
      myNext: null,
      myDate: null,
      myScale: 'daily'
    }
  },
  methods: {
    selectScale: function(scale) {
      if (scale != this.myScale) {
        this.myDate = null;
        this.myScale = scale;
        this.reloadData();
      }
    },
    selectDate: function(date) {
      this.myDate = date;
      this.reloadData();
    },
    reloadData: function() {
        console.log("Loading '" + this.myScale + "' for " + this.myDate);

        const myThis = this;

        getData(this.myScale, this.myDate, function(response) {
            let root = response.data;

            myChart.data.labels = [];
            myChart.data.datasets[0].data = root.data;
            myChart.options.scales.xAxis.min = root.start;
            myChart.options.scales.xAxis.max = root.end;
            myChart.update();

            document.getElementById("dateInput").value = root.current;
            document.getElementById("buttonPrev").title = root.prev;
            document.getElementById("buttonNext").title = root.next;

            myThis.myDate = root.current;
            myThis.myNext = root.next;
            myThis.myPrev = root.prev;
        });
    }
  },
  mounted() {
    const ctx = document.getElementById('myChart');
    myChart = new Chart(ctx, chartData);

    this.reloadData();
  }
}
</script>
