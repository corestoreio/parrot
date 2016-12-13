import { Component, OnInit, Input } from '@angular/core';

import { User } from './../model';

@Component({
  selector: 'account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  @Input()
  private user: User;
  @Input()
  private loading: boolean = false;

  constructor() { }

  ngOnInit() { }

}
