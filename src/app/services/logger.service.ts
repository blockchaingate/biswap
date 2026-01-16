import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

export enum LogLevel {
    Debug = 0,
    Info = 1,
    Warn = 2,
    Error = 3,
    None = 4
}

@Injectable({providedIn: 'root'})
export class LoggerService {
    private currentLevel : LogLevel;

    constructor() {
        this.currentLevel = environment.production ? LogLevel.Warn : LogLevel.Debug;
    }

    debug(message : string, ...args : any[]): void {
        this.log(LogLevel.Debug, message, args);
    }

    info(message : string, ...args : any[]): void {
        this.log(LogLevel.Info, message, args);
    }

    warn(message : string, ...args : any[]): void {
        this.log(LogLevel.Warn, message, args);
    }

    error(message : string, error? : any, ...args : any[]): void {
        this.log(LogLevel.Error, message, [
            ...args,
            error
        ]);
    }

    private log(level : LogLevel, message : string, args : any[]): void {
        if (level < this.currentLevel) {
            return;
        }

        const timestamp = new Date().toISOString();
        const levelName = LogLevel[level];
        const prefix = `[${timestamp}] [${levelName}]`;

        switch (level) {
            case LogLevel.Debug:
                console.debug(prefix, message, ...args);
                break;
            case LogLevel.Info:
                console.log(prefix, message, ...args);
                break;
            case LogLevel.Warn:
                console.warn(prefix, message, ...args);
                break;
            case LogLevel.Error:
                console.error(prefix, message, ...args);
                break;
        }
    }

    setLevel(level : LogLevel): void {
        this.currentLevel = level;
    }
}
