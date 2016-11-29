import { Component, Input } from '@angular/core';

import { Project } from './../model/project';

@Component({
  selector: 'projects-list',
  templateUrl: './projects-list.component.html'
})
export class ProjectsListComponent {
  @Input()
  private projects: Project[];
  @Input()
  private loading: boolean;
}
