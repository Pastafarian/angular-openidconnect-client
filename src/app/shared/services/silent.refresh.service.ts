import { Injectable } from '@angular/core';
import "rxjs/add/observable/interval";
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Injectable()
export class SilentRefreshService {

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  constructor(private idle: Idle, private keepalive: Keepalive) {

  }

  public start(tokenTimeoutSecs: number) {

    this.idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      console.log('Timed out ');
      this.timedOut = true;
    });
    this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    this.idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();

    // sets the ping interval to 15 seconds
    // this.keepalive.interval(15);

    //keepalive.onPing.subscribe(() => this.lastPing = new Date());

    /*
    const source = Observable.interval(tokenTimeoutSecs);

    const subscribe = source.subscribe(val => {
        console.log('silent refresh tick');

        if (environment.inactiveTimeOutLimit) {

        }
    });*/
  }

  reset() {
    console.log('idle watch');
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
}