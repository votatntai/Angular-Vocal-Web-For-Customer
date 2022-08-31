import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Vocal, VocalRating } from 'src/app/models/voical.model';
import { VocalService } from 'src/app/services/vocal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vocal-detail',
  templateUrl: './vocal-detail.component.html',
  styleUrls: ['./vocal-detail.component.css']
})
export class VocalDetailComponent implements OnInit, OnDestroy {

  private id: string;
  loading: boolean = true;
  activeComment: boolean = false;
  rotate: string = 'stop';
  vocal: Vocal;
  vocalRating: VocalRating = {
    totalContentRating: 0,
    totalRating: 0,
    totalVoiceRating: 0,
    voicesRating: []
  };
  commentRating: number = 0;
  duration: number = 0;
  totalTime: number = 0;
  timeOnPause: number = 0;
  timeOnPlay: number = 0;
  defaultTumbnail: string;
  private ready: number[] = [];

  constructor(private router: ActivatedRoute, private service: VocalService,
    private form: FormBuilder, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.id = this.router.snapshot.params['id'];
    this.defaultTumbnail = environment.defaultThumbnail;
    this.getVocalDetail();
  }

  checkReady() {
    if (this.ready.length > 0) {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.totalTime > 0) {
      this.service.updateListenTime(this.id, Math.round(this.totalTime)).subscribe(result => {
      });
    }
  }

  ratingForm = this.form.group({
    description: ['', [Validators.required, Validators.minLength(5)]],
    voiceRating: ['0', [Validators.required, Validators.max(5), Validators.min(1)]],
    contentRating: ['0', [Validators.required, Validators.max(5), Validators.min(1)]],
    title: 'Comment',
  });

  getVocalDetail() {
    this.service.getVocalDetail(this.id).subscribe(result => {
      if (result) {
        this.vocal = result.body!;
        this.getVocalRating(this.vocal.voiceId, 1, 3);
        this.ready.push(1);
        this.checkReady();
      }
    })
  }

  getVocalRating(id: string, pageNumber: number, pageSize: number) {
    this.service.getVocalRating(id, pageNumber, pageSize).subscribe(result => {
      this.vocalRating = result.body!['data'];
      var userId = JSON.parse(localStorage.getItem('USER')!).id;
      this.activeComment = true;
      this.vocalRating.voicesRating.forEach(comment => {
        if (comment.userId == userId) {
          this.activeComment = false;
        }
      })
      this.spinner.hide()
    }, error => {
      this.spinner.hide();
    })
  }

  postVocalRating(id: string) {
    if (this.ratingForm.valid) {
      this.spinner.show();
      this.service.postVocalRating(id, this.ratingForm.value).subscribe(result => {
        this.spinner.hide();
        this.getVocalRating(id, 1, 3);
      }, error => {
        this.spinner.hide();
      })
    }
  }

  canplay(audio: HTMLAudioElement) {
    this.duration = Math.floor(audio.duration);
  }

  onplay(audio: HTMLAudioElement) {
    this.timeOnPlay = audio.currentTime;
    this.rotate = 'rotating';
  }

  onpause(audio: HTMLAudioElement) {
    this.timeOnPause = audio.currentTime;
    this.totalTime = this.totalTime + (this.timeOnPause - this.timeOnPlay);
    this.rotate = 'stop';
  }

}
