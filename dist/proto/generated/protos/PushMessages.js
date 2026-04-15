"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushMessageContent_GroupContext = exports.PushMessageContent_AttachmentPointer = exports.PushMessageContent = exports.IncomingPushMessageSignal = exports.PushMessageContent_GroupContext_Type = exports.PushMessageContent_Flags = exports.IncomingPushMessageSignal_Type = exports.protobufPackage = void 0;
exports.incomingPushMessageSignal_TypeFromJSON = incomingPushMessageSignal_TypeFromJSON;
exports.incomingPushMessageSignal_TypeToJSON = incomingPushMessageSignal_TypeToJSON;
exports.pushMessageContent_FlagsFromJSON = pushMessageContent_FlagsFromJSON;
exports.pushMessageContent_FlagsToJSON = pushMessageContent_FlagsToJSON;
exports.pushMessageContent_GroupContext_TypeFromJSON = pushMessageContent_GroupContext_TypeFromJSON;
exports.pushMessageContent_GroupContext_TypeToJSON = pushMessageContent_GroupContext_TypeToJSON;
/* eslint-disable */
const minimal_1 = require("protobufjs/minimal");
const long_1 = __importDefault(require("long"));
const base64_js_1 = require("base64-js");
exports.protobufPackage = 'textsecure';
var IncomingPushMessageSignal_Type;
(function (IncomingPushMessageSignal_Type) {
    IncomingPushMessageSignal_Type[IncomingPushMessageSignal_Type["UNKNOWN"] = 0] = "UNKNOWN";
    IncomingPushMessageSignal_Type[IncomingPushMessageSignal_Type["CIPHERTEXT"] = 1] = "CIPHERTEXT";
    IncomingPushMessageSignal_Type[IncomingPushMessageSignal_Type["KEY_EXCHANGE"] = 2] = "KEY_EXCHANGE";
    IncomingPushMessageSignal_Type[IncomingPushMessageSignal_Type["PREKEY_BUNDLE"] = 3] = "PREKEY_BUNDLE";
    IncomingPushMessageSignal_Type[IncomingPushMessageSignal_Type["PLAINTEXT"] = 4] = "PLAINTEXT";
    IncomingPushMessageSignal_Type[IncomingPushMessageSignal_Type["RECEIPT"] = 5] = "RECEIPT";
    IncomingPushMessageSignal_Type[IncomingPushMessageSignal_Type["PREKEY_BUNDLE_DEVICE_CONTROL"] = 6] = "PREKEY_BUNDLE_DEVICE_CONTROL";
    IncomingPushMessageSignal_Type[IncomingPushMessageSignal_Type["DEVICE_CONTROL"] = 7] = "DEVICE_CONTROL";
    IncomingPushMessageSignal_Type[IncomingPushMessageSignal_Type["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(IncomingPushMessageSignal_Type || (exports.IncomingPushMessageSignal_Type = IncomingPushMessageSignal_Type = {}));
function incomingPushMessageSignal_TypeFromJSON(object) {
    switch (object) {
        case 0:
        case 'UNKNOWN':
            return IncomingPushMessageSignal_Type.UNKNOWN;
        case 1:
        case 'CIPHERTEXT':
            return IncomingPushMessageSignal_Type.CIPHERTEXT;
        case 2:
        case 'KEY_EXCHANGE':
            return IncomingPushMessageSignal_Type.KEY_EXCHANGE;
        case 3:
        case 'PREKEY_BUNDLE':
            return IncomingPushMessageSignal_Type.PREKEY_BUNDLE;
        case 4:
        case 'PLAINTEXT':
            return IncomingPushMessageSignal_Type.PLAINTEXT;
        case 5:
        case 'RECEIPT':
            return IncomingPushMessageSignal_Type.RECEIPT;
        case 6:
        case 'PREKEY_BUNDLE_DEVICE_CONTROL':
            return IncomingPushMessageSignal_Type.PREKEY_BUNDLE_DEVICE_CONTROL;
        case 7:
        case 'DEVICE_CONTROL':
            return IncomingPushMessageSignal_Type.DEVICE_CONTROL;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return IncomingPushMessageSignal_Type.UNRECOGNIZED;
    }
}
function incomingPushMessageSignal_TypeToJSON(object) {
    switch (object) {
        case IncomingPushMessageSignal_Type.UNKNOWN:
            return 'UNKNOWN';
        case IncomingPushMessageSignal_Type.CIPHERTEXT:
            return 'CIPHERTEXT';
        case IncomingPushMessageSignal_Type.KEY_EXCHANGE:
            return 'KEY_EXCHANGE';
        case IncomingPushMessageSignal_Type.PREKEY_BUNDLE:
            return 'PREKEY_BUNDLE';
        case IncomingPushMessageSignal_Type.PLAINTEXT:
            return 'PLAINTEXT';
        case IncomingPushMessageSignal_Type.RECEIPT:
            return 'RECEIPT';
        case IncomingPushMessageSignal_Type.PREKEY_BUNDLE_DEVICE_CONTROL:
            return 'PREKEY_BUNDLE_DEVICE_CONTROL';
        case IncomingPushMessageSignal_Type.DEVICE_CONTROL:
            return 'DEVICE_CONTROL';
        default:
            return 'UNKNOWN';
    }
}
var PushMessageContent_Flags;
(function (PushMessageContent_Flags) {
    PushMessageContent_Flags[PushMessageContent_Flags["END_SESSION"] = 1] = "END_SESSION";
    PushMessageContent_Flags[PushMessageContent_Flags["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(PushMessageContent_Flags || (exports.PushMessageContent_Flags = PushMessageContent_Flags = {}));
function pushMessageContent_FlagsFromJSON(object) {
    switch (object) {
        case 1:
        case 'END_SESSION':
            return PushMessageContent_Flags.END_SESSION;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return PushMessageContent_Flags.UNRECOGNIZED;
    }
}
function pushMessageContent_FlagsToJSON(object) {
    switch (object) {
        case PushMessageContent_Flags.END_SESSION:
            return 'END_SESSION';
        default:
            return 'UNKNOWN';
    }
}
var PushMessageContent_GroupContext_Type;
(function (PushMessageContent_GroupContext_Type) {
    PushMessageContent_GroupContext_Type[PushMessageContent_GroupContext_Type["UNKNOWN"] = 0] = "UNKNOWN";
    PushMessageContent_GroupContext_Type[PushMessageContent_GroupContext_Type["UPDATE"] = 1] = "UPDATE";
    PushMessageContent_GroupContext_Type[PushMessageContent_GroupContext_Type["DELIVER"] = 2] = "DELIVER";
    PushMessageContent_GroupContext_Type[PushMessageContent_GroupContext_Type["QUIT"] = 3] = "QUIT";
    PushMessageContent_GroupContext_Type[PushMessageContent_GroupContext_Type["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(PushMessageContent_GroupContext_Type || (exports.PushMessageContent_GroupContext_Type = PushMessageContent_GroupContext_Type = {}));
function pushMessageContent_GroupContext_TypeFromJSON(object) {
    switch (object) {
        case 0:
        case 'UNKNOWN':
            return PushMessageContent_GroupContext_Type.UNKNOWN;
        case 1:
        case 'UPDATE':
            return PushMessageContent_GroupContext_Type.UPDATE;
        case 2:
        case 'DELIVER':
            return PushMessageContent_GroupContext_Type.DELIVER;
        case 3:
        case 'QUIT':
            return PushMessageContent_GroupContext_Type.QUIT;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return PushMessageContent_GroupContext_Type.UNRECOGNIZED;
    }
}
function pushMessageContent_GroupContext_TypeToJSON(object) {
    switch (object) {
        case PushMessageContent_GroupContext_Type.UNKNOWN:
            return 'UNKNOWN';
        case PushMessageContent_GroupContext_Type.UPDATE:
            return 'UPDATE';
        case PushMessageContent_GroupContext_Type.DELIVER:
            return 'DELIVER';
        case PushMessageContent_GroupContext_Type.QUIT:
            return 'QUIT';
        default:
            return 'UNKNOWN';
    }
}
const baseIncomingPushMessageSignal = { type: 0, source: '', sourceDevice: 0, relay: '', timestamp: 0 };
exports.IncomingPushMessageSignal = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.type !== 0) {
            writer.uint32(8).int32(message.type);
        }
        if (message.source !== '') {
            writer.uint32(18).string(message.source);
        }
        if (message.sourceDevice !== 0) {
            writer.uint32(56).uint32(message.sourceDevice);
        }
        if (message.relay !== '') {
            writer.uint32(26).string(message.relay);
        }
        if (message.timestamp !== 0) {
            writer.uint32(40).uint64(message.timestamp);
        }
        if (message.message.length !== 0) {
            writer.uint32(50).bytes(message.message);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.Reader ? input : new minimal_1.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseIncomingPushMessageSignal };
        message.message = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.source = reader.string();
                    break;
                case 7:
                    message.sourceDevice = reader.uint32();
                    break;
                case 3:
                    message.relay = reader.string();
                    break;
                case 5:
                    message.timestamp = longToNumber(reader.uint64());
                    break;
                case 6:
                    message.message = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseIncomingPushMessageSignal };
        message.message = new Uint8Array();
        if (object.type !== undefined && object.type !== null) {
            message.type = incomingPushMessageSignal_TypeFromJSON(object.type);
        }
        else {
            message.type = 0;
        }
        if (object.source !== undefined && object.source !== null) {
            message.source = String(object.source);
        }
        else {
            message.source = '';
        }
        if (object.sourceDevice !== undefined && object.sourceDevice !== null) {
            message.sourceDevice = Number(object.sourceDevice);
        }
        else {
            message.sourceDevice = 0;
        }
        if (object.relay !== undefined && object.relay !== null) {
            message.relay = String(object.relay);
        }
        else {
            message.relay = '';
        }
        if (object.timestamp !== undefined && object.timestamp !== null) {
            message.timestamp = Number(object.timestamp);
        }
        else {
            message.timestamp = 0;
        }
        if (object.message !== undefined && object.message !== null) {
            message.message = bytesFromBase64(object.message);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.type !== undefined && (obj.type = incomingPushMessageSignal_TypeToJSON(message.type));
        message.source !== undefined && (obj.source = message.source);
        message.sourceDevice !== undefined && (obj.sourceDevice = message.sourceDevice);
        message.relay !== undefined && (obj.relay = message.relay);
        message.timestamp !== undefined && (obj.timestamp = message.timestamp);
        message.message !== undefined &&
            (obj.message = base64FromBytes(message.message !== undefined ? message.message : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseIncomingPushMessageSignal };
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = 0;
        }
        if (object.source !== undefined && object.source !== null) {
            message.source = object.source;
        }
        else {
            message.source = '';
        }
        if (object.sourceDevice !== undefined && object.sourceDevice !== null) {
            message.sourceDevice = object.sourceDevice;
        }
        else {
            message.sourceDevice = 0;
        }
        if (object.relay !== undefined && object.relay !== null) {
            message.relay = object.relay;
        }
        else {
            message.relay = '';
        }
        if (object.timestamp !== undefined && object.timestamp !== null) {
            message.timestamp = object.timestamp;
        }
        else {
            message.timestamp = 0;
        }
        if (object.message !== undefined && object.message !== null) {
            message.message = object.message;
        }
        else {
            message.message = new Uint8Array();
        }
        return message;
    },
};
const basePushMessageContent = { body: '', flags: 0 };
exports.PushMessageContent = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.body !== '') {
            writer.uint32(10).string(message.body);
        }
        for (const v of message.attachments) {
            exports.PushMessageContent_AttachmentPointer.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.group !== undefined) {
            exports.PushMessageContent_GroupContext.encode(message.group, writer.uint32(26).fork()).ldelim();
        }
        if (message.flags !== 0) {
            writer.uint32(32).uint32(message.flags);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.Reader ? input : new minimal_1.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...basePushMessageContent };
        message.attachments = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.body = reader.string();
                    break;
                case 2:
                    message.attachments.push(exports.PushMessageContent_AttachmentPointer.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.group = exports.PushMessageContent_GroupContext.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.flags = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...basePushMessageContent };
        message.attachments = [];
        if (object.body !== undefined && object.body !== null) {
            message.body = String(object.body);
        }
        else {
            message.body = '';
        }
        if (object.attachments !== undefined && object.attachments !== null) {
            for (const e of object.attachments) {
                message.attachments.push(exports.PushMessageContent_AttachmentPointer.fromJSON(e));
            }
        }
        if (object.group !== undefined && object.group !== null) {
            message.group = exports.PushMessageContent_GroupContext.fromJSON(object.group);
        }
        else {
            message.group = undefined;
        }
        if (object.flags !== undefined && object.flags !== null) {
            message.flags = Number(object.flags);
        }
        else {
            message.flags = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.body !== undefined && (obj.body = message.body);
        if (message.attachments) {
            obj.attachments = message.attachments.map((e) => e ? exports.PushMessageContent_AttachmentPointer.toJSON(e) : undefined);
        }
        else {
            obj.attachments = [];
        }
        message.group !== undefined &&
            (obj.group = message.group ? exports.PushMessageContent_GroupContext.toJSON(message.group) : undefined);
        message.flags !== undefined && (obj.flags = message.flags);
        return obj;
    },
    fromPartial(object) {
        const message = { ...basePushMessageContent };
        message.attachments = [];
        if (object.body !== undefined && object.body !== null) {
            message.body = object.body;
        }
        else {
            message.body = '';
        }
        if (object.attachments !== undefined && object.attachments !== null) {
            for (const e of object.attachments) {
                message.attachments.push(exports.PushMessageContent_AttachmentPointer.fromPartial(e));
            }
        }
        if (object.group !== undefined && object.group !== null) {
            message.group = exports.PushMessageContent_GroupContext.fromPartial(object.group);
        }
        else {
            message.group = undefined;
        }
        if (object.flags !== undefined && object.flags !== null) {
            message.flags = object.flags;
        }
        else {
            message.flags = 0;
        }
        return message;
    },
};
const basePushMessageContent_AttachmentPointer = { id: 0, contentType: '' };
exports.PushMessageContent_AttachmentPointer = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.id !== 0) {
            writer.uint32(9).fixed64(message.id);
        }
        if (message.contentType !== '') {
            writer.uint32(18).string(message.contentType);
        }
        if (message.key.length !== 0) {
            writer.uint32(26).bytes(message.key);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.Reader ? input : new minimal_1.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...basePushMessageContent_AttachmentPointer };
        message.key = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = longToNumber(reader.fixed64());
                    break;
                case 2:
                    message.contentType = reader.string();
                    break;
                case 3:
                    message.key = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...basePushMessageContent_AttachmentPointer };
        message.key = new Uint8Array();
        if (object.id !== undefined && object.id !== null) {
            message.id = Number(object.id);
        }
        else {
            message.id = 0;
        }
        if (object.contentType !== undefined && object.contentType !== null) {
            message.contentType = String(object.contentType);
        }
        else {
            message.contentType = '';
        }
        if (object.key !== undefined && object.key !== null) {
            message.key = bytesFromBase64(object.key);
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.contentType !== undefined && (obj.contentType = message.contentType);
        message.key !== undefined &&
            (obj.key = base64FromBytes(message.key !== undefined ? message.key : new Uint8Array()));
        return obj;
    },
    fromPartial(object) {
        const message = { ...basePushMessageContent_AttachmentPointer };
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = 0;
        }
        if (object.contentType !== undefined && object.contentType !== null) {
            message.contentType = object.contentType;
        }
        else {
            message.contentType = '';
        }
        if (object.key !== undefined && object.key !== null) {
            message.key = object.key;
        }
        else {
            message.key = new Uint8Array();
        }
        return message;
    },
};
const basePushMessageContent_GroupContext = { type: 0, name: '', members: '' };
exports.PushMessageContent_GroupContext = {
    encode(message, writer = minimal_1.Writer.create()) {
        if (message.id.length !== 0) {
            writer.uint32(10).bytes(message.id);
        }
        if (message.type !== 0) {
            writer.uint32(16).int32(message.type);
        }
        if (message.name !== '') {
            writer.uint32(26).string(message.name);
        }
        for (const v of message.members) {
            writer.uint32(34).string(v);
        }
        if (message.avatar !== undefined) {
            exports.PushMessageContent_AttachmentPointer.encode(message.avatar, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.Reader ? input : new minimal_1.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...basePushMessageContent_GroupContext };
        message.members = [];
        message.id = new Uint8Array();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.bytes();
                    break;
                case 2:
                    message.type = reader.int32();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                case 4:
                    message.members.push(reader.string());
                    break;
                case 5:
                    message.avatar = exports.PushMessageContent_AttachmentPointer.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...basePushMessageContent_GroupContext };
        message.members = [];
        message.id = new Uint8Array();
        if (object.id !== undefined && object.id !== null) {
            message.id = bytesFromBase64(object.id);
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = pushMessageContent_GroupContext_TypeFromJSON(object.type);
        }
        else {
            message.type = 0;
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = String(object.name);
        }
        else {
            message.name = '';
        }
        if (object.members !== undefined && object.members !== null) {
            for (const e of object.members) {
                message.members.push(String(e));
            }
        }
        if (object.avatar !== undefined && object.avatar !== null) {
            message.avatar = exports.PushMessageContent_AttachmentPointer.fromJSON(object.avatar);
        }
        else {
            message.avatar = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = base64FromBytes(message.id !== undefined ? message.id : new Uint8Array()));
        message.type !== undefined && (obj.type = pushMessageContent_GroupContext_TypeToJSON(message.type));
        message.name !== undefined && (obj.name = message.name);
        if (message.members) {
            obj.members = message.members.map((e) => e);
        }
        else {
            obj.members = [];
        }
        message.avatar !== undefined &&
            (obj.avatar = message.avatar ? exports.PushMessageContent_AttachmentPointer.toJSON(message.avatar) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...basePushMessageContent_GroupContext };
        message.members = [];
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = new Uint8Array();
        }
        if (object.type !== undefined && object.type !== null) {
            message.type = object.type;
        }
        else {
            message.type = 0;
        }
        if (object.name !== undefined && object.name !== null) {
            message.name = object.name;
        }
        else {
            message.name = '';
        }
        if (object.members !== undefined && object.members !== null) {
            for (const e of object.members) {
                message.members.push(e);
            }
        }
        if (object.avatar !== undefined && object.avatar !== null) {
            message.avatar = exports.PushMessageContent_AttachmentPointer.fromPartial(object.avatar);
        }
        else {
            message.avatar = undefined;
        }
        return message;
    },
};
function bytesFromBase64(b64) {
    if (b64 instanceof Uint8Array) {
        return b64;
    }
    return (0, base64_js_1.toByteArray)(b64);
}
function base64FromBytes(arr) {
    return (0, base64_js_1.fromByteArray)(arr);
}
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new Error('Value is larger than Number.MAX_SAFE_INTEGER');
    }
    return long.toNumber();
}
// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
// @ts-ignore
if (minimal_1.util.Long !== long_1.default) {
    minimal_1.util.Long = long_1.default;
    (0, minimal_1.configure)();
}
