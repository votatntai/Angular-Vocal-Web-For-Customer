import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'status' })
export class StatusPipe implements PipeTransform {
    transform(status: string) {
        if (status == 'Done') {
            return 'Đã Hoàn Thành';
        }
        if (status == 'InvitePending') {
            return 'Đang Mời'
        }
        if (status == 'ResponsePending') {
            return 'Chờ Xác Nhận'
        }
        if (status == 'Pending') {
            return 'Chờ Tiến Hành'
        }
        if (status == 'Deny') {
            return 'Đã Từ Chối'
        }
        if (status == 'Accept') {
            return 'Đã Tham Gia'
        }
        if (status == 'Waiting') {
            return 'Chờ Phê Duyệt'
        }
        if (status == 'Process') {
            return 'Đang Tiến Hành'
        }
        else return status;
    }
}

@Pipe({ name: 'fileStatus' })
export class FileStatusPipe implements PipeTransform {
    transform(status: string) {
        if (status == 'Pending') {
            return 'Chờ Duyệt';
        }
        if (status == 'Accept') {
            return 'Đã Duyệt'
        }
        if (status == 'Deny') {
            return 'Bị Từ Chối'
        }
        else return status;
    }
}