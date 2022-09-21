import {SOCKET_CONNECTIONS, SOCKET_EVENTS} from './constants';
import {isEquivalent} from './object';

interface WebsocketConnectionOptions {
    token: string
    retryConnectionInterval?: number
    heartbeatInterval?: number
    heartbeatMessage?: string
}

interface IMessageCallbackRegister {
    filters?: {key: string | string[]
    regex: RegExp}[]
    callback: (item: any) => void
}

interface IEventCallbackRegister {
    event: SOCKET_EVENTS
    callback: (socket: WebsocketConnection) => void
}

interface ICallbackRegister {
    filters?: {key: string | string[], regex: RegExp}[]
    callback: (item: any) => void
}

export class WebsocketConnection {
    url = '';
    token: string | null = null;
    key: SOCKET_CONNECTIONS | null = null;
    socket: WebSocket | null = null;
    isOnline = false;
    isStale = false;
    isReconnecting = false;

    #messageRegistry: ICallbackRegister[] = [];
    #eventRegistry: {[key in SOCKET_EVENTS]: ((socket: WebsocketConnection) => void)[]} = {
        [SOCKET_EVENTS.CONNECT]: [],
        [SOCKET_EVENTS.ONLINE]: [],
        [SOCKET_EVENTS.DISCONNECT]: [],
        [SOCKET_EVENTS.OFFLINE]: [],
        [SOCKET_EVENTS.STALE]: [],
        [SOCKET_EVENTS.RECONNECT]: []
    };
    #heartbeatMessage = 'keep-alive';
    #heartbeatInterval = 30000;
    #heartbeatIntervalID: number | null = null;
    #heartbeatCount = 0;
    #retryConnectionInterval = 15000;
    #retryConnectionID: number | null = null;

    constructor(key: SOCKET_CONNECTIONS, url: string, options: WebsocketConnectionOptions) {
        const {token, heartbeatInterval, heartbeatMessage, retryConnectionInterval} = options
        this.key = key;
        this.url = url;
        this.token = token;
        if (heartbeatMessage) this.#heartbeatMessage = heartbeatMessage;
        if (heartbeatInterval) this.#heartbeatInterval = heartbeatInterval;
        if (retryConnectionInterval) this.#retryConnectionInterval = retryConnectionInterval;
    }

    public connect() {
        const resolvedURL = this.token ? `${this.url}?token=${this.token}` : this.url;
        if(!this.socket) this.sendEvent(SOCKET_EVENTS.CONNECT);
        this.socket = new window.WebSocket(resolvedURL);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
    }

    public disconnect(code?: number, reason?: string) {
        this.socket?.close(code, reason);
        
        this.sendEvent(SOCKET_EVENTS.DISCONNECT);
    }

    public send(message: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if (this.socket && this.socket.readyState === this.socket.OPEN) this.socket.send(message);
    }

    public registerMessageCallback<T>(callback: IMessageCallbackRegister) {
        this.#messageRegistry.push(callback);
    }

    public unregisterMessageCallback(filters) {
        this.#messageRegistry = this.#messageRegistry.filter(item => !isEquivalent(item.filters, filters));
    }

    public registerEventCallback<T>(eventHandler: IEventCallbackRegister) {
        const {event, callback} = eventHandler;
        this.#eventRegistry[event].push(callback);
    }

    public unregisterEventCallback(eventHandler: IEventCallbackRegister) {
        const {event, callback} = eventHandler;
        this.#eventRegistry[event] = this.#eventRegistry[event].filter(item => item !== callback);
    }

    private sendEvent(event: SOCKET_EVENTS) {
        this.#eventRegistry[event].forEach(func => func(this));
    }

    private setIsOnline(value: boolean) {
        this.isOnline = value;
    }

    private setIsReconnecting(value: boolean) {
        this.isReconnecting = value;
    }

    private setIsStale(value: boolean) {
        this.isStale = value;
    }

    private incrementHeartbeatCount() {
        this.#heartbeatCount += 1;
    }

    private resetHeartbeatCount() {
        this.#heartbeatCount = 0;
    }

    private onOpen() {
        this.setIsOnline(true);
        this.sendEvent(SOCKET_EVENTS.ONLINE);
        this.setIsReconnecting(false);
        this.setIsStale(false);
        if(this.#retryConnectionID) {
            this.stopRetryConnection();
        }
        if(this.#heartbeatIntervalID) {
            this.stopHeartbeat();
        }
        this.resetHeartbeatCount();
        this.sendHeartbeat();
        this.startHeartbeat();
    }

    private onClose() {
        this.sendEvent(SOCKET_EVENTS.OFFLINE);
        this.setIsOnline(false);
        this.setIsStale(false);
        this.stopHeartbeat();
        if(this.#retryConnectionID) {
            this.stopRetryConnection();
        }
        this.startRetryConnection();
    }

    private onMessage(message: MessageEvent) {
        this.resetHeartbeatCount();
        if(this.isStale || this.isReconnecting) {
            return;
        }
        if(this.#heartbeatIntervalID) {
            this.stopHeartbeat();
        }
        this.startHeartbeat();
        if(message.data === `${this.#heartbeatMessage}/answer`) {
            this.updateSocketStatus();
        } else {
            this.#messageRegistry.forEach(item => {
                const data = JSON.parse(message.data);
                if(item.filters) {
                    for(const filter of item.filters) {
                        if(Array.isArray(filter.key)) {
                            let value = data;
                            for (let index = 0; index <= filter.key.length - 1; index++) {
                                const key = filter.key[index];
                                if (typeof value === 'undefined' || value === null || !Object.prototype.hasOwnProperty.call(value, key)) return
                                value = value[key];
                            }
                            if(!filter.regex.test(value)) return
                        } else {
                            if (!Object.prototype.hasOwnProperty.call(data, filter.key) || !filter.regex.test(data[filter.key as string])) return;
                        }
                    }
                }
                item.callback(data);
            })
        }
    }

    private startHeartbeat() {
        this.#heartbeatIntervalID = window.setInterval(this.sendHeartbeat.bind(this), this.#heartbeatInterval);
    }

    private stopHeartbeat() {
        if(this.#heartbeatIntervalID) {
            window.clearInterval(this.#heartbeatIntervalID);
            this.#heartbeatIntervalID = null;
        }
    }

    private sendHeartbeat() {
        this.incrementHeartbeatCount();
        this.send(this.#heartbeatMessage);
        this.updateSocketStatus();
    }

    private updateSocketStatus() {
        if(this.#heartbeatCount <= 1) {
            this.setIsStale(false);
        } else if(this.#heartbeatCount >= 3 && this.#heartbeatCount <= 4) {
            if(!this.isStale) {
                this.setIsStale(true);
                this.sendEvent(SOCKET_EVENTS.STALE);
            }
        } else if (this.#heartbeatCount >= 5) {
            this.disconnect();
            this.stopHeartbeat();
            this.resetHeartbeatCount();
            if(this.#retryConnectionID) {
                this.stopRetryConnection();
            }
            this.startRetryConnection();
        }
    }

    private startRetryConnection() {
        this.#retryConnectionID = window.setInterval(this.retryConnection.bind(this), this.#retryConnectionInterval);
    }

    private stopRetryConnection() {
        if(this.#retryConnectionID) {
            window.clearInterval(this.#retryConnectionID);
            this.#retryConnectionID = null;
        }
    }

    private retryConnection() {
        if(this.socket?.readyState === this.socket?.CLOSED && navigator.onLine) {
            this.setIsReconnecting(true);
            this.setIsStale(false);
            this.connect();
            this.sendEvent(SOCKET_EVENTS.RECONNECT);
        }
    }

}
