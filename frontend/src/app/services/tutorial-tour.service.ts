import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TutorialTourService {
  constructor() {}

  public getTutorialTourStatus(id: string) {
    let status = localStorage.getItem('tutorial_tour_' + id);
    console.log(status);

    if (status === 'true') {
      return status === 'true';
    }
    return false;
  }

  public setTutorialTourStatus(id: string, status: boolean) {
    return localStorage.setItem('tutorial_tour_' + id, status.toString());
  }
}
