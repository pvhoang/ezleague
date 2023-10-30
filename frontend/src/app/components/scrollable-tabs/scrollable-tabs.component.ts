import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'scrollable-tabs',
  templateUrl: './scrollable-tabs.component.html',
  styleUrls: ['./scrollable-tabs.component.scss'],
})
export class ScrollableTabsComponent implements AfterViewInit, OnInit {
  @Input() tabs: any = [];
  @Input() selectedIndex = 0;
  @Input() onSelectTab = new EventEmitter();
  @Input() onChangeIndex = new EventEmitter();
  abc: string;
  leftTabIdx = 0;
  atStart = true;
  atEnd = false;
  @Output() emitSelectedTab = new EventEmitter();
  private observer: IntersectionObserver;
  private observer2: IntersectionObserver;
  constructor() {}
  is_scolling = false;
  ngOnInit() {
    // this.abc = `translateX(0px)`; //  initial position
    if (this.selectedIndex > this.tabs.length - 1) {
      this.selectedIndex = 0;
    }
    this.onChangeIndex.subscribe((index) => {
      this.selectedIndex = index;
      this.scrolToCenter();
    });

    const options = {
      rootMargin: '-150px 0px -120px 0px',
      threshold: 0,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (!this.is_scolling) {
        entries.forEach((entry) => {
          if (entry.intersectionRatio <= 0) {
            const distance_bot =
              window.innerHeight - entry.boundingClientRect.y;
            const distance_top = entry.boundingClientRect.y;
            // console.log(distance_bot, distance_top);
            if (distance_bot <= 120) {
              this.onOutOfView(false);
            }
            if (distance_top <= 150) {
              this.onOutOfView(true);
            }
            this.observer.unobserve(entry.target);
          }
        });
      }
    }, options);

    this.observer2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // console.log('visible');
          setTimeout(() => {
            this.is_scolling = false;
            return;
          }, 6000);
        }
      });
    }, options);
  }

  onOutOfView(is_next = true) {
    if (is_next) {
      this.selectedIndex = this.selectedIndex + 1;
    } else {
      this.selectedIndex = this.selectedIndex - 1;
    }
    //  check index out of range
    if (this.selectedIndex < 0) {
      this.selectedIndex = 0;
    }
    if (this.selectedIndex > this.tabs.length - 1) {
      this.selectedIndex = this.tabs.length - 1;
    }
    this.onChangeIndex.emit(this.selectedIndex);
    // next tab
    if (this.tabs.length == 0) return;
    let tab = this.tabs[this.selectedIndex];
    let next_element = document.getElementById(tab.value);
    if (next_element) {
      this.observer.observe(next_element);
    }
  }

  selectTab(index) {
    this.is_scolling = true;
    this.selectedIndex = index;
    this.emitSelectedTab.emit(this.tabs[index]);
    this.scrolToCenter();
    let tab = this.tabs[this.selectedIndex];
    let element = document.getElementById(tab?.value);
    if (!element) {
      this.is_scolling = false;
      return;
    }
    this.observer2.observe(element);
    this.observer.observe(element);
  }

  // scroll to current tab
  scrolToCenter() {
    const tab = document.getElementById(`tab-${this.selectedIndex}`);
    if (tab) {
      //  scroll to center horizontally
      const tabCenter = tab.offsetLeft + tab.offsetWidth / 2;
      const container = document.getElementById('tabs-container');
      const containerCenter = container.offsetWidth / 2;
      const scrollLeft = tabCenter - containerCenter;
      //  scroll smoothly
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }

  ngAfterViewInit(): void {
    this.onSelectTab.subscribe((index) => {
      if (this.tabs.length == 0) return;
      setTimeout(() => {
        this.selectTab(index);
      });
    });
  }
}
