<template>
  <div class="container">
    <div class="row">
        <div class="col-md-3">
            <button type="button" class="btn btn-outline-primary" id="buttonPrev" v-on:click="selectDate(myPrev)" >
                <i class="bi bi-arrow-left-square"></i>
            </button>
            <input type="text" readonly class="form-control align-bottom text-center mx-1" id="dateInput" style="display:inline; width:calc(100% - 93px);" >
            <button type="button" class="btn btn-outline-primary" id="buttonNext" v-on:click="selectDate(myNext)">
                <i class="bi bi-arrow-right-square"></i>
            </button>
            <div class="my-1" />
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action" v-bind:class="(myScale == 'daily') && 'active'"
                    text="Daily"
                    data-type="timerange-button"
                    v-on:click="selectScale('daily')">
                </a>
            </div>
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action" v-bind:class="(myScale == 'monthly') && 'active'"
                    text="Monthly"
                    data-type="timerange-button"
                    v-on:click="selectScale('monthly')">
                </a>
            </div>

            <div class="my-3" />

            <div v-for="type in myTypeList" v-bind:key="type.id" class="list-group">
                <a href="#" class="list-group-item list-group-item-action" v-bind:class="(myType == type.id) && 'active'"
                    v-bind:text=type.name
                    v-on:click="selectType(type.id)">
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
import dataColors from './data-colors.js'

var myChart = null;

const host = 'localhost:9090'

function getData(scale, type, datestr, promise) {
  axios
    .get('http://' + host + '/data/' + type + '/' + scale, { 
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
      myScale: 'daily',
      myTypeList: [ 'inverter-ac-power', 'temperature' ],
      myType: 'inverter-ac-power'
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
    selectType: function(type) {
      this.myType = type;
      this.reloadData();
    },
    reloadData: function() {
        console.log("Loading '" + this.myScale + "' for " + "'" + this.myType + "'" + " on " + this.myDate);

        const myThis = this;

        getData(this.myScale, this.myType, this.myDate, function(response) {
            let root = response.data;
            const color = dataColors.get(root.desc.id) || dataColors.get('default');

            myChart.data.datasets.length = 0;
            myChart.data.datasets.push(
            {
                fill: true,
                borderColor: color,
                backgroundColor: color,
            });
            myChart.data.datasets[0].label = root.desc.name + ' (' + root.desc.unit + ')';
            myChart.data.datasets[0].data = root.data;
            myChart.options.scales.xAxis.min = root.start;
            myChart.options.scales.xAxis.max = root.end;
            myChart.options.scales.yAxis.min = root.desc.min;
            myChart.options.scales.yAxis.max = root.desc.max;
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

    axios.get('http://' + host + '/data').then(response => { 
      this.myTypeList = response.data; 
      this.myTypeList.push(
        {
          "id": "my-power",
          "name": "Power!",
          "unit": "W",
          "min": 0.0,
          "max": 7500.0
        },
        {
          "id": "my-temperature",
          "name": "Temperature!",
          "unit": "°C",
          "min": 0.0,
          "max": 100.0
        }
        )
    });

    this.reloadData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#buttonPrev:focus, #buttonNext:focus
{
    box-shadow: none;
}
</style>
