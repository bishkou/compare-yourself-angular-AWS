import { Component, OnInit, ViewChild } from '@angular/core';
import { CompareData } from '../compare-data.model';
import { NgForm } from '@angular/forms';

import { CompareService } from '../compare.service';

@Component({
  selector: 'app-compare-input',
  templateUrl: './compare-input.component.html',
  styleUrls: ['./compare-input.component.css']
})
export class CompareInputComponent implements OnInit {
  @ViewChild('compareForm') form: NgForm;
  isLoading = false;
  couldNotLoadData = false;

  constructor(private compareService: CompareService) {
  }

  ngOnInit() {
    this.compareService.dataIsLoading.subscribe(
      (isLoading: boolean) => this.isLoading = isLoading
    );
    this.compareService.dataLoadFailed.subscribe(
      (didFail: boolean) => {
        this.couldNotLoadData = didFail;
        this.isLoading = false;
      }
    );
  }

  onSubmit() {
    const data: CompareData = {
      age: this.form.value.age as number,
      height: this.form.value.height as number,
      income: this.form.value.income as number
    };
    this.compareService.onStoreData(data);
  }

  onFetchStoredData() {
    this.compareService.onRetrieveData(false);
  }
}
