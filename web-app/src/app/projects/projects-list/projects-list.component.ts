import { Component, Input } from '@angular/core';

import { Project } from './../model/project';

@Component({
  selector: 'projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['projects-list.component.css']
})
export class ProjectsListComponent {
  @Input()
  public projects: Project[];
  @Input()
  private loading: boolean;
}
