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
exports.crypto = exports.Crypto = void 0;
exports.setWebCrypto = setWebCrypto;
exports.setCurve = setCurve;
exports.HKDF = HKDF;
exports.verifyMAC = verifyMAC;
exports.calculateMAC = calculateMAC;
const Internal = __importStar(require("."));
const util = __importStar(require("../helpers"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const getWebCrypto = () => {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
        return globalThis.crypto;
    }
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        return window.crypto;
    }
    // Try Node.js Web Crypto ONLY if we're actually in Node.js environment
    if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        try {
            const nodeCrypto = eval('require')('crypto');
            if (nodeCrypto.webcrypto) {
                return nodeCrypto.webcrypto;
            }
        }
        catch (e) {
            // Continue to next fallback
        }
    }
    throw new Error('No crypto implementation available. Provide one with setWebCrypto() or use an environment with Web Crypto support.');
};
const webcrypto = getWebCrypto();
class Crypto {
    constructor(crypto) {
        this._curve = new Internal.AsyncCurve();
        this._webcrypto = crypto || webcrypto;
    }
    set webcrypto(wc) {
        this._webcrypto = wc;
    }
    get webcrypto() {
        return this._webcrypto;
    }
    set curve(c) {
        this._curve.curve = c;
    }
    getRandomBytes(n) {
        const array = new Uint8Array(n);
        this._webcrypto.getRandomValues(array);
        return util.uint8ArrayToArrayBuffer(array);
    }
    async encrypt(key, data, iv) {
        const impkey = await this._webcrypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['encrypt']);
        return this._webcrypto.subtle.encrypt({ name: 'AES-CBC', iv: new Uint8Array(iv) }, impkey, data);
    }
    async decrypt(key, data, iv) {
        const impkey = await this._webcrypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);
        return this._webcrypto.subtle.decrypt({ name: 'AES-CBC', iv: new Uint8Array(iv) }, impkey, data);
    }
    async sign(key, data) {
        const impkey = await this._webcrypto.subtle.importKey('raw', key, { name: 'HMAC', hash: { name: 'SHA-256' } }, false, ['sign']);
        try {
            return this._webcrypto.subtle.sign({ name: 'HMAC', hash: 'SHA-256' }, impkey, data);
        }
        catch (e) {
            // console.log({ e, data, impkey })
            throw e;
        }
    }
    async hash(data) {
        return this._webcrypto.subtle.digest({ name: 'SHA-512' }, data);
    }
    async HKDF(input, salt, info) {
        // Specific implementation of RFC 5869 that only returns the first 3 32-byte chunks
        if (typeof info === 'string') {
            throw new Error(`HKDF info was a string`);
        }
        const PRK = await Internal.crypto.sign(salt, input);
        const infoBuffer = new ArrayBuffer(info.byteLength + 1 + 32);
        const infoArray = new Uint8Array(infoBuffer);
        infoArray.set(new Uint8Array(info), 32);
        infoArray[infoArray.length - 1] = 1;
        const T1 = await Internal.crypto.sign(PRK, infoBuffer.slice(32));
        infoArray.set(new Uint8Array(T1));
        infoArray[infoArray.length - 1] = 2;
        const T2 = await Internal.crypto.sign(PRK, infoBuffer);
        infoArray.set(new Uint8Array(T2));
        infoArray[infoArray.length - 1] = 3;
        const T3 = await Internal.crypto.sign(PRK, infoBuffer);
        return [T1, T2, T3];
    }
    // Curve25519 crypto
    createKeyPair(privKey) {
        if (!privKey) {
            privKey = this.getRandomBytes(32);
        }
        return this._curve.createKeyPair(privKey);
    }
    async generateAesKey() {
        const key = await this._webcrypto.subtle.generateKey({
            name: 'AES-CBC',
            length: 256,
        }, true, ['encrypt', 'decrypt']);
        return this._webcrypto.subtle.exportKey('raw', key);
    }
    ECDHE(pubKey, privKey) {
        return this._curve.ECDHE(pubKey, privKey);
    }
    Ed25519Sign(privKey, message) {
        return this._curve.Ed25519Sign(privKey, message);
    }
    Ed25519Verify(pubKey, msg, sig) {
        return this._curve.Ed25519Verify(pubKey, msg, sig);
    }
}
exports.Crypto = Crypto;
exports.crypto = new Crypto();
function setWebCrypto(webcrypto) {
    exports.crypto.webcrypto = webcrypto;
}
function setCurve(curve) {
    exports.crypto.curve = curve;
}
// HKDF for TextSecure has a bit of additional handling - salts always end up being 32 bytes
function HKDF(input, salt, info) {
    if (salt.byteLength != 32) {
        throw new Error('Got salt of incorrect length');
    }
    const abInfo = util.binaryStringToArrayBuffer(info);
    if (!abInfo) {
        throw new Error(`Invalid HKDF info`);
    }
    return exports.crypto.HKDF(input, salt, abInfo);
}
async function verifyMAC(data, key, mac, length) {
    const calculated_mac = await exports.crypto.sign(key, data);
    if (mac.byteLength != length || calculated_mac.byteLength < length) {
        throw new Error('Bad MAC length');
    }
    const a = new Uint8Array(calculated_mac);
    const b = new Uint8Array(mac);
    let result = 0;
    for (let i = 0; i < mac.byteLength; ++i) {
        result = result | (a[i] ^ b[i]);
    }
    if (result !== 0) {
        throw new Error('Bad MAC');
    }
}
function calculateMAC(key, data) {
    return exports.crypto.sign(key, data);
}
