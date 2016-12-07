import { Component, OnInit, Input } from '@angular/core';

import { APIAccessService } from './../services/api-access.service';

@Component({
  selector: 'register-app',
  templateUrl: './register-app.component.html',
  styleUrls: ['./register-app.component.css']
})
export class RegisterAppComponent implements OnInit {
  @Input()
  private projectId: string;

  private appName: string;
  private modalOpen: boolean;
  private loading: boolean;

  constructor(private service: APIAccessService) { }

  ngOnInit() { }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.reset();
  }

  reset() {
    this.appName = '';
  }

  registerApp() {
    this.loading = true;
    this.service.registerApp(this.projectId, this.appName)
      .subscribe(
      () => this.closeModal(),
      err => {
        console.log(err);
        this.loading = false;
      },
    );
  }
}
