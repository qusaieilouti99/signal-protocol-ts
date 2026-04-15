"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayBufferToString = arrayBufferToString;
exports.uint8ArrayToString = uint8ArrayToString;
exports.binaryStringToArrayBuffer = binaryStringToArrayBuffer;
exports.isEqual = isEqual;
exports.uint8ArrayToArrayBuffer = uint8ArrayToArrayBuffer;
function arrayBufferToString(b) {
    return uint8ArrayToString(new Uint8Array(b));
}
function uint8ArrayToString(arr) {
    const end = arr.length;
    let begin = 0;
    if (begin === end)
        return '';
    let chars = [];
    const parts = [];
    while (begin < end) {
        chars.push(arr[begin++]);
        if (chars.length >= 1024) {
            parts.push(String.fromCharCode(...chars));
            chars = [];
        }
    }
    return parts.join('') + String.fromCharCode(...chars);
}
function binaryStringToArrayBuffer(str) {
    let i = 0;
    const k = str.length;
    let charCode;
    const bb = [];
    while (i < k) {
        charCode = str.charCodeAt(i);
        if (charCode > 0xff)
            throw RangeError('illegal char code: ' + charCode);
        bb[i++] = charCode;
    }
    return Uint8Array.from(bb).buffer;
}
function isEqual(a, b) {
    // TODO: Special-case arraybuffers, etc
    if (a === undefined || b === undefined) {
        return false;
    }
    const a1 = arrayBufferToString(a);
    const b1 = arrayBufferToString(b);
    const maxLength = Math.max(a1.length, b1.length);
    if (maxLength < 5) {
        throw new Error('a/b compare too short');
    }
    return a1.substring(0, Math.min(maxLength, a1.length)) == b1.substring(0, Math.min(maxLength, b1.length));
}
function uint8ArrayToArrayBuffer(arr) {
    return arr.buffer.slice(arr.byteOffset, arr.byteLength + arr.byteOffset);
}
