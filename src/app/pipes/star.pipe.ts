import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'star' })
export class StarPipe implements PipeTransform {
    transform(star: number): number {
        return Math.round(star * 2) / 2;
    }
}