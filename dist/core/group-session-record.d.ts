import { GroupOldRatchetInfo, GroupRatchet, GroupSessionType, SenderKey } from './session-types';
export declare class GroupSessionRecord {
    static deserializeGroupSession(serialized: string): GroupSessionType;
    static serializeGroupSession(session: GroupSessionType): string;
    static groupSessionTypeArrayBufferToString(session: GroupSessionType<ArrayBuffer>): GroupSessionType<string>;
    static groupRatchetArrayBufferToString(ratchet: GroupRatchet<ArrayBuffer>): GroupRatchet<string>;
    static groupOldRatchetInfoArrayBufferToString(ori: GroupOldRatchetInfo<ArrayBuffer>): GroupOldRatchetInfo<string>;
    static groupSessionTypeStringToArrayBuffer(json: GroupSessionType<string>): GroupSessionType<ArrayBuffer>;
    static groupRatchetStringToArrayBuffer(ratchet: GroupRatchet<string>): GroupRatchet<ArrayBuffer>;
    static groupOldRatchetInfoStringToArrayBuffer(ori: GroupOldRatchetInfo<string>): GroupOldRatchetInfo<ArrayBuffer>;
    static serializeSenderKey(senderKey: SenderKey): SenderKey<string>;
    static removeOldChains(session: GroupSessionType): void;
}
