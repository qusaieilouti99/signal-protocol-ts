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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.setCurve = exports.setWebCrypto = void 0;
const curve_1 = require("../curve");
const curve_2 = require("./curve");
__exportStar(require("./types"), exports);
__exportStar(require("./signal-protocol-address"), exports);
__exportStar(require("./signal-protocol-group-address"), exports);
__exportStar(require("./key-helper"), exports);
__exportStar(require("./fingerprint-generator"), exports);
__exportStar(require("./session-builder"), exports);
__exportStar(require("./session-cipher"), exports);
__exportStar(require("./session-types"), exports);
__exportStar(require("./curve"), exports);
__exportStar(require("./group-cipher"), exports);
__exportStar(require("./group-session-record"), exports);
__exportStar(require("./helpers"), exports);
const Internal = __importStar(require("./internal"));
var internal_1 = require("./internal");
Object.defineProperty(exports, "setWebCrypto", { enumerable: true, get: function () { return internal_1.setWebCrypto; } });
Object.defineProperty(exports, "setCurve", { enumerable: true, get: function () { return internal_1.setCurve; } });
// returns a promise of something with the shape of the old libsignal
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.default = async () => {
    const cw = await curve_1.Curve25519Wrapper.create();
    return {
        Curve: new curve_2.Curve(new Internal.Curve(cw)),
    };
};
