import { Component, OnInit } from '@angular/core';
import {ChartModel} from '../../models/chart-model';
import {OpenApisService} from '../../services/openApis.service';
import {SelectedTimeRange, XAxisTypesEnum} from '../../common/commonEnums';

@Component({
  selector: 'app-weather-temperature',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit {

  public dateDataType = XAxisTypesEnum.Date;
  public weatherTemperatureData: ChartModel[];
  public weatherMaxTemperatureData: ChartModel[];
  public isLoading: boolean;
  public xLabel = 'Date';
  public yLabel = 'Temperature';
  public titleLabel = 'Weather temperature forecast for the next 5 days in Tel Aviv';
  public availableTimeRanges: SelectedTimeRange[] = [ SelectedTimeRange.All];
  constructor(private openApisService: OpenApisService) { }

  ngOnInit() {
    this.isLoading = true;
    this.openApisService.getWeatherTemperature().subscribe((data: Array<ChartModel[]>) => {
      this.weatherTemperatureData = data[0];
      this.weatherMaxTemperatureData = data[1];
      this.isLoading = false;
    });
  }
}
