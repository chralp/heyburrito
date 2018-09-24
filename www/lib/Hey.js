class Hey {
    constructor() {
        this.socket = new WebSocket('ws://localhost:8080');
        this.events = {};

        this.socket.addEventListener('open', () => {
            this.emit('open');
        });

        this.socket.onmessage = (e) => this.onMessage(e);
    }

    onMessage(e) {
        if (!e.data) {
            return;
        }

        const obj = JSON.parse(e.data);

        switch(obj.event) {
            case 'receivedList':
                this.emit('receivedList', obj.data);
                break;
            case 'givenList':
                this.emit('givenList', obj.data);
                break;
            case 'userStats':
                this.emit('userStats', obj.data);
                break;
        }
    }

    send(event, data) {
        this.socket.send(JSON.stringify({ event, data }));
    }

    on(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }

        this.events[event].push(listener);
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
