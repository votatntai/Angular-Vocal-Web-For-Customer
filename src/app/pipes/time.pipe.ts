import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'hour' })

export class SecondToHourPipe implements PipeTransform {
    transform(time: number): string {
        var second: number = 0;
        var minute: number = 0;
        var hour: number = 0;
        if (time < 3600) {
            second = time % 60;
            minute = Math.floor(time / 60);
        } else {
            hour = Math.floor(time / 3600);
            var x = time % 3600;
            minute = Math.floor(x / 60);
            second = time % 60;
        }
        if (hour > 0) {
            return hour + ' giờ ' + minute + ' phút ' + second + ' giây ';
        } else if (minute > 0) {
            return minute + ' phút ' + second + ' giây ';
        } else if (second > 0) {
            return second + ' giây ';
        }
        return 'Chưa có'
    }
}