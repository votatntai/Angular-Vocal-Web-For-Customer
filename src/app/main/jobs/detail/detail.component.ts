import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArtistProject, ProjectDetail } from 'src/app/models/project-detail.model';
import { Artist, VoiceDemo } from 'src/app/models/voical.model';
import { ProjectService } from 'src/app/services/project.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  loading: boolean = false;
  id: string;
  projectDetail: ProjectDetail;
  defaultAvatar: string = environment.defaultAvatar;
  artistProject: ArtistProject = {
    quickArtistResponse: {
      id: '',
      username: '',
      firstName: '',
      lastName: 0,
      email: '',
      phone: '',
      bio: '',
      gender: '',
      studio: 0,
      price: 0,
      rate: 0,
      status: '',
      avatar: '',
      countries: [],
      voiceStyles: [],
    },
    invitedDate: '',
    requestedDate: '',
    joinedDate: '',
    canceledDate: '',
    finishedDate: '',
    reviewDate: '',
    status: '',
    rate: 0,
    price: 0,
    comment: '',
  };
  artistVoiceDemo: VoiceDemo[] = [];
  listArtist: Artist[] = [];
  artistSearch: string = '';
  pageNumber: number = 1;
  pageSize: number = 5;

  btnCarryLoading: boolean = false;
  projectReady: boolean = false;
  voiceDemoLoading: boolean = false;
  canMakeDone: boolean = false;
  canFinishJob: boolean = false;
  canFinish: boolean[] = [];

  scriptToUpload: File | null = null;

  constructor(private router: ActivatedRoute, private service: ProjectService, private spinner: NgxSpinnerService,
    private currency: CurrencyPipe, private form: FormBuilder) { }

  ngOnInit(): void {
    this.id = this.router.snapshot.params['id'];
    this.getProjectById();
  }

  responseForm = this.form.group({
    comment: ['', [Validators.required, Validators.minLength(5)]]
  });

  rateArtistForm = this.form.group({
    comment: ['', [Validators.required, Validators.minLength(5)]],
    rate: ['', [Validators.required, Validators.minLength(5)]]
  });

  getProjectById() {
    this.loading = false;
    this.service.getProjectDetail(this.id).subscribe(result => {
      if (result.body != null) {
        this.projectDetail = result.body as any;
        this.checkArtistCanFinish();
        this.checkProjectCanFinish();
        if (this.projectDetail.status == 'Pending') {
          this.projectDetail.artistProject.forEach(artist => {
            if (artist.status == 'Accept') {
              this.projectReady = true;
            }
          });
        } else {
          this.projectReady = false;
        }
        this.loading = true;
      }
    }, error => {
      this.loading = true;
    });
  }

  checkArtistCanFinish() {
    if (this.projectDetail.status == 'Process') {
      this.projectDetail.artistProjectsFiles.forEach(file => {
        this.projectDetail.artistProject.forEach((artist, i) => {
          this.canFinish.push(false);
          if (file.userId == artist.quickArtistResponse.id && file.status == 'Accept' && artist.status == 'Accept') {
            this.canFinish[i] = true;
          }
        })
      })
    }
  }

  canFinishButton(index: number): boolean {
    if (this.projectDetail.artistProject[index].status == 'Accept') {
      if (this.canFinish.length > 0) {
        return this.canFinish[index].valueOf();
      }
    }
    return false;
  }

  checkProjectCanFinish() {
    if (this.projectDetail.status == 'Process') {
      var artistCount: number = this.projectDetail.artistProject.filter(artist => {
        if (artist.status == 'Accept' || artist.status == 'Done') {
          return true;
        } return false;
      }).length;
      var check: number = 0;
      this.projectDetail.artistProjectsFiles.forEach(file => {
        if (file.status == 'Pending') {
          return;
        }
        this.projectDetail.artistProject.forEach(artist => {
          if (file.userId == artist.quickArtistResponse.id && artist.status == 'Done' && file.status == 'Accept') {
            check = check + 1;
            if (check >= artistCount) {
              this.canMakeDone = true;
            }
          }
        })
      })
    }
  }

  downloadFile(url: string, fileName: string) {
    this.spinner.show();
    this.service.downloadFile(url).subscribe(result => {
      let blob: Blob = result.body as Blob;
      let a = document.createElement('a');
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      a.click();
      this.spinner.hide();
    });
  }

  downloadAudio(id: string, fileName: string) {
    this.spinner.show();
    this.service.downloadVoice(id).subscribe(result => {
      this.spinner.hide();
    }, error => {
      let a = document.createElement('a');
      a.download = fileName;
      a.href = error.error['text'];
      a.click();
      this.spinner.hide();
    });
  }

  acceptVoice(id: string) {
    if (this.responseForm.valid) {
      this.spinner.show();
      this.service.getVoiceAmout(id).subscribe(result => {
        if (result.status == 200) {
          this.spinner.hide();
          Swal.fire({
            title: 'Xác nhận!',
            text: "Thanh toán file này với giá " + this.currency.transform(result.body as number, 'VND') + " ?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Thanh toán'
          }).then((result) => {
            if (result.isConfirmed) {
              this.spinner.show();
              this.service.acceptVoice(id, this.responseForm.value.comment!).subscribe(result => {
                if (result.status === 200) {
                  this.spinner.hide();
                  Swal.fire(
                    'Thành công!',
                    'Bạn đã thanh toán Vocal thành công',
                    'success'
                  ).then(result => {
                    this.spinner.hide();
                    this.responseForm.reset();
                    this.getProjectById();
                  })
                }
              }, error => {
                if (error.status === 500) {
                  this.spinner.hide();
                  Swal.fire(
                    'Không thành công!',
                    'Số dư tài khoản của bạn không đủ',
                    'warning'
                  )
                }
              })
            }
          })
        }
      }, error => {
        this.spinner.hide();
      })
    }
  }

  denyVoice(id: string) {
    if (this.responseForm.valid) {
      Swal.fire({
        title: 'Xác nhận!',
        text: "Bạn có muốn từ chối vocal này không?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Từ Chối'
      }).then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          this.service.denyVoice(id, this.responseForm.value.comment!).subscribe(result => {
            if (result.status === 200) {
              this.spinner.hide();
              this.responseForm.reset();
              this.getProjectById();
            }
          }, error => {
            this.spinner.hide();
          })
        }
      })
    }
  }

  acceptArtist(artistId: string) {
    Swal.fire({
      title: 'Xác nhận!',
      text: "Bạn chắc chắn muốn thêm người này vào dự án?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Chấp Nhận'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.service.acceptAtist(this.projectDetail.id, artistId).subscribe(result => {
          if (result.status === 200) {
            this.spinner.hide();
            this.getProjectById();
          }
        }, error => {
          this.spinner.hide();
        })
      }
    })
  }

  denyArtist(artistId: string) {
    Swal.fire({
      title: 'Xác nhận!',
      text: "Bạn chắc chắn xóa người này khỏi dự án?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Từ Chối'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.service.denyAtist(this.projectDetail.id, artistId).subscribe(result => {
          if (result.status === 200) {
            this.spinner.hide();
            this.getProjectById();
          }
        }, error => {
          this.spinner.hide();
        })
      }
    })
  }

  carryOutProject() {
    Swal.fire({
      title: 'Xác nhận!',
      text: "Bạn có chắc chắn tiến hành dự án này?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Xác Nhận'
    }).then((result) => {
      if (result.isConfirmed) {
        this.btnCarryLoading = true;
        this.service.carryOutProject(this.projectDetail.id).subscribe(result => {
          this.btnCarryLoading = false;
          if (result.status === 200) {
            this.getProjectById();
          }
        })
      }
    })
  }

  getArtistProject(id: string) {
    this.projectDetail.artistProject.forEach(artist => {
      if (artist.quickArtistResponse.id == id) {
        this.getArtistVoiceDemo(id);
        this.artistProject = artist
      }
    })
  }

  getArtistVoiceDemo(id: string) {
    this.voiceDemoLoading = true;
    this.service.getArtistVoiceDemo(id).subscribe(result => {
      this.artistVoiceDemo = result.body['data']!;
      if (result.status == 200) {
        this.voiceDemoLoading = false;
      }
    })
  }

  makeArtistDone(id: string) {
    if (this.rateArtistForm.valid) {
      Swal.fire({
        title: 'Xác nhận!',
        text: "Bạn có chắc chắn kết thúc công việc của người này?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Xác Nhận'
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.makeArtistDone(this.projectDetail.id, id, this.rateArtistForm.get["comment"], this.rateArtistForm.get["rate"]).subscribe(result => {
            this.rateArtistForm.reset();
            this.getProjectById();
          })
        }
      })
    }
  }

  finishProject() {
    Swal.fire({
      title: 'Xác nhận!',
      text: "Bạn có chắc chắn kết thúc dự án này?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Xác Nhận'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.service.finishProject(this.projectDetail.id).subscribe(result => {
          this.spinner.hide();
          this.getProjectById();
        }, error => {
          this.spinner.hide();
        })
      }
    })
  }

  uploadScriptToProject(event: any) {
    var files = event.target.files;
    this.scriptToUpload = files.item(0);
    const formData: FormData = new FormData();
    formData.append('file', this.scriptToUpload!, this.scriptToUpload!.name);
    this.spinner.show();
    this.service.uploadScriptToProject(this.projectDetail.id, formData).subscribe(result => {
      this.spinner.hide();
      this.getProjectById();
    }, error => {
      this.spinner.hide();
      this.getProjectById();
    });
  }

  getListArtist() {
    this.service.getArtistReady(this.pageNumber, this.pageSize, this.artistSearch).subscribe(result => {
      this.listArtist = result.body!['data'];
      this.projectDetail.artistProject.forEach(artistInProject => {
        this.listArtist = this.listArtist.filter(artist => artist.id !== artistInProject.quickArtistResponse.id);
      })
    }, error => {
      if (error.status === 404) {
        this.listArtist = [];
      }
    })
  }

  inviteArtist(id: string) {
    Swal.fire({
      title: 'Xác nhận!',
      text: "Người này sẽ được thêm vào dự án của bạn?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Xác Nhận'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.service.inviteArtistToJoinProject(this.projectDetail.id, id).subscribe(result => {
          this.spinner.hide();
          this.listArtist = this.listArtist.filter(artist => artist.id !== id);
        }, error => {
          this.spinner.hide();
        })
      }
    })
  }
}