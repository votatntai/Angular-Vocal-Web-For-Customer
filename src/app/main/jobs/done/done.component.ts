import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css']
})
export class DoneComponent implements OnInit {

  loading: boolean = false;

  projects: Project[];
  projectsSecond: Project[];
  totalPage: number = 0;
  pageSize: number = 8;
  pageNumber: number = 1;
  isAsc: boolean = false;

  constructor(private service: ProjectService, private form: FormBuilder) { }

  ngOnInit(): void {
    this.getDoneProjects();
  }

  searchForm = this.form.group({
    search: ['']
  });

  searchDoneProjects() {
    if (this.searchForm.valid) {
      this.getDoneProjects(this.searchForm.value.search!);
    }
  }

  getDoneProjects(search?: string) {
    this.loading = false;
    this.service.getFinishProject(this.pageNumber, this.pageSize, this.isAsc, search).subscribe(result => {
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
      this.getDoneProjects(this.searchForm.value.search!);
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.loading = false;
      this.pageNumber -= 1;
      this.getDoneProjects(this.searchForm.value.search!);
    }
  }

  specificPage(number: number) {
    this.loading = false;
    this.pageNumber = number;
    this.getDoneProjects(this.searchForm.value.search!);
  }

}
