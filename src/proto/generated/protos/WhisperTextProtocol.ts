/* eslint-disable */
import { util, configure, Writer, Reader } from 'protobufjs/minimal'
import Long from 'long';
import { fromByteArray, toByteArray } from 'base64-js'
import {DeepPartial} from "./PushMessages";

//export const protobufPackage = 'textsecure'

export interface WhisperMessage {
    ephemeralKey: Uint8Array
    counter: number
    previousCounter: number
    /** PushMessageContent */
    ciphertext: Uint8Array
}

export interface GroupWhisperMessage {
    signaturePublicKey: Uint8Array
    counter: number
    previousCounter: number
    /** PushMessageContent */
    ciphertext: Uint8Array
    /** signature */
    signature: Uint8Array
}

export interface PreKeyWhisperMessage {
    registrationId: number
    preKeyId: number
    signedPreKeyId: number
    baseKey: Uint8Array
    identityKey: Uint8Array
    /** WhisperMessage */
    message: Uint8Array
}

export interface KeyExchangeMessage {
    id: number
    baseKey: Uint8Array
    ephemeralKey: Uint8Array
    identityKey: Uint8Array
    baseKeySignature: Uint8Array
}

const baseWhisperMessage: object = { counter: 0, previousCounter: 0 }

export const WhisperMessage = {
    encode(message: WhisperMessage, writer: Writer = Writer.create()): Writer {
        if (message.ephemeralKey.length !== 0) {
            writer.uint32(10).bytes(message.ephemeralKey)
        }
        if (message.counter !== 0) {
            writer.uint32(16).uint32(message.counter)
        }
        if (message.previousCounter !== 0) {
            writer.uint32(24).uint32(message.previousCounter)
        }
        if (message.ciphertext.length !== 0) {
            writer.uint32(34).bytes(message.ciphertext)
        }
        return writer
    },

    decode(input: Reader | Uint8Array, length?: number): WhisperMessage {
        const reader = input instanceof Reader ? input : new Reader(input)
        let end = length === undefined ? reader.len : reader.pos + length
        const message = { ...baseWhisperMessage } as WhisperMessage
        message.ephemeralKey = new Uint8Array()
        message.ciphertext = new Uint8Array()
        while (reader.pos < end) {
            const tag = reader.uint32()
            switch (tag >>> 3) {
                case 1:
                    message.ephemeralKey = reader.bytes()
                    break
                case 2:
                    message.counter = reader.uint32()
                    break
                case 3:
                    message.previousCounter = reader.uint32()
                    break
                case 4:
                    message.ciphertext = reader.bytes()
                    break
                default:
                    reader.skipType(tag & 7)
                    break
            }
        }
        return message
    },

    fromJSON(object: any): WhisperMessage {
        const message = { ...baseWhisperMessage } as WhisperMessage
        message.ephemeralKey = new Uint8Array()
        message.ciphertext = new Uint8Array()
        if (object.ephemeralKey !== undefined && object.ephemeralKey !== null) {
            message.ephemeralKey = bytesFromBase64(object.ephemeralKey)
        }
        if (object.counter !== undefined && object.counter !== null) {
            message.counter = Number(object.counter)
        } else {
            message.counter = 0
        }
        if (object.previousCounter !== undefined && object.previousCounter !== null) {
            message.previousCounter = Number(object.previousCounter)
        } else {
            message.previousCounter = 0
        }
        if (object.ciphertext !== undefined && object.ciphertext !== null) {
            message.ciphertext = bytesFromBase64(object.ciphertext)
        }
        return message
    },

    toJSON(message: WhisperMessage): unknown {
        const obj: any = {}
        message.ephemeralKey !== undefined &&
            (obj.ephemeralKey = base64FromBytes(
                message.ephemeralKey !== undefined ? message.ephemeralKey : new Uint8Array()
            ))
        message.counter !== undefined && (obj.counter = message.counter)
        message.previousCounter !== undefined && (obj.previousCounter = message.previousCounter)
        message.ciphertext !== undefined &&
            (obj.ciphertext = base64FromBytes(message.ciphertext !== undefined ? message.ciphertext : new Uint8Array()))
        return obj
    },

    fromPartial(object: DeepPartial<WhisperMessage>): WhisperMessage {
        const message = { ...baseWhisperMessage } as WhisperMessage
        if (object.ephemeralKey !== undefined && object.ephemeralKey !== null) {
            message.ephemeralKey = object.ephemeralKey
        } else {
            message.ephemeralKey = new Uint8Array()
        }
        if (object.counter !== undefined && object.counter !== null) {
            message.counter = object.counter
        } else {
            message.counter = 0
        }
        if (object.previousCounter !== undefined && object.previousCounter !== null) {
            message.previousCounter = object.previousCounter
        } else {
            message.previousCounter = 0
        }
        if (object.ciphertext !== undefined && object.ciphertext !== null) {
            message.ciphertext = object.ciphertext
        } else {
            message.ciphertext = new Uint8Array()
        }
        return message
    },
}

