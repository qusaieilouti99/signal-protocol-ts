import { Writer, Reader } from 'protobufjs/minimal';
import { DeepPartial } from "./PushMessages";
export interface WhisperMessage {
    ephemeralKey: Uint8Array;
    counter: number;
    previousCounter: number;
    /** PushMessageContent */
    ciphertext: Uint8Array;
}
export interface GroupWhisperMessage {
    signaturePublicKey: Uint8Array;
    counter: number;
    previousCounter: number;
    /** PushMessageContent */
    ciphertext: Uint8Array;
    /** signature */
    signature: Uint8Array;
}
export interface PreKeyWhisperMessage {
    registrationId: number;
    preKeyId: number;
    signedPreKeyId: number;
    baseKey: Uint8Array;
    identityKey: Uint8Array;
    /** WhisperMessage */
    message: Uint8Array;
}
export interface KeyExchangeMessage {
    id: number;
    baseKey: Uint8Array;
    ephemeralKey: Uint8Array;
    identityKey: Uint8Array;
    baseKeySignature: Uint8Array;
}
export declare const WhisperMessage: {
    encode(message: WhisperMessage, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): WhisperMessage;
    fromJSON(object: any): WhisperMessage;
    toJSON(message: WhisperMessage): unknown;
    fromPartial(object: DeepPartial<WhisperMessage>): WhisperMessage;
};
export declare const GroupWhisperMessage: {
    encode(message: GroupWhisperMessage, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): GroupWhisperMessage;
    fromJSON(object: any): GroupWhisperMessage;
    toJSON(message: GroupWhisperMessage): unknown;
    fromPartial(object: DeepPartial<GroupWhisperMessage>): GroupWhisperMessage;
};
export declare const PreKeyWhisperMessage: {
    encode(message: PreKeyWhisperMessage, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): PreKeyWhisperMessage;
    fromJSON(object: any): PreKeyWhisperMessage;
    toJSON(message: PreKeyWhisperMessage): unknown;
    fromPartial(object: DeepPartial<PreKeyWhisperMessage>): PreKeyWhisperMessage;
};
export declare const KeyExchangeMessage: {
    encode(message: KeyExchangeMessage, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): KeyExchangeMessage;
    fromJSON(object: any): KeyExchangeMessage;
    toJSON(message: KeyExchangeMessage): unknown;
    fromPartial(object: DeepPartial<KeyExchangeMessage>): KeyExchangeMessage;
};
