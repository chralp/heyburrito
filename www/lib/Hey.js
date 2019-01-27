class Hey {
    constructor() {
        this.socket = new WebSocket(`ws://${window.location.hostname}:8080`);
        this.events = {};
        this.open = false;

        this.socket.addEventListener('open', () => {
            this.open = true;
            this.emit('open');
        });

        this.socket.onmessage = (e) => this.onMessage(e);
    }

    onMessage(e) {
        if (!e.data) {
            return;
        }

        const obj = JSON.parse(e.data);
        this.emit(obj.event, obj.data);
    }

    get(event, data) {
        this.socket.send(JSON.stringify({ event, data }));
    }

    on(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }

        this.events[event].push(listener);

        if (event === 'open' && this.open) {
            this.emit('open');
        }
    }

    off(event, listener) {
        let idx;

        if (typeof this.events[event] === 'object') {
            idx = indexOf(this.events[event], listener);

            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }

    emit(event, ...args) {
        if (typeof this.events[event] === 'object') {
            const listeners = this.events[event].slice();

            listeners.forEach((listener) => {
                listener.apply(this, args);
            });
        }
    }
}

window.hey = new Hey();
