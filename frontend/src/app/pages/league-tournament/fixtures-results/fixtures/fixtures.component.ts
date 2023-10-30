import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { coreConfig, AppConfig } from 'app/app-config';

@Component({
  selector: 'tab-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.scss'],
})
export class FixturesComponent implements OnInit {
  @Input() type: string;
  @Input() matches: any;
  @Input() teams: any;
  @Input() teamFilter: any;
  @ViewChild('acc', { static: false }) acc: NgbAccordion;
  coreConfig: any = coreConfig;
  AppConfig: any = AppConfig;
  activeIds = '';
  hasMatches = false;
  constructor(public _router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterContentChecked() {
    this.hasMatches = this.matches && Object.keys(this.matches).length > 0;
  }

  onSelectMatch(match) {
    this._router.navigate(['/leagues/matches', match.id, 'details']);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.matches &&
      changes.matches.currentValue !== changes.matches.previousValue
    ) {
      let matches = changes.matches.currentValue;

      this.activeIds = '';
      // subcribe to the changes of the matches
      for (let tours in matches) {
        let count = 0;
        for (let dates in matches[tours]) {
          if (tours && dates) {
            let key = tours.split('-')[1];
            let id = `panel-${key}-${count}`;
            this.activeIds += `${id},`;
          }
          count++;
        }
      }
    }
    //  teamFilter
    if (
      changes.teamFilter &&
      changes.teamFilter.currentValue !== changes.teamFilter.previousValue
    ) {
      this.checkMatchesInDate();
      // console.log('changes.teamFilter', changes.teamFilter.currentValue);
      // for (let tours in this.matches) {
      //   let count = 0;
      //   for (let dates in this.matches[tours]) {
      //     if (tours && dates) {
      //       let key = tours.split('-')[1];
      //       let id = `panel-${key}-${count}`;
      //       this.activeIds += `${id},`;
      //     }

      //     count++;
      //   }
      // }
    }
  }

  checkMatchesInDate() {
    setTimeout(() => {
      if (this.acc) {
        this.acc.panels.forEach((panel) => {
          let panelElement = panel.panelDiv;
          // get nativeElement of panel
          let table_containers =
            panelElement.querySelectorAll('.table-container');
          let hidePanel = true;
          table_containers.forEach((table_container) => {
            // get all table in table_container
            let tables = table_container.querySelectorAll('table');
            let hideContainer = true;
            tables.forEach((table) => {
              let table_css = getComputedStyle(table);
              let display = table_css.display;
              if (display != 'none') {
                hideContainer = false;
                // stop loop
                return;
              }
            });

            if (hideContainer) {
              table_container.setAttribute('style', 'display: none !important');
            } else {
              table_container.removeAttribute('style');
              hidePanel = false;
            }
          });

          if (hidePanel) {
            panelElement.parentElement.setAttribute(
              'style',
              'display: none !important'
            );
          } else {
            panelElement.parentElement.removeAttribute('style');
          }
        });
      }
    }, 500);
  }

  // date is object
  lengtMatchInDate(date: Object) {
    let count = 0;
    for (let key in date) {
      for (let key1 in date[key]) {
        count += date[key][key1].length;
      }
    }
    return count;
  }

  checkItem(item) {
    return false;
  }
}
