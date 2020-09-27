import {Component, OnInit} from '@angular/core';
import {ChartModel} from '../../models/chart-model';
import {OpenApisService} from '../../services/openApis.service';
import {SelectedTimeRange, XAxisTypesEnum} from '../../common/commonEnums';

@Component({
  selector: 'app-stock-price',
  templateUrl: './stock-price.component.html',
  styleUrls: ['./stock-price.component.scss']
})
export class StockPriceComponent implements OnInit {
  public dateDataType = XAxisTypesEnum.Date;
  public stockClosePricesData: ChartModel[];
  public isLoading: boolean;
  public xLabel = 'Date';
  public yLabel = 'Price';
  public titleLabel = 'Stock prices chart of Microsoft';
  public availableTimeRanges: SelectedTimeRange[] = [SelectedTimeRange.Before6Months,
    SelectedTimeRange.Before1Year, SelectedTimeRange.Before2Years, SelectedTimeRange.All];
  constructor(private openApisService: OpenApisService) { }

  ngOnInit() {
    this.selectionChanged(this.availableTimeRanges[0]);
  }

  selectionChanged(timeRange: SelectedTimeRange) {
    this.isLoading = true;
    this.openApisService.getStockPrices(timeRange).subscribe((data: ChartModel[]) => {
      this.stockClosePricesData = data;
      this.isLoading = false;
    });
  }
}
