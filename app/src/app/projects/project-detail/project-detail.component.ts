import { Component, Input } from '@angular/core';

@Component({
  selector: 'project-detail',
  templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent {
  @Input()
  project;
}
