import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Vocal } from '../models/voical.model';

@Injectable({
    providedIn: 'root',
})
export class VocalService {
    private baseUrl = environment.baseUrl;

    private httpHeaders: HttpHeaders;

    constructor(private http: HttpClient) {
        this.httpHeaders = this.getHttpHeaders();
    }

    private getHttpHeaders(): HttpHeaders {
        var data = localStorage.getItem('USER');
        var headers = new HttpHeaders();
        if (data) {
            var user: User = JSON.parse(data);
            headers = headers.set('Content-Type', 'application/json; charset=utf-8');
            headers = headers.set('Authorization', 'Bearer ' + user.token);
        }
        return headers;
    }

    getVocalMusicTrending(pageNumber: number, pageSize: number) {
        var searchType = "Nhạc";
        var params = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchType: searchType
        }
        return this.http.get(this.baseUrl + '/api/v1/voice-demos/trending', {
            observe: 'response', headers: this.httpHeaders, params: params
        })
    }

    getVocalAudiobookTrending(pageNumber: number, pageSize: number) {
        var searchType = "Sách nói";
        var params = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchType: searchType
        }
        return this.http.get(this.baseUrl + '/api/v1/voice-demos/trending', {
            observe: 'response', headers: this.httpHeaders, params: params
        })
    }

    getVocalArtTrending(pageNumber: number, pageSize: number) {
        var searchType = "Nghệ thuật";
        var params = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchType: searchType
        }
        return this.http.get(this.baseUrl + '/api/v1/voice-demos/trending', {
            observe: 'response', headers: this.httpHeaders, params: params
        })
    }

    getVocalMusicRecommend(pageNumber: number, pageSize: number) {
        var searchType = "Nhạc";
        var params = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchType: searchType
        }
        return this.http.get(this.baseUrl + '/api/v1/voice-demos/recommend', {
            observe: 'response', headers: this.httpHeaders, params: params
        })
    }

    getVocalAudiobookRecommend() {
        var searchType = "Sách nói";
        var params = {
            searchType: searchType
        }
        return this.http.get(this.baseUrl + '/api/v1/voice-demos/recommend', {
            observe: 'response', headers: this.httpHeaders, params: params
        })
    }

    getVocalArtRecommend() {
        var searchType = "Nghệ thuật";
        var params = {
            searchType: searchType
        }
        return this.http.get(this.baseUrl + '/api/v1/voice-demos/recommend', {
            observe: 'response', headers: this.httpHeaders, params: params
        })
    }

    getNewVocal(pageNumber: number, pageSize: number) {
        var params = {
            pageNumber: pageNumber,
            pageSize: pageSize,
        }
        return this.http.get(this.baseUrl + '/api/v1/voice-demos/suitableTime', {
            observe: 'response', headers: this.httpHeaders, params: params
        })
    }

    getVocalDetail(id: string) {
        return this.http.get<Vocal>(this.baseUrl + '/api/v1/voice-demos/' + id, {
            observe: 'response', headers: this.httpHeaders
        })
    }

    updateListenTime(id: string, time: number) {
        var body: any = {
            voiceId: id,
            seconds: time
        }
        return this.http.put(this.baseUrl + '/api/v1/voice-demos/' + id + '/listening-time?seconds=' + time, body, {
            observe: 'response', headers: this.httpHeaders
        })
    }

    getVocalRating(id: string, pageNumber: number, pageSize: number) {
        var params = {
            pageNumber: pageNumber,
            pageSize: pageSize
        }
        return this.http.get(this.baseUrl + '/api/v1/voice-demos/' + id + '/rate', {
            observe: 'response', headers: this.httpHeaders, params
        })
    }

    postVocalRating(id: string, data: any) {
        return this.http.post(this.baseUrl + '/api/v1/voice-demos/' + id + '/rate', data, {
            observe: 'response', headers: this.httpHeaders
        })
    }
}