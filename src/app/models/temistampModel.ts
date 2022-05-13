export class TimestampModel {
    minute: number = 0;
    hour: number = 0;
    day: number = 0;
    year: number = 0;

    constructor(minute: number, hour: number, day: number, year: number) {
        this.minute = minute;
        this.hour = hour;
        this.day = day;
        this.year = year;
    }
}