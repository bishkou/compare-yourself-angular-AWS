import { Component, OnInit } from '@angular/core';
import { CompareService } from './compare.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  doInput = true;
  constructor(private compareService: CompareService) {}
  ngOnInit() {
    this.compareService.dataEdited.subscribe(
      (edited: boolean) => this.doInput = !edited
    );
  }
}
