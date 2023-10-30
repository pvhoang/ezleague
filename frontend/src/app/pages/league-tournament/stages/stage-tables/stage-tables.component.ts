import { Component, Input, OnInit } from '@angular/core';
import { StageService } from 'app/services/stage.service';

@Component({
  selector: 'stage-tables',
  templateUrl: './stage-tables.component.html',
  styleUrls: ['./stage-tables.component.scss']
})
export class StageTablesComponent implements OnInit {
  @Input() tableData: any;

  constructor(private stageService: StageService) { }

  ngOnInit(): void {
  }

  // function use http to call to API {stage_id}/table to get the table data
 
}
