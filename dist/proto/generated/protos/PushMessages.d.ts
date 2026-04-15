import { Writer, Reader } from 'protobufjs/minimal';
export declare const protobufPackage = "textsecure";
export interface IncomingPushMessageSignal {
    type: IncomingPushMessageSignal_Type;
    source: string;
    sourceDevice: number;
    relay: string;
    timestamp: number;
    /** Contains an encrypted PushMessageContent */
    message: Uint8Array;
}
export declare enum IncomingPushMessageSignal_Type {
    UNKNOWN = 0,
    CIPHERTEXT = 1,
    KEY_EXCHANGE = 2,
    PREKEY_BUNDLE = 3,
    PLAINTEXT = 4,
    RECEIPT = 5,
    PREKEY_BUNDLE_DEVICE_CONTROL = 6,
    DEVICE_CONTROL = 7,
    UNRECOGNIZED = -1
}
export declare function incomingPushMessageSignal_TypeFromJSON(object: any): IncomingPushMessageSignal_Type;
export declare function incomingPushMessageSignal_TypeToJSON(object: IncomingPushMessageSignal_Type): string;
export interface PushMessageContent {
    body: string;
    attachments: PushMessageContent_AttachmentPointer[];
    group: PushMessageContent_GroupContext | undefined;
    flags: number;
}
export declare enum PushMessageContent_Flags {
    END_SESSION = 1,
    UNRECOGNIZED = -1
}
export declare function pushMessageContent_FlagsFromJSON(object: any): PushMessageContent_Flags;
export declare function pushMessageContent_FlagsToJSON(object: PushMessageContent_Flags): string;
export interface PushMessageContent_AttachmentPointer {
    id: number;
    contentType: string;
    key: Uint8Array;
}
export interface PushMessageContent_GroupContext {
    id: Uint8Array;
    type: PushMessageContent_GroupContext_Type;
    name: string;
    members: string[];
    avatar: PushMessageContent_AttachmentPointer | undefined;
}
export declare enum PushMessageContent_GroupContext_Type {
    UNKNOWN = 0,
    UPDATE = 1,
    DELIVER = 2,
    QUIT = 3,
    UNRECOGNIZED = -1
}
export declare function pushMessageContent_GroupContext_TypeFromJSON(object: any): PushMessageContent_GroupContext_Type;
export declare function pushMessageContent_GroupContext_TypeToJSON(object: PushMessageContent_GroupContext_Type): string;
export declare const IncomingPushMessageSignal: {
    encode(message: IncomingPushMessageSignal, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): IncomingPushMessageSignal;
    fromJSON(object: any): IncomingPushMessageSignal;
    toJSON(message: IncomingPushMessageSignal): unknown;
    fromPartial(object: DeepPartial<IncomingPushMessageSignal>): IncomingPushMessageSignal;
};
export declare const PushMessageContent: {
    encode(message: PushMessageContent, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): PushMessageContent;
    fromJSON(object: any): PushMessageContent;
    toJSON(message: PushMessageContent): unknown;
    fromPartial(object: DeepPartial<PushMessageContent>): PushMessageContent;
};
export declare const PushMessageContent_AttachmentPointer: {
    encode(message: PushMessageContent_AttachmentPointer, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): PushMessageContent_AttachmentPointer;
    fromJSON(object: any): PushMessageContent_AttachmentPointer;
    toJSON(message: PushMessageContent_AttachmentPointer): unknown;
    fromPartial(object: DeepPartial<PushMessageContent_AttachmentPointer>): PushMessageContent_AttachmentPointer;
};
export declare const PushMessageContent_GroupContext: {
    encode(message: PushMessageContent_GroupContext, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): PushMessageContent_GroupContext;
    fromJSON(object: any): PushMessageContent_GroupContext;
    toJSON(message: PushMessageContent_GroupContext): unknown;
    fromPartial(object: DeepPartial<PushMessageContent_GroupContext>): PushMessageContent_GroupContext;
};
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
