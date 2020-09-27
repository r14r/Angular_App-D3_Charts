import { Injectable } from '@angular/core';
import {SelectedTimeRange} from '../common/commonEnums';

@Injectable({
  providedIn: 'root'
})
export class DatesHelperService {

  constructor() { }


  public getDateNow(): string {
    return this.convertFromDateToString(new Date());
  }
  public getDateBefore6Months(): string {
    const newDate = this.addMonths(new Date(), -6);
    return this.convertFromDateToString(newDate);
  }

  public getDateBefore1Year(): string {
    const newDate = this.addMonths(new Date(), -12);
    return this.convertFromDateToString(newDate);
  }

  public getDateBefore2Year(): string {
    const newDate = this.addMonths(new Date(), -24);
    return this.convertFromDateToString(newDate);
  }

  private addMonths(date, months): Date {
    date.setMonth(date.getMonth() + months);
    return date;
  }

  private convertFromDateToString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public convertFromTimeRange(timeRange: SelectedTimeRange): Array<string> {
    let start;
    switch (timeRange) {
      case SelectedTimeRange.Before6Months:
        start = this.getDateBefore6Months();
        break;

      case SelectedTimeRange.Before1Year:
        start = this.getDateBefore1Year();
        break;

      case SelectedTimeRange.Before2Years:
        start = this.getDateBefore2Year();
    }
    const end = this.getDateNow();
    const result = [start, end];
    return result;
  }
}
