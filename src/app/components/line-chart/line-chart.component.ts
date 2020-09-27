import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';
import {Line} from 'd3';
import {ChartModel} from '../../models/chart-model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatButtonToggleChange} from '@angular/material';
import {SelectedThresholdTypeEnum, XAxisTypesEnum} from '../../common/commonEnums';
import {MathHelperService} from '../../services/math-helper.service';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnChanges {

  @ViewChild('chart', {static: true})
  private chartContainer: ElementRef;

  private margin = {top: 45, right: 50, bottom: 70, left: 65};
  private width: number;
  private height: number;
  private svg;
  private selectedThresholdType: SelectedThresholdTypeEnum = SelectedThresholdTypeEnum.Static;
  selectedThresholdTypeEnum = SelectedThresholdTypeEnum;
  @Input()
  line1VisibleData: ChartModel[];

  @Input()
  line2VisibleData: ChartModel[];

  @Input()
  loading: boolean;

  @Input()
  xAxisDataType: XAxisTypesEnum;

  @Input()
  TitleLabel: string;

  @Input()
  xAxisLabel: string;

  @Input()
  yAxisLabel: string;

  chartInputsForm = new FormGroup({}); // Instantiating our form

  readonly staticThresholdText: string = 'Static Threshold';
  readonly dynamicThresholdText: string = 'Dynamic Threshold';

  constructor(private formBuilder: FormBuilder,
              private mathUtil: MathHelperService) {
    this.createForm();
  }

  private createForm() {
    this.chartInputsForm = this.formBuilder.group({
      threshold: new FormControl('')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.line1VisibleData && changes.line1VisibleData.previousValue !== changes.line1VisibleData.currentValue)
      || (changes.line2VisibleData && changes.line2VisibleData.previousValue !== changes.line2VisibleData.currentValue)) {
      this.setFormValidators();
      if (this.selectedThresholdType === SelectedThresholdTypeEnum.Dynamic) {
        this.buildChartWithDynamicThreshold();
      } else {
        this.buildChartWithStaticThreshold();
      }
    }
  }

  private setFormValidators(): void {
    this.chartInputsForm.get('threshold').setValidators([Validators.min(0),
      Validators.max(this.calculateYMax(this.line1VisibleData, this.line2VisibleData))]);
  }

  private createXAxis(xScale: (num) => void): void {
    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(xScale as any)); // Create an axis component with d3.axisBottom
  }

  private createYAxis(yScale: (num) => void): void {
    this.svg.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScale as any)); // Create an axis component with d3.axisLeft
  }

  private lineGenerator(xScale, yScale): Line<ChartModel> {
    switch (this.xAxisDataType) {
      case XAxisTypesEnum.Number:
        return d3.line<ChartModel>()
          .x((d) => xScale(+d.x)) // set the x values for the line generator
          .y((d) => yScale(d.y)) // set the y values for the line generator
          .curve(d3.curveMonotoneX);
      case XAxisTypesEnum.Date:
        const parseTime = d3.timeParse('%Y-%m-%d');

        return d3.line<ChartModel>()
          .x((d) => xScale(parseTime(d.x as string))) // set the x values for the line generator
          .y((d) => yScale(d.y)) // set the y values for the line generator
          .curve(d3.curveMonotoneX);
    }
  }

  private createPath( line: Line<ChartModel>, threshold: number) {
    this.svg.append('path')
      .datum(this.line1VisibleData) // 10. Binds models to the line
      .attr('fill', 'none')
      .attr('class', threshold ? 'line' : 'line2')
      .attr('d', line);

    if (this.line2VisibleData) {
      this.svg.append('path')
        .datum(this.line2VisibleData) // 10. Binds models to the line
        .attr('fill', 'none')
        .attr('class',  threshold ? 'line' : 'line2')
        .attr('d', line);
    }
  }

  private createSVG(): void {
    const element = this.chartContainer.nativeElement;
    this.svg =  d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  public buildChart(threshold?: number) {
    d3.select('svg').remove();

    this.createSVG();

    this.width = this.chartContainer.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height =  this.chartContainer.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;

    let xScale;
    if (this.xAxisDataType === XAxisTypesEnum.Number) {
      xScale = d3
        .scaleLinear()
        .range([0, this.width])
        .domain([0, this.line1VisibleData.length]);
    } else {
      xScale = d3.scaleTime().range([0, this.width]);
      const parseTime = d3.timeParse('%Y-%m-%d');
      xScale.domain(d3.extent(this.line1VisibleData, d => parseTime(d.x as string)));
    }

    const yScale = d3.scaleLinear().rangeRound([this.height, 0])
      .domain([0, this.calculateYMax(this.line1VisibleData, this.line2VisibleData)]);

    const line = this.lineGenerator(xScale, yScale);

    this.createXAxis( xScale);

    this.createYAxis( yScale);

    this.drawChartLabels();

    this.createPath( line, threshold);

    if (threshold) {
      this.drawHorzionalLine( threshold, yScale);
      this.changeChartColorAccordingToLine( threshold, yScale);
    }
  }

  private changeChartColorAccordingToLine(threshold: number, yScale: (num) => void): void {
    this.svg.append('linearGradient')
      .attr('id', 'temperature-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', yScale(0))
      .attr('x2', 0).attr('y2', yScale(threshold))
      .selectAll('stop')
      .data([
        {offset: '100%', color: 'red'},
        {offset: '100%', color: 'blue'},
      ])
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);
  }

  private drawHorzionalLine(threshold: number, yScale: (num) => void): void {
    this.svg.append('line')
      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('y1', yScale(threshold))
      .attr('y2', yScale(threshold))
      .attr('class', 'horizontal-line');
  }

  public onResize() {
    this.buildChart();
  }

  private calculateYMax(line1Data: ChartModel[], line2Data: ChartModel[]): number {
    const yFactor = 1.3;
    if (line2Data) {
      return Math.max(d3.max(line1Data, d => d.y ) * yFactor,
        d3.max(line2Data, d => d.y  ) * yFactor);
    } else {
      return Math.floor(d3.max(line1Data, d => d.y ) * yFactor);
    }
  }

  private drawChartLabels() {
    this.svg.append('text')
      .attr('transform',
        'translate(' + (this.width / 2) + ' ,' +
        (this.height + this.margin.top + 20) + ')')
      .style('text-anchor', 'middle')
      .text(this.xAxisLabel);

    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - (this.height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.yAxisLabel);

    this.svg.append('text')
      .attr('x', (this.width / 2))
      .attr('y', 0 - (this.margin.top / 2))
      .attr('text-anchor', 'middle')
      .text(this.TitleLabel);
  }

  private getDataYValues(item: ChartModel): number {
    return item.y;
  }

  public onThresholdTypeButtonsChanged(event: MatButtonToggleChange) {
    this.selectedThresholdType = event.value;
    switch (this.selectedThresholdType) {
      case SelectedThresholdTypeEnum.Dynamic:
        this.buildChartWithDynamicThreshold();
        break;
      case SelectedThresholdTypeEnum.Static:
        this.buildChartWithStaticThreshold();
        break;
    }
  }

  private buildChartWithStaticThreshold(): void {
    if (this.chartInputsForm.get('threshold').valid) {
      if (this.chartInputsForm.get('threshold').value) {
        this.buildChart(this.chartInputsForm.get('threshold').value);
      } else {
        this.buildChart();
      }
    }
  }

  private buildChartWithDynamicThreshold(): void {
    const  line1DataYValues: number[] = this.line1VisibleData.map(this.getDataYValues);
    this.buildChart(this.mathUtil.calculate3Sigma(line1DataYValues));
  }

  public onThresholdFocusOut() {
    this.buildChartWithStaticThreshold();
  }
}
