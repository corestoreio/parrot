import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProjectMenuService {
  private _menuActive = new BehaviorSubject<boolean>(false);
  public get menuActive(): Observable<boolean> {
    return this._menuActive.asObservable();
  }

  setActive() {
    this._menuActive.next(true);
  }

  setInactive() {
    this._menuActive.next(false);
  }
}
