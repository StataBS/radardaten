import {Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit} from '@angular/core';

import {
  D3Service,
  D3,
  Axis,
  BrushBehavior,
  BrushSelection,
  D3BrushEvent,
  ScaleLinear,
  ScaleOrdinal,
  Selection,
  Transition
} from 'd3-ng2-service';
import {DataService} from "../../shared/data-service.service";
import {Radar} from "../../shared/radar";
import * as moment from 'moment';
import {ColorService} from "../../shared/color.service";

declare var $:any;

@Component({
  selector: 'app-d3graph',
  templateUrl: './d3graph-component.html',
  styleUrls: ['./d3graph-component.css']
})
export class D3graphComponent implements OnInit, OnChanges {

  //NEW
  json: any;
  dataa = `007	13:40:12	20.02.15	1	3.5
006	13:40:13	20.02.15	1	3.6
008	13:40:14	20.02.15	1	3.6
013	13:40:43	20.02.15	1	4.5
009	13:41:02	20.02.15	1	2.8
016	13:43:15	20.02.15	1	3.7
014	13:43:19	20.02.15	1	4.6
016	13:44:03	20.02.15	1	3.7
018	13:45:48	20.02.15	1	3.8
016	13:46:44	20.02.15	1	4.8
012	13:47:30	20.02.15	1	4.2
005	13:48:16	20.02.15	1	3.8
007	13:48:18	20.02.15	1	3.9
014	13:49:10	20.02.15	1	3.9
010	13:49:28	20.02.15	1	4.1
017	13:49:31	20.02.15	1	4.5
017	13:49:49	20.02.15	1	5.2
009	13:50:14	20.02.15	1	3.8
016	13:50:36	20.02.15	1	2.2`;


  @Input() data: any[];

  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;

  private d3ParentElement: any;
  private svg: any;
  private name: string;
  private yVal: number;
  private colors: any = [];
  private padding: number = 25;
  private width: number;
  private height: number = 300;
  private xScale: any;
  private yScale: any;
  private xColor: any;
  private xAxis: any;
  private yAxis: any;
  private rects: any;

  constructor(
    element: ElementRef,
    private ngZone: NgZone,
    d3Service: D3Service,
    private dataService: DataService,
    private colorService: ColorService
  ){
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
    moment.locale('de-ch');
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes.data && changes.data.currentValue && !changes.data.previousValue) {
      this.initChart();
      this.updateChart();
    } else if (changes.data && changes.data.currentValue) {
      this.updateChart();
    }
  }

  initChart() {
    let self = this;
    let d3 = this.d3;
    this.width = $("#map").width();
    this.json = d3.tsvParseRows(this.dataa);
    console.log('hihi')
    console.log(this.json);

    if (this.parentNativeElement !== null) {
      self.svg = d3.select(this.parentNativeElement)
        .append('svg')        // create an <svg> element
        .attr('width', self.width) // set its dimensions
        .attr('height', self.height);

      self.colors = ['red', 'yellow', 'green', 'blue'];

      self.data = this.data;

      self.xScale = d3.scaleBand()
        .domain(self.data.map(function(d) { return d.timestamp; }))
        .range([0, (self.width - (2*self.padding))])
        .padding(.1);

      self.yScale = d3.scaleLinear()
        .domain([1, 0])
        .range([0, (self.height- (2*self.padding))]);

      self.xAxis = d3.axisBottom(self.xScale) // d3.js v.4
        .scale(self.xScale)
        .ticks(24)
        .tickFormat((d: string) => moment(d).format("LT"));

      self.yAxis = d3.axisLeft(self.xScale) // d3.js v.4
        .scale(self.yScale)
        .ticks(7);

      self.svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (self.padding) + "," + self.padding + ")")
        .call(self.yAxis);

      self.svg.append('g')            // create a <g> element
        .attr('class', 'axis')   // specify classes
        .attr("transform", "translate(" + self.padding + "," + (self.height - self.padding) + ")")
        .call(self.xAxis);            // let the axis do its thing
    }
  }

  updateChart() {
    let self = this;
    self.rects = self.svg.selectAll('rect')
      .data(self.data);

    self.rects
      .enter()
      .append('rect')
      .attr('x', function(d,i) {
        return self.xScale(d.timestamp) + self.padding;
      })
      .attr('y', function(d) {
        return self.yScale(d.speeding_quote) + self.padding;
      })
      // .attr("transform","translate(" + (self.padding -5  + 25) + "," + (self.padding - 5) + ")")
      .attr('height', function(d) {
        return self.height - self.yScale(d.speeding_quote) - (2*self.padding)})
      .attr('width', self.xScale.bandwidth())
      .attr('fill', function(d, i) {
        return self.colorService.perc2color2((1-d.speeding_quote) * 100);
      });

    self.rects
      .transition()
      .attr('x', function(d,i) {
        return self.xScale(d.timestamp) + self.padding;
      })
      .attr('y', function(d) {
        return self.yScale(d.speeding_quote) + self.padding;
      })
      // .attr("transform","translate(" + (self.padding -5  + 25) + "," + (self.padding - 5) + ")")
      .attr('height', function(d) {
        return self.height - self.yScale(d.speeding_quote) - (2*self.padding)})
      .attr('width', self.xScale.bandwidth())
      .attr('fill', function(d, i) {
        return self.colorService.perc2color2((1-d.speeding_quote) * 100);
      });
  }
}
