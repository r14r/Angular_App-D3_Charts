import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map, timeout} from 'rxjs/operators';
import {StockPrice} from '../models/stock-price';
import {HttpClient} from '@angular/common/http';
import {StockPriceApiResponse} from '../models/stock-price-api-response';
import {ChartModel} from '../models/chart-model';
import {ToastrService} from 'ngx-toastr';
import {BitcoinPriceApiResponse} from '../models/bitcoin-price-api-response';
import {DatesHelperService} from './dates-helper.service';
import {SelectedTimeRange} from '../common/commonEnums';
import {TimeoutError} from 'rxjs/internal/util/TimeoutError';

@Injectable({
  providedIn: 'root'
})

export class OpenApisService {
  private stocksApiBaseUrl = 'https://financialmodelingprep.com/api/v3/historical-price-full/MSFT';
  private bitCoinApiBaseUrl = 'https://api.coindesk.com/v1/bpi/historical/close.json';
  private weatherForecastApiBaseUrl = 'https://api.apixu.com/v1/forecast.json';
  private chartModel: ChartModel;
  private readonly MINUTE = 60000;

  constructor(private httpClient: HttpClient,
              private toaster: ToastrService,
              private datesUtil: DatesHelperService) {
    this.chartModel = new ChartModel();
  }

  public getStockPrices(timeRange: SelectedTimeRange): Observable<ChartModel[]> {
    let queryParams;
    if (timeRange === SelectedTimeRange.All) {
      queryParams = '';
    } else {
      const dates: string[] = this.datesUtil.convertFromTimeRange(timeRange);
      const from = dates[0];
      const to = dates[1];
      queryParams = `?from=${from}&to=${to}`;
    }

    return new Observable(observer => {
      this.httpClient
        .get<StockPriceApiResponse>(`${this.stocksApiBaseUrl}${queryParams}`)
        .pipe(timeout(this.MINUTE), map((r: StockPriceApiResponse) => (r && !r.Error && r.historical),
          catchError(this.handleError)))
        .subscribe((stockPrices: StockPrice[]) => {
          try {
            const result = stockPrices.map(stockItem => this.chartModel.convertFromStockClosePrice(stockItem));
            observer.next(result);
            observer.complete();
          } catch (e) {
            this.handleError(e);
          }
        }, err => {
          this.handleError(err);
        });
    });
  }

  public getBitcoinPrice(timeRange: SelectedTimeRange): Observable<ChartModel[]> {
    let queryParams;
    let from;
    let to;
    if (timeRange === SelectedTimeRange.All) {
      from = '2013-09-01';
      to = this.datesUtil.getDateNow();
    } else {
      const dates: string[] = this.datesUtil.convertFromTimeRange(timeRange);
      from = dates[0];
      to = dates[1];
    }
    queryParams = `?start=${from}&end=${to}`;
    return new Observable(observer => {
      this.httpClient
        .get(`${this.bitCoinApiBaseUrl}${queryParams}`)
        .pipe(timeout(this.MINUTE), map((r: BitcoinPriceApiResponse) => (r && r.bpi),
          catchError(this.handleError)))
        .subscribe((bitcoinPrices: object) => {
          try {
            const bitcoinPrice = Object.entries(bitcoinPrices);
            const bitcoinPricesResult = bitcoinPrice.map(bitcoinItem => this.chartModel.convertFromPair(bitcoinItem));
            observer.next(bitcoinPricesResult);
            observer.complete();
          } catch (e) {
            this.handleError(e);
          }
        }, err => {
          this.handleError(err);
        });
    });
  }

  public getWeatherTemperature(): Observable<Array<ChartModel[]>> {
    return new Observable(observer => {
      const queryParams = '?key=701fec5fdc6d4a85b6494937190906&q=Tel-Aviv&days=5';
      this.httpClient
        .get(`${this.weatherForecastApiBaseUrl}${queryParams}`)
        .pipe(timeout(this.MINUTE), map((r: any) => (r && r.forecast && r.forecast.forecastday),
          catchError(this.handleError)))
        .subscribe((forecastDataResponse: any) => {
          try {
            const result = this.chartModel.convertFromWeatherForecast(forecastDataResponse);
            observer.next(result);
            observer.complete();
          } catch (e) {
            this.handleError(e);
          }
        }, err => {
          this.handleError(err);
        });
    });
  }

  private handleError(error) {
    let errorMessage = '';
    if (error.name === 'TimeoutError') {
      errorMessage = `Request timeout`;
    } else if (error && error.error) {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    } else {
      errorMessage = ` Failed to parse results from API`;
    }
    console.error(errorMessage);
    this.toaster.error(errorMessage, 'Error', {
      timeOut: 200000
    });
    return throwError(errorMessage);
  }
}
