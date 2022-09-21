import dayjs, { Dayjs } from "dayjs";
import { DocumentVisibilityState } from "@/utils/types";
import { Nullable } from "@/utils/generics";

export type VisibilityStateObserver = ({event,  hiddenAt, visibilityState }: {event: Event, hiddenAt: Nullable<Dayjs>, visibilityState: DocumentVisibilityState }) => void;

export default new class VisibilityStateEventEmitter {

    private _observers!: VisibilityStateObserver[];

    private hiddenAt: Nullable<Dayjs> = null;

    isVisibile = false;

    constructor() {
        this._observers = [];
        document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
    }

    subscribe(observer: VisibilityStateObserver): void {
        this._observers.push(observer);
    }

    private onVisibilityChange(event: Event): void {
        const {visibilityState} = document;
        switch (visibilityState) {
            case 'hidden':
            case 'visible':
                this.notify(event, visibilityState);
                break;
            default:
                this.hiddenAt = null;
                break;
        }
    }

    private notify(event: Event, visibilityState: DocumentVisibilityState): void {
        this.isVisibile = visibilityState === 'visible';
        if (visibilityState === 'hidden') {
            this.hiddenAt = dayjs();
        }
        if (this._observers?.length) {
            this._observers.forEach(observer => observer({
                event,
                hiddenAt: this.hiddenAt,
                visibilityState
            }));
        }
    }
}