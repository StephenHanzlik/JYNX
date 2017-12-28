import { Component, OnInit } from '@angular/core';
import * as D3 from "d3";
//import * as d3pie from 'd3pie';
import 'd3pie';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})

export class ChartsComponent implements OnInit {

  public data: any = {};
  //public d3pie: any;


  constructor() { }

  ngOnInit() {
  this.data = {

  "header": {
    "title": {
      "text": "JYNX",
      "fontSize": 24,
      "font": "open sans"
    },
    "subtitle": {
      "text": "Your cryptocurrency portfolio",
      "color": "#999999",
      "fontSize": 12,
      "font": "open sans"
    },
    "titleSubtitlePadding": 9
  },
  "footer": {
    "color": "#999999",
    "fontSize": 10,
    "font": "open sans",
    "location": "bottom-left"
  },
  "size": {
    "canvasWidth": 590,
    "pieOuterRadius": "90%"
  },
  "data": {
    "sortOrder": "value-desc",
    "content": [{
      "label": "Select a coin to get started",
      "value": 67706,
      "color": "#CEE9F9"
    }]
  },
  "labels": {
    "outer": {
      "pieDistance": 32
    },
    "inner": {
      "hideWhenLessThanPercentage": 3
    },
    "mainLabel": {
      "fontSize": 11
    },
    "percentage": {
      "color": "#ffffff",
      "decimalPlaces": 0
    },
    "value": {
      "color": "#adadad",
      "fontSize": 11
    },
    "lines": {
      "enabled": true
    },
    "truncation": {
      "enabled": true
    }
  },
  "effects": {
    "pullOutSegmentOnClick": {
      "effect": "linear",
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "gradient": {
      "enabled": true,
      "percentage": 100
    }
  }
}



  var pie = new d3pie("myPie", this.data);


  }
}
