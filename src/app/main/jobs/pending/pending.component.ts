import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {

  loading: boolean = false;

  projects: Project[];
  projectsSecond: Project[];
  totalPage: number = 0;
  pageSize: number = 8;
  pageNumber: number = 1;
  isAsc: boolean = true;

  constructor(private service: ProjectService, private form: FormBuilder) { }

  ngOnInit(): void {
    this.getPendingProjects();
  }

  searchForm = this.form.group({
    search: ['']
  });

  searchPendingProjects() {
    if (this.searchForm.valid) {
      this.getPendingProjects(this.searchForm.value.search!);
    }
  }

  getPendingProjects(search?: string) {
    this.loading = false;
    this.service.getPendingProject(this.pageNumber, this.pageSize, this.isAsc, search).subscribe(result => {
      if (result.body != null) {
        var response: any = result.body;
        var totalRow = response['totalRow'];
        this.totalPage = Math.ceil((totalRow / this.pageSize));
        this.projects = response['data'];
        this.loading = true;
      }
    }, error => {
      if (error.status == 404) {
        this.projects = [];
        this.totalPage = 0;
        this.loading = true;
      }
    });
  }

  nextPage() {
    if (this.pageNumber < this.totalPage) {
      this.loading = false;
      this.pageNumber += 1;
      this.getPendingProjects(this.searchForm.value.search!);
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.loading = false;
      this.pageNumber -= 1;
      this.getPendingProjects(this.searchForm.value.search!);
    }
  }

  specificPage(number: number) {
    this.loading = false;
    this.pageNumber = number;
    this.getPendingProjects(this.searchForm.value.search!);
  }

}
