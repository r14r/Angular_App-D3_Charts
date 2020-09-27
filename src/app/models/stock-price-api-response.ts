import {StockPrice} from './stock-price';

export interface StockPriceApiResponse {
  historical: StockPrice[];
  Error: string;
}
