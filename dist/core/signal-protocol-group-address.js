"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalProtocolGroupAddress = void 0;
class SignalProtocolGroupAddress {
    static fromString(s) {
        if (!s.match(/.*\.\d+/)) {
            throw new Error(`Invalid SignalProtocolGroupAddress string: ${s}`);
        }
        const parts = s.split('.');
        return new SignalProtocolGroupAddress(parts[0], parts[1], parseInt(parts[2]));
    }
    constructor(_groupId, _userId, _deviceId) {
        this._groupId = _groupId;
        this._userId = _userId;
        this._deviceId = _deviceId;
    }
    // Readonly properties
    get groupId() {
        return this._groupId;
    }
    get userId() {
        return this._userId;
    }
    get deviceId() {
        return this._deviceId;
    }
    // Expose properties as fuynctions for compatibility
    getGroupId() {
        return this._groupId;
    }
    getUserId() {
        return this._userId;
    }
    getDeviceId() {
        return this._deviceId;
    }
    toString() {
        return `${this._groupId}.${this._userId}.${this._deviceId}`;
    }
    equals(other) {
        return other.groupId === this._groupId && other.userId == this._userId && other.deviceId == this._deviceId;
    }
}
exports.SignalProtocolGroupAddress = SignalProtocolGroupAddress;
