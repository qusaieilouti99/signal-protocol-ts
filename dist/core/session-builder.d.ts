import { PreKeyWhisperMessage } from '../proto';
import { SessionRecord } from './session-record';
import { DeviceType, SessionType } from './session-types';
import { KeyPairType, LoggerType, SignalProtocolAddressType, StorageType } from './types';
export declare class SessionBuilder {
    remoteAddress: SignalProtocolAddressType;
    storage: StorageType;
    logger: LoggerType;
    constructor(storage: StorageType, remoteAddress: SignalProtocolAddressType, logger: LoggerType);
    private getRemoteIdentityIdentifier;
    processPreKeyJob: (device: DeviceType) => Promise<SessionType>;
    startSessionAsInitiator: (EKa: KeyPairType<ArrayBuffer>, IKb: ArrayBuffer, SPKb: ArrayBuffer, OPKb: ArrayBuffer | undefined, registrationId?: number) => Promise<SessionType>;
    startSessionWthPreKeyMessage: (OPKb: KeyPairType<ArrayBuffer> | undefined, SPKb: KeyPairType<ArrayBuffer>, message: PreKeyWhisperMessage) => Promise<SessionType>;
    calculateSendingRatchet(session: SessionType, remoteKey: ArrayBuffer): Promise<void>;
    processPreKey(device: DeviceType): Promise<SessionType>;
    processV3(record: SessionRecord, message: PreKeyWhisperMessage): Promise<number | void>;
}
