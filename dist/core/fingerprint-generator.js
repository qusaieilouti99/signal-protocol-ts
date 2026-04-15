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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintGenerator = void 0;
const Internal = __importStar(require("./internal"));
const utils = __importStar(require("./helpers"));
class FingerprintGenerator {
    async createFor(localIdentifier, localIdentityKey, remoteIdentifier, remoteIdentityKey) {
        const localStr = await getDisplayStringFor(localIdentifier, localIdentityKey, this._iterations);
        const remoteStr = await getDisplayStringFor(remoteIdentifier, remoteIdentityKey, this._iterations);
        return [localStr, remoteStr].sort().join('');
    }
    constructor(_iterations) {
        this._iterations = _iterations;
    }
}
exports.FingerprintGenerator = FingerprintGenerator;
FingerprintGenerator.VERSION = 0;
async function getDisplayStringFor(identifier, key, iterations) {
    const bytes = concatArrayBuffers([
        shortToArrayBuffer(FingerprintGenerator.VERSION),
        key,
        utils.binaryStringToArrayBuffer(identifier),
    ]);
    const hash = await iterateHash(bytes, key, iterations);
    const output = new Uint8Array(hash);
    return (getEncodedChunk(output, 0) +
        getEncodedChunk(output, 5) +
        getEncodedChunk(output, 10) +
        getEncodedChunk(output, 15) +
        getEncodedChunk(output, 20) +
        getEncodedChunk(output, 25));
}
async function iterateHash(data, key, count) {
    const data1 = concatArrayBuffers([data, key]);
    const result = await Internal.crypto.hash(data1);
    if (--count === 0) {
        return result;
    }
    else {
        return iterateHash(result, key, count);
    }
}
function getEncodedChunk(hash, offset) {
    const chunk = (hash[offset] * Math.pow(2, 32) +
        hash[offset + 1] * Math.pow(2, 24) +
        hash[offset + 2] * Math.pow(2, 16) +
        hash[offset + 3] * Math.pow(2, 8) +
        hash[offset + 4]) %
        100000;
    let s = chunk.toString();
    while (s.length < 5) {
        s = '0' + s;
    }
    return s;
}
function shortToArrayBuffer(number) {
    return new Uint16Array([number]).buffer;
}
function concatArrayBuffers(bufs) {
    const lengths = bufs.map((b) => b.byteLength);
    const totalLength = lengths.reduce((p, c) => p + c, 0);
    const result = new Uint8Array(totalLength);
    lengths.reduce((p, c, i) => {
        result.set(new Uint8Array(bufs[i]), p);
        return p + c;
    }, 0);
    return result.buffer;
}
