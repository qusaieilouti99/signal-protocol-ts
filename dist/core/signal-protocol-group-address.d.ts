import { SignalProtocolGroupAddressType } from './';
export declare class SignalProtocolGroupAddress implements SignalProtocolGroupAddressType {
    static fromString(s: string): SignalProtocolGroupAddress;
    private _groupId;
    private _userId;
    private _deviceId;
    constructor(_groupId: string, _userId: string, _deviceId: number);
    get groupId(): string;
    get userId(): string;
    get deviceId(): number;
    getGroupId(): string;
    getUserId(): string;
    getDeviceId(): number;
    toString(): string;
    equals(other: SignalProtocolGroupAddressType): boolean;
}
