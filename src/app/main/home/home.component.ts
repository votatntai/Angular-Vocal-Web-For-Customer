import { Component, OnInit } from '@angular/core';
import { LocalData, Vocal } from 'src/app/models/voical.model';
import { VocalService } from 'src/app/services/vocal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading: boolean = true;

  localData: LocalData;

  musicTrendingVocals: Vocal[];
  audiobookTrendingVocals: Vocal[];
  artTrendingVocals: Vocal[];
  musicRecommendVocals: Vocal[];
  audiobookRecommendVocals: Vocal[];
  artRecommendVocals: Vocal[];
  newVocals: Vocal[];
  defaultThumbnail: string = environment.defaultThumbnail;

  private ready: number[] = [];

  private pageNumber: number = 1;
  private pageSize: number = 10;

  constructor(private service: VocalService) { }

  ngOnInit(): void {
    this.localData = JSON.parse(sessionStorage.getItem('HOMEPAGE')!);
    this.loading = true;
    if (this.localData) {
      this.musicTrendingVocals = this.localData.musicTrending
      this.musicRecommendVocals = this.localData.musicRecommend
      this.artTrendingVocals = this.localData.artTrending
      this.audiobookTrendingVocals = this.localData.audioTrending
      this.audiobookRecommendVocals = this.localData.audioRecommend
      this.artRecommendVocals = this.localData.artRecommend
      this.newVocals = this.localData.news
      this.loading = false;
    } else {
      this.getVocalMusicTrending();
      this.getVocalAudiobookTrending();
      this.getVocalArtTrending();
      this.getVocalMusicRecommend();
      this.getVocalAudiobookRecommend();
      this.getVocalArtRecommend();
      this.getNewVocal();
    }
  }

  swiperConfig: any = {
    slidesPerView: 'auto',
    spaceBetween: 20,
    breakpoints: {
      1300: {
        slidesPerView: 5,
        slidesPerGroup: 5
      },
      992: {
        slidesPerView: 4,
        slidesPerGroup: 4
      },
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3
      },
      480: {
        slidesPerView: 2,
        slidesPerGroup: 2
      },
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1
      }
    }
  }

  private checkReady() {
    if (this.ready.length >= 7) {
      this.localData = {
        musicTrending: this.musicTrendingVocals,
        audioTrending: this.audiobookTrendingVocals,
        artTrending: this.artTrendingVocals,
        musicRecommend: this.musicRecommendVocals,
        audioRecommend: this.audiobookRecommendVocals,
        artRecommend: this.artRecommendVocals,
        news: this.newVocals
      }
      sessionStorage.setItem('HOMEPAGE', JSON.stringify(this.localData))
      this.loading = false;
    }
  }

  async getVocalMusicTrending() {
    await this.service.getVocalMusicTrending(this.pageNumber, this.pageSize).subscribe(result => {
      if (result.body) {
        this.musicTrendingVocals = result.body['data'];
        this.ready.push(1);
        this.checkReady();
      }
    })
  }

  async getVocalAudiobookTrending() {
    await this.service.getVocalAudiobookTrending(this.pageNumber, this.pageSize).subscribe(result => {
      if (result.body) {
        this.audiobookTrendingVocals = result.body['data'];
        this.ready.push(2);
        this.checkReady();
      }
    })
  }

  async getVocalArtTrending() {
    await this.service.getVocalArtTrending(this.pageNumber, this.pageSize).subscribe(result => {
      if (result.body) {
        this.artTrendingVocals = result.body['data'];
        this.ready.push(3);
        this.checkReady();
      }
    })
  }

  async getVocalMusicRecommend() {
    await this.service.getVocalMusicRecommend(this.pageNumber, this.pageSize).subscribe(result => {
      if (result.body) {
        this.musicRecommendVocals = result.body['data'];
        this.ready.push(4);
        this.checkReady();
      }
    })
  }

  async getVocalAudiobookRecommend() {
    await this.service.getVocalAudiobookRecommend().subscribe(result => {
      if (result.body) {
        this.audiobookRecommendVocals = result.body['data'];
        this.ready.push(5);
        this.checkReady();
      }
    })
  }

  async getVocalArtRecommend() {
    await this.service.getVocalArtRecommend().subscribe(result => {
      if (result.body) {
        this.artRecommendVocals = result.body['data'];
        this.ready.push(6);
        this.checkReady();
      }
    })
  }

  async getNewVocal() {
    await this.service.getNewVocal(this.pageNumber, this.pageSize).subscribe(result => {
      if (result.body) {
        this.newVocals = result.body['data'];
        this.ready.push(7);
        this.checkReady();
      }
    })
  }
}