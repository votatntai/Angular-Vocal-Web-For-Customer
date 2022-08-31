import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { EndDeadlineValidator, StartDeadlineValidator } from 'src/app/validators/validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  loading: boolean = true;
  private ready: number[] = [];
  btnCreateLoading: boolean = false;

  projectCountries: string[] = [];
  projectGenders: string[] = [];
  projectUsagePurposes: string[] = [];
  projectVoiceStyles: string[] = [];

  countries: any[] = [];
  genders: any[] = [];
  usagePurposes: any[] = [];
  voiceStyles: any[] = [];

  constructor(private service: ProjectService, private form: UntypedFormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.getProjectGenders();
    this.getProjectCountries();
    this.getProjectUsagePurposes();
    this.getProjectVoiceStyles();
  }

  checkReady() {
    if (this.ready.length > 3) {
      this.loading = false;
    }
  }

  createForm = this.form.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(50)]],
    minAge: ['', [Validators.required, Validators.min(18), Validators.max(65)]],
    maxAge: ['', [Validators.required, Validators.min(18), Validators.max(65)]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    projectCountries: [this.projectCountries, [Validators.required]],
    projectGenders: [this.projectGenders, [Validators.required]],
    projectUsagePurposes: [this.projectUsagePurposes, [Validators.required]],
    projectVoiceStyles: [this.projectVoiceStyles, [Validators.required]],
  },
    {
      validator: [StartDeadlineValidator('startDate'), EndDeadlineValidator('startDate', 'endDate')]
    });

  setValueForForm() {
    this.createForm.controls['projectCountries'].setValue(this.projectCountries);
    this.createForm.controls['projectGenders'].setValue(this.projectGenders);
    this.createForm.controls['projectUsagePurposes'].setValue(this.projectUsagePurposes);
    this.createForm.controls['projectVoiceStyles'].setValue(this.projectVoiceStyles);
  }

  formSubmit() {
    this.btnCreateLoading = true;
    this.setValueForForm();
    if (this.createForm.valid) {
      var project: any = {
        name: this.createForm.value['name'],
        minAge: this.createForm.value['minAge'],
        maxAge: this.createForm.value['maxAge'],
        startDate: this.createForm.value['startDate'],
        endDate: this.createForm.value['endDate'],
        description: this.createForm.value['description'],
        projectCountries: this.createForm.value['projectCountries'],
        projectGenders: this.createForm.value['projectGenders'],
        projectUsagePurposes: this.createForm.value['projectUsagePurposes'],
        projectVoiceStyles: this.createForm.value['projectVoiceStyles']
      }
      this.service.postProject(project).subscribe(result => {
        var id = result!.body.id;
        this.btnCreateLoading = false;
        Swal.fire(
          'Thành công!',
          'Bạn đã tạo dự án mới thành công!',
          'success'
        ).then(result => {
          this.router.navigate(['/main/jobs/detail/' + id])
        })
      }, error => {
        this.btnCreateLoading = false;
        Swal.fire(
          'Xin lỗi!',
          'Đã có sự cố xảy xa, vui lòng liên hệ bộ phận hổ trợ!',
          'error'
        )
      })
    } else {
      this.btnCreateLoading = false;
      Swal.fire(
        'Thông báo!',
        'Bạn phải điền đầy đủ thông tin trước khi tạo dự án!',
        'warning'
      )
    }
  }

  addToCountries(name: string) {
    const array = this.projectCountries.includes(name)
    if (array) {
      var a = this.projectCountries.filter(x => x !== name)
      this.projectCountries = a;
    } else {
      this.projectCountries.push(name)
    }
  }

  addToGenders(name: string) {
    const array = this.projectGenders.includes(name)
    if (array) {
      var a = this.projectGenders.filter(x => x !== name)
      this.projectGenders = a;
    } else {
      this.projectGenders.push(name)
    }
  }

  addToUsagePurposes(name: string) {
    const array = this.projectUsagePurposes.includes(name)
    if (array) {
      var a = this.projectUsagePurposes.filter(x => x !== name)
      this.projectUsagePurposes = a;
    } else {
      this.projectUsagePurposes.push(name)
    }
  }

  addToVoiceStyles(name: string) {
    const array = this.projectVoiceStyles.includes(name)
    if (array) {
      var a = this.projectVoiceStyles.filter(x => x !== name)
      this.projectVoiceStyles = a;
    } else {
      this.projectVoiceStyles.push(name)
    }
  }

  getProjectGenders() {
    this.service.getProjectGenders().subscribe(result => {
      this.genders = result.body!['data'];
      this.ready.push(1);
      this.checkReady();
    })
  }

  getProjectCountries() {
    this.service.getProjectCountries().subscribe(result => {
      this.countries = result.body!['data'];
      this.ready.push(1);
      this.checkReady();
    })
  }

  getProjectUsagePurposes() {
    this.service.getProjectUsagePurposes().subscribe(result => {
      this.usagePurposes = result.body!['data'];
      this.ready.push(1);
      this.checkReady();
    })
  }

  getProjectVoiceStyles() {
    this.service.getProjectVoiceStyles().subscribe(result => {
      this.voiceStyles = result.body!['data'];
      this.ready.push(1);
      this.checkReady();
    })
  }

}
