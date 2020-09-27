import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathHelperService {

  constructor() { }

  public calculate3Sigma(data: number[]): number {
    if (data.length < 2)  {
      return 0;
    }
    const average = this.calculateAverage(data);
    const variance = this.calculateVariance(data, average);
    const sd = Math.sqrt(variance);
    return ( 3 * sd) + average;
  }



  private calculateVariance(items: number[], average: number): number {
    let v = 0;
    items.forEach((item: number) => {
      v = v + (item - average) * (item - average);
    });
    return v / items.length;
  }

  private calculateAverage(items: number[]): number {
    let sum = 0;
    items.forEach((item: number) => {
      sum = sum + item;
    });
    return sum / items.length;
  }
}
