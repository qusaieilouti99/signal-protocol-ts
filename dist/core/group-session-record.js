"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSessionRecord = void 0;
const base64_js_1 = __importDefault(require("base64-js"));
const util = __importStar(require("./helpers"));
const session_record_1 = require("./session-record");
class GroupSessionRecord {
    static deserializeGroupSession(serialized) {
        const json = JSON.parse(serialized);
        return this.groupSessionTypeStringToArrayBuffer(json);
    }
    static serializeGroupSession(session) {
        const json = this.groupSessionTypeArrayBufferToString(session);
        return JSON.stringify(json);
    }
    static groupSessionTypeArrayBufferToString(session) {
        const { currentRatchet, oldRatchetList, chains } = session;
        const newChains = {};
        for (const k of Object.keys(chains)) {
            newChains[k] = (0, session_record_1.chainArrayBufferToString)(chains[k]);
        }
        return {
            currentRatchet: currentRatchet && this.groupRatchetArrayBufferToString(currentRatchet),
            oldRatchetList: oldRatchetList.map(this.groupOldRatchetInfoArrayBufferToString),
            chains: newChains,
        };
    }
    static groupRatchetArrayBufferToString(ratchet) {
        return {
            senderKeyVersion: ratchet.senderKeyVersion,
            signatureKeyPair: ratchet.signatureKeyPair && (0, session_record_1.keyPairArrayBufferToString)(ratchet.signatureKeyPair),
            signaturePublicKey: (0, session_record_1.abToS)(ratchet.signaturePublicKey),
            previousCounter: ratchet.previousCounter,
            added: ratchet.added,
        };
    }
    static groupOldRatchetInfoArrayBufferToString(ori) {
        return {
            signaturePublicKey: (0, session_record_1.abToS)(ori.signaturePublicKey),
            added: ori.added,
        };
    }
    static groupSessionTypeStringToArrayBuffer(json) {
        const { currentRatchet, oldRatchetList, chains } = json;
        const newChains = {};
        for (const k of Object.keys(chains)) {
            newChains[k] = (0, session_record_1.chainStringToArrayBuffer)(chains[k]);
        }
        return {
            currentRatchet: currentRatchet && this.groupRatchetStringToArrayBuffer(currentRatchet),
            oldRatchetList: oldRatchetList.map(this.groupOldRatchetInfoStringToArrayBuffer),
            chains: newChains,
        };
    }
    static groupRatchetStringToArrayBuffer(ratchet) {
        return {
            senderKeyVersion: ratchet.senderKeyVersion,
            signaturePublicKey: (0, session_record_1.toAB)(ratchet.signaturePublicKey),
            signatureKeyPair: ratchet.signatureKeyPair && (0, session_record_1.keyPairStirngToArrayBuffer)(ratchet.signatureKeyPair),
            previousCounter: ratchet.previousCounter,
            added: ratchet.added,
        };
    }
    static groupOldRatchetInfoStringToArrayBuffer(ori) {
        return {
            signaturePublicKey: (0, session_record_1.toAB)(ori.signaturePublicKey),
            added: ori.added,
        };
    }
    static serializeSenderKey(senderKey) {
        return {
            chainKey: base64_js_1.default.fromByteArray(new Uint8Array(senderKey.chainKey)),
            signatureKey: base64_js_1.default.fromByteArray(new Uint8Array(senderKey.signatureKey)),
            previousCounter: senderKey.previousCounter,
            previousChainSignatureKey: senderKey.previousChainSignatureKey &&
                base64_js_1.default.fromByteArray(new Uint8Array(senderKey.previousChainSignatureKey)),
            senderKeyVersion: senderKey.senderKeyVersion,
        };
    }
    static removeOldChains(session) {
        // Sending ratchets are always removed when we step because we never need them again
        // Receiving ratchets are added to the oldRatchetList, which we parse
        // here and remove all but the last ten.
        while (session.oldRatchetList.length > session_record_1.OLD_RATCHETS_MAX_LENGTH) {
            let index = 0;
            let oldest = session.oldRatchetList[0];
            for (let i = 0; i < session.oldRatchetList.length; i++) {
                if (session.oldRatchetList[i].added < oldest.added) {
                    oldest = session.oldRatchetList[i];
                    index = i;
                }
            }
            const idx = util.arrayBufferToString(oldest.signaturePublicKey);
            if (!idx) {
                throw new Error(`invalid index for chain`);
            }
            const oldestDate = new Date(oldest.added);
            // this means the oldest chain has expired, so we remove it
            // 30 days after the date it's added at => expired
            if (Date.now() > oldestDate.setDate(oldestDate.getDate() + 30)) {
                delete session.chains[idx];
                session.oldRatchetList.splice(index, 1);
            }
            else {
                // prevent infinite loop
                break;
            }
        }
    }
}
exports.GroupSessionRecord = GroupSessionRecord;