const baseGroupWhisperMessage: object = { counter: 0, previousCounter: 0 }

export const GroupWhisperMessage = {
    encode(message: GroupWhisperMessage, writer: Writer = Writer.create()): Writer {
        if (message.signaturePublicKey.length !== 0) {
            writer.uint32(10).bytes(message.signaturePublicKey)
        }
        if (message.counter !== 0) {
            writer.uint32(16).uint32(message.counter)
        }
        if (message.previousCounter !== 0) {
            writer.uint32(24).uint32(message.previousCounter)
        }
        if (message.ciphertext.length !== 0) {
            writer.uint32(34).bytes(message.ciphertext)
        }
        if (message.signature.length !== 0) {
            writer.uint32(42).bytes(message.signature)
        }
        return writer
    },

    decode(input: Reader | Uint8Array, length?: number): GroupWhisperMessage {
        const reader = input instanceof Reader ? input : new Reader(input)
        let end = length === undefined ? reader.len : reader.pos + length
        const message = { ...baseGroupWhisperMessage } as GroupWhisperMessage
        message.signaturePublicKey = new Uint8Array()
        message.ciphertext = new Uint8Array()
        message.signature = new Uint8Array()
        while (reader.pos < end) {
            const tag = reader.uint32()
            switch (tag >>> 3) {
                case 1:
                    message.signaturePublicKey = reader.bytes()
                    break
                case 2:
                    message.counter = reader.uint32()
                    break
                case 3:
                    message.previousCounter = reader.uint32()
                    break
                case 4:
                    message.ciphertext = reader.bytes()
                    break
                case 5:
                    message.signature = reader.bytes()
                    break
                default:
                    reader.skipType(tag & 7)
                    break
            }
        }
        return message
    },

    fromJSON(object: any): GroupWhisperMessage {
        const message = { ...baseGroupWhisperMessage } as GroupWhisperMessage
        message.signaturePublicKey = new Uint8Array()
        message.ciphertext = new Uint8Array()
        message.signature = new Uint8Array()
        if (object.signaturePublicKey !== undefined && object.signaturePublicKey !== null) {
            message.signaturePublicKey = bytesFromBase64(object.signaturePublicKey)
        }
        if (object.counter !== undefined && object.counter !== null) {
            message.counter = Number(object.counter)
        } else {
            message.counter = 0
        }
        if (object.previousCounter !== undefined && object.previousCounter !== null) {
            message.previousCounter = Number(object.previousCounter)
        } else {
            message.previousCounter = 0
        }
        if (object.ciphertext !== undefined && object.ciphertext !== null) {
            message.ciphertext = bytesFromBase64(object.ciphertext)
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = bytesFromBase64(object.signature)
        }
        return message
    },

    toJSON(message: GroupWhisperMessage): unknown {
        const obj: any = {}
        message.signaturePublicKey !== undefined &&
            (obj.signaturePublicKey = base64FromBytes(
                message.signaturePublicKey !== undefined ? message.signaturePublicKey : new Uint8Array()
            ))
        message.counter !== undefined && (obj.counter = message.counter)
        message.previousCounter !== undefined && (obj.previousCounter = message.previousCounter)
        message.ciphertext !== undefined &&
            (obj.ciphertext = base64FromBytes(message.ciphertext !== undefined ? message.ciphertext : new Uint8Array()))
        message.signature !== undefined &&
            (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()))
        return obj
    },

    fromPartial(object: DeepPartial<GroupWhisperMessage>): GroupWhisperMessage {
        const message = { ...baseGroupWhisperMessage } as GroupWhisperMessage
        if (object.signaturePublicKey !== undefined && object.signaturePublicKey !== null) {
            message.signaturePublicKey = object.signaturePublicKey
        } else {
            message.signaturePublicKey = new Uint8Array()
        }
        if (object.counter !== undefined && object.counter !== null) {
            message.counter = object.counter
        } else {
            message.counter = 0
        }
        if (object.previousCounter !== undefined && object.previousCounter !== null) {
            message.previousCounter = object.previousCounter
        } else {
            message.previousCounter = 0
        }
        if (object.ciphertext !== undefined && object.ciphertext !== null) {
            message.ciphertext = object.ciphertext
        } else {
            message.ciphertext = new Uint8Array()
        }
        if (object.signature !== undefined && object.signature !== null) {
            message.signature = object.signature
        } else {
            message.signature = new Uint8Array()
        }
        return message
    },
}

