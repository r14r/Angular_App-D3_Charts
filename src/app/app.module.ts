import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {HttpClientModule} from '@angular/common/http';
import { StockPriceComponent } from './components/stock-price/stock-price.component';
import { BitcoinPriceComponent } from './components/bitcoin-price/bitcoin-price.component';
import {ToastrModule} from 'ngx-toastr';
import { WeatherForecastComponent } from './components/weather-forecast/weather-forecast.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import { CustomDateSelectorComponent } from './components/custom-date-selector/custom-date-selector.component';


@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    StockPriceComponent,
    BitcoinPriceComponent,
    WeatherForecastComponent,
    CustomDateSelectorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTabsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MatToolbarModule,
    MatButtonToggleModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
