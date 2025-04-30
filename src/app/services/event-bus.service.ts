import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type EventBusEvent =
    | { type: 'task:created'; payload?: any }
    | { type: 'category:created'; payload?: any };

@Injectable({
    providedIn: 'root',
})
export class EventBusService {
    private eventSubject = new Subject<EventBusEvent>();
    public events$ = this.eventSubject.asObservable();

    emit(event: EventBusEvent) {
        this.eventSubject.next(event);
    }
}
