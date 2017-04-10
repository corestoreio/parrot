import { Component, OnInit, Input } from '@angular/core';

import { User } from './../../users/model';
import { UserService } from './../../users/services/user.service';

@Component({
    selector: 'account-page',
    templateUrl: 'account-page.component.html'
})
export class AccountPage implements OnInit {
    public user: User;
    public loading: boolean = false;

    constructor(private service: UserService) { }

    ngOnInit() {
        this.loading = true;
        this.service.getUserSelf()
            .subscribe(
            user => this.user = user,
            err => console.log(err),
            () => this.loading = false,
        )
    }
}
