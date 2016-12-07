import { Component, OnInit, Input } from '@angular/core';

import { User } from './../model';
import { UserService } from './../services/user.service';

@Component({
  selector: 'account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  @Input()
  private user: User;

  constructor(private service: UserService) { }

  ngOnInit() {
    this.service.getUserSelf()
      .subscribe(
      user => this.user = user,
      err => console.log(err)
      )
  }

}
