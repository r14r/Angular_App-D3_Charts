import {Component, OnInit} from '@angular/core';
import {ChartModel} from '../../models/chart-model';
import {OpenApisService} from '../../services/openApis.service';
import {SelectedTimeRange, XAxisTypesEnum} from '../../common/commonEnums';

@Component({
  selector: 'app-bitcoin-price',
  templateUrl: './bitcoin-price.component.html',
  styleUrls: ['./bitcoin-price.component.scss']
})
export class BitcoinPriceComponent implements OnInit {

  public dateDataType = XAxisTypesEnum.Date;
  public bitcoinPricesData: ChartModel[];
  public isLoading: boolean;
  public xLabel = 'Date';
  public yLabel = 'Price';
  public titleLabel = 'Bitcoin prices chart';
  public availableTimeRanges: SelectedTimeRange[] = [SelectedTimeRange.Before6Months,
    SelectedTimeRange.Before1Year, SelectedTimeRange.Before2Years, SelectedTimeRange.All];

  constructor(private openApisService: OpenApisService) { }

  ngOnInit() {
    this.selectionChanged(this.availableTimeRanges[0]);
  }

  selectionChanged(timeRange: SelectedTimeRange) {
    this.isLoading = true;
    this.openApisService.getBitcoinPrice(timeRange).subscribe((data: ChartModel[]) => {
      this.bitcoinPricesData = data;
      this.isLoading = false;
    });
  }
}