const basePreKeyWhisperMessage: object = { registrationId: 0, preKeyId: 0, signedPreKeyId: 0 }

export const PreKeyWhisperMessage = {
    encode(message: PreKeyWhisperMessage, writer: Writer = Writer.create()): Writer {
        if (message.registrationId !== 0) {
            writer.uint32(40).uint32(message.registrationId)
        }
        if (message.preKeyId !== 0) {
            writer.uint32(8).uint32(message.preKeyId)
        }
        if (message.signedPreKeyId !== 0) {
            writer.uint32(48).uint32(message.signedPreKeyId)
        }
        if (message.baseKey.length !== 0) {
            writer.uint32(18).bytes(message.baseKey)
        }
        if (message.identityKey.length !== 0) {
            writer.uint32(26).bytes(message.identityKey)
        }
        if (message.message.length !== 0) {
            writer.uint32(34).bytes(message.message)
        }
        return writer
    },

    decode(input: Reader | Uint8Array, length?: number): PreKeyWhisperMessage {
        const reader = input instanceof Reader ? input : new Reader(input)
        let end = length === undefined ? reader.len : reader.pos + length
        const message = { ...basePreKeyWhisperMessage } as PreKeyWhisperMessage
        message.baseKey = new Uint8Array()
        message.identityKey = new Uint8Array()
        message.message = new Uint8Array()
        while (reader.pos < end) {
            const tag = reader.uint32()
            switch (tag >>> 3) {
                case 5:
                    message.registrationId = reader.uint32()
                    break
                case 1:
                    message.preKeyId = reader.uint32()
                    break
                case 6:
                    message.signedPreKeyId = reader.uint32()
                    break
                case 2:
                    message.baseKey = reader.bytes()
                    break
                case 3:
                    message.identityKey = reader.bytes()
                    break
                case 4:
                    message.message = reader.bytes()
                    break
                default:
                    reader.skipType(tag & 7)
                    break
            }
        }
        return message
    },

    fromJSON(object: any): PreKeyWhisperMessage {
        const message = { ...basePreKeyWhisperMessage } as PreKeyWhisperMessage
        message.baseKey = new Uint8Array()
        message.identityKey = new Uint8Array()
        message.message = new Uint8Array()
        if (object.registrationId !== undefined && object.registrationId !== null) {
            message.registrationId = Number(object.registrationId)
        } else {
            message.registrationId = 0
        }
        if (object.preKeyId !== undefined && object.preKeyId !== null) {
            message.preKeyId = Number(object.preKeyId)
        } else {
            message.preKeyId = 0
        }
        if (object.signedPreKeyId !== undefined && object.signedPreKeyId !== null) {
            message.signedPreKeyId = Number(object.signedPreKeyId)
        } else {
            message.signedPreKeyId = 0
        }
        if (object.baseKey !== undefined && object.baseKey !== null) {
            message.baseKey = bytesFromBase64(object.baseKey)
        }
        if (object.identityKey !== undefined && object.identityKey !== null) {
            message.identityKey = bytesFromBase64(object.identityKey)
        }
        if (object.message !== undefined && object.message !== null) {
            message.message = bytesFromBase64(object.message)
        }
        return message
    },

    toJSON(message: PreKeyWhisperMessage): unknown {
        const obj: any = {}
        message.registrationId !== undefined && (obj.registrationId = message.registrationId)
        message.preKeyId !== undefined && (obj.preKeyId = message.preKeyId)
        message.signedPreKeyId !== undefined && (obj.signedPreKeyId = message.signedPreKeyId)
        message.baseKey !== undefined &&
            (obj.baseKey = base64FromBytes(message.baseKey !== undefined ? message.baseKey : new Uint8Array()))
        message.identityKey !== undefined &&
            (obj.identityKey = base64FromBytes(
                message.identityKey !== undefined ? message.identityKey : new Uint8Array()
            ))
        message.message !== undefined &&
            (obj.message = base64FromBytes(message.message !== undefined ? message.message : new Uint8Array()))
        return obj
    },

    fromPartial(object: DeepPartial<PreKeyWhisperMessage>): PreKeyWhisperMessage {
        const message = { ...basePreKeyWhisperMessage } as PreKeyWhisperMessage
        if (object.registrationId !== undefined && object.registrationId !== null) {
            message.registrationId = object.registrationId
        } else {
            message.registrationId = 0
        }
        if (object.preKeyId !== undefined && object.preKeyId !== null) {
            message.preKeyId = object.preKeyId
        } else {
            message.preKeyId = 0
        }
        if (object.signedPreKeyId !== undefined && object.signedPreKeyId !== null) {
            message.signedPreKeyId = object.signedPreKeyId
        } else {
            message.signedPreKeyId = 0
        }
        if (object.baseKey !== undefined && object.baseKey !== null) {
            message.baseKey = object.baseKey
        } else {
            message.baseKey = new Uint8Array()
        }
        if (object.identityKey !== undefined && object.identityKey !== null) {
            message.identityKey = object.identityKey
        } else {
            message.identityKey = new Uint8Array()
        }
        if (object.message !== undefined && object.message !== null) {
            message.message = object.message
        } else {
            message.message = new Uint8Array()
        }
        return message
    },
}

