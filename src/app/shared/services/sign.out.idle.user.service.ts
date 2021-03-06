import { Injectable, EventEmitter } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

@Injectable()
export class SignOutIdleUserService {

    public onTimeoutWarning = this.idle.onTimeoutWarning;
    public onIdleStart = this.idle.onIdleStart;
    public onTimeout = this.idle.onTimeout;

    constructor(private idle: Idle) {
    }

    public init(timeoutSeconds: number, idleSeconds: number) {
        this.idle.setIdle(idleSeconds); // Time of inactive period before user considered idle
        this.idle.setTimeout(timeoutSeconds); // Time from idle to timeout event
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        this.idle.watch();
    }
}
