import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly stockPricesTab: string = 'Stock Prices';
  readonly bitcoinPricesTab: string = 'Bitcoin Prices';
  readonly weatherForecastTab: string = 'Weather Forecast';
  readonly chartsProjectTitle: string = 'Charts Project';
  constructor() {
  }
}


