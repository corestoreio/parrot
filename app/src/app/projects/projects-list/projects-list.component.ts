import { Component, Input } from '@angular/core';

@Component({
  selector: 'projects-list',
  templateUrl: './projects-list.component.html'
})
export class ProjectsListComponent {
  @Input()
  projects;
}
