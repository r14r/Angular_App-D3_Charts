import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SelectedTimeRange} from '../../common/commonEnums';

@Component({
  selector: 'app-custom-date-selector',
  templateUrl: './custom-date-selector.component.html',
  styleUrls: ['./custom-date-selector.component.scss']
})
export class CustomDateSelectorComponent implements OnInit {

  constructor() { }

  @Output() selectionChangeEvent = new EventEmitter<SelectedTimeRange>();
  @Input()
  availableTimeRanges: SelectedTimeRange[];

  @Input()
  isLoading;

  selected = 0;

  ngOnInit() {
  }

  selectionChanged() {
    this.selectionChangeEvent.emit(this.availableTimeRanges[this.selected]);
  }
}