const baseKeyExchangeMessage: object = { id: 0 }

export const KeyExchangeMessage = {
    encode(message: KeyExchangeMessage, writer: Writer = Writer.create()): Writer {
        if (message.id !== 0) {
            writer.uint32(8).uint32(message.id)
        }
        if (message.baseKey.length !== 0) {
            writer.uint32(18).bytes(message.baseKey)
        }
        if (message.ephemeralKey.length !== 0) {
            writer.uint32(26).bytes(message.ephemeralKey)
        }
        if (message.identityKey.length !== 0) {
            writer.uint32(34).bytes(message.identityKey)
        }
        if (message.baseKeySignature.length !== 0) {
            writer.uint32(42).bytes(message.baseKeySignature)
        }
        return writer
    },

    decode(input: Reader | Uint8Array, length?: number): KeyExchangeMessage {
        const reader = input instanceof Reader ? input : new Reader(input)
        let end = length === undefined ? reader.len : reader.pos + length
        const message = { ...baseKeyExchangeMessage } as KeyExchangeMessage
        message.baseKey = new Uint8Array()
        message.ephemeralKey = new Uint8Array()
        message.identityKey = new Uint8Array()
        message.baseKeySignature = new Uint8Array()
        while (reader.pos < end) {
            const tag = reader.uint32()
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.uint32()
                    break
                case 2:
                    message.baseKey = reader.bytes()
                    break
                case 3:
                    message.ephemeralKey = reader.bytes()
                    break
                case 4:
                    message.identityKey = reader.bytes()
                    break
                case 5:
                    message.baseKeySignature = reader.bytes()
                    break
                default:
                    reader.skipType(tag & 7)
                    break
            }
        }
        return message
    },

    fromJSON(object: any): KeyExchangeMessage {
        const message = { ...baseKeyExchangeMessage } as KeyExchangeMessage
        message.baseKey = new Uint8Array()
        message.ephemeralKey = new Uint8Array()
        message.identityKey = new Uint8Array()
        message.baseKeySignature = new Uint8Array()
        if (object.id !== undefined && object.id !== null) {
            message.id = Number(object.id)
        } else {
            message.id = 0
        }
        if (object.baseKey !== undefined && object.baseKey !== null) {
            message.baseKey = bytesFromBase64(object.baseKey)
        }
        if (object.ephemeralKey !== undefined && object.ephemeralKey !== null) {
            message.ephemeralKey = bytesFromBase64(object.ephemeralKey)
        }
        if (object.identityKey !== undefined && object.identityKey !== null) {
            message.identityKey = bytesFromBase64(object.identityKey)
        }
        if (object.baseKeySignature !== undefined && object.baseKeySignature !== null) {
            message.baseKeySignature = bytesFromBase64(object.baseKeySignature)
        }
        return message
    },

    toJSON(message: KeyExchangeMessage): unknown {
        const obj: any = {}
        message.id !== undefined && (obj.id = message.id)
        message.baseKey !== undefined &&
            (obj.baseKey = base64FromBytes(message.baseKey !== undefined ? message.baseKey : new Uint8Array()))
        message.ephemeralKey !== undefined &&
            (obj.ephemeralKey = base64FromBytes(
                message.ephemeralKey !== undefined ? message.ephemeralKey : new Uint8Array()
            ))
        message.identityKey !== undefined &&
            (obj.identityKey = base64FromBytes(
                message.identityKey !== undefined ? message.identityKey : new Uint8Array()
            ))
        message.baseKeySignature !== undefined &&
            (obj.baseKeySignature = base64FromBytes(
                message.baseKeySignature !== undefined ? message.baseKeySignature : new Uint8Array()
            ))
        return obj
    },

    fromPartial(object: DeepPartial<KeyExchangeMessage>): KeyExchangeMessage {
        const message = { ...baseKeyExchangeMessage } as KeyExchangeMessage
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id
        } else {
            message.id = 0
        }
        if (object.baseKey !== undefined && object.baseKey !== null) {
            message.baseKey = object.baseKey
        } else {
            message.baseKey = new Uint8Array()
        }
        if (object.ephemeralKey !== undefined && object.ephemeralKey !== null) {
            message.ephemeralKey = object.ephemeralKey
        } else {
            message.ephemeralKey = new Uint8Array()
        }
        if (object.identityKey !== undefined && object.identityKey !== null) {
            message.identityKey = object.identityKey
        } else {
            message.identityKey = new Uint8Array()
        }
        if (object.baseKeySignature !== undefined && object.baseKeySignature !== null) {
            message.baseKeySignature = object.baseKeySignature
        } else {
            message.baseKeySignature = new Uint8Array()
        }
        return message
    },
}

function bytesFromBase64(b64: any): Uint8Array {
    if (b64 instanceof Uint8Array) {
        return b64
    }
    return toByteArray(b64)
}

function base64FromBytes(arr: Uint8Array): string {
    return fromByteArray(arr)
}

/*type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined
export type DeepPartial<T> = T extends Builtin
    ? T
    : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : T extends {}
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Partial<T>*/

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
// @ts-ignore
if (util.Long !== Long) {
    util.Long = Long as any
    configure()
}
