import {StockPrice} from './stock-price';

export class ChartModel {
  x: string | number;
  y: number;

  public convertFromStockClosePrice(item: StockPrice): ChartModel {
    const dm: ChartModel = new ChartModel();
    dm.x = item.date;
    dm.y = item.close;
    return dm;
  }

  public convertFromStockOpenPrice(item: StockPrice): ChartModel {
    const dm: ChartModel = new ChartModel();
    dm.x = item.date;
    dm.y = item.open;
    return dm;
  }

  public convertFromPair(items: Array<any>): ChartModel {
    const dm: ChartModel = new ChartModel();
    dm.x = items[0];
    dm.y = items[1];
    return dm;
  }

  convertFromWeatherForecast(forecastData: Array<any>): Array<ChartModel[]> {
    const temperatureData: ChartModel[] = [];
    const maxTemperatureData: ChartModel[] = [];
    forecastData.forEach((item: any) => {
      const chartModelItem: ChartModel = new ChartModel();
      const chartModelItem1: ChartModel = new ChartModel();
      chartModelItem.x = item.date;
      chartModelItem.y = item.day.avgtemp_c;
      temperatureData.push(chartModelItem);
      chartModelItem1.x = item.date;
      chartModelItem1.y = item.day.maxtemp_c;
      maxTemperatureData.push(chartModelItem1);
    });
    const result = [temperatureData, maxTemperatureData];
    return result;
  }
}
