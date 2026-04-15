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
exports.GroupCipher = void 0;
const util = __importStar(require("./helpers"));
const session_lock_1 = require("./session-lock");
const session_types_1 = require("./session-types");
const Internal = __importStar(require("./internal"));
const base64 = __importStar(require("base64-js"));
const proto_1 = require("../proto");
const group_session_record_1 = require("./group-session-record");
class GroupCipher {
    constructor(storage, address, logger) {
        this.encryptJob = async (buffer) => {
            if (!(buffer instanceof ArrayBuffer)) {
                throw new Error('Expected buffer to be an ArrayBuffer');
            }
            const address = this.address.toString();
            const msg = proto_1.GroupWhisperMessage.fromJSON({});
            const session = await this.getSession(address);
            if (!session) {
                this.logger.sendEvent(`group-encrypt:address=${this.address.toString()}`, {
                    functionName: 'encryptJob',
                    error: 'no-session-to-encrypt',
                });
                throw new Error('No session to encrypt message for ' + address);
            }
            const { chain } = await this.prepareChain(address, session, msg);
            const keys = await Internal.HKDF(chain.messageKeys[chain.chainKey.counter], new ArrayBuffer(32), 'WhisperMessageKeys');
            delete chain.messageKeys[chain.chainKey.counter];
            msg.counter = chain.chainKey.counter;
            msg.previousCounter = session.currentRatchet.previousCounter;
            const ciphertext = await Internal.crypto.encrypt(keys[0], buffer, keys[2].slice(0, 16));
            // Receivers verify this signature against the current sender-key chain before decrypting.
            const signature = await Internal.crypto.Ed25519Sign(session.currentRatchet.signatureKeyPair.privKey, ciphertext);
            msg.ciphertext = new Uint8Array(ciphertext);
            msg.signature = new Uint8Array(signature);
            this.logger.sendEvent(`group-encrypt:address=${this.address.toString()}`, {
                functionName: 'encryptJob',
                info: 'group text encrypted successfully.',
                senderKeyVersion: session.currentRatchet.senderKeyVersion,
                msgCounter: msg.counter,
                previousCounter: msg.previousCounter,
                signature: msg.signature,
            });
            const encodedMsg = proto_1.GroupWhisperMessage.encode(msg).finish();
            group_session_record_1.GroupSessionRecord.removeOldChains(session);
            const ser = group_session_record_1.GroupSessionRecord.serializeGroupSession(session);
            await this.storage.storeSession(address, ser);
            // the final cipher text
            return {
                cipherText: util.uint8ArrayToString(encodedMsg),
                senderKeyVersion: session.currentRatchet.senderKeyVersion,
            };
        };
        this.prepareChain = async (address, session, msg) => {
            if (!session) {
                throw new Error('No session to encrypt message for ' + address);
            }
            if (!session.currentRatchet?.signaturePublicKey) {
                this.logger.sendEvent(`group-encrypt:address=${this.address.toString()}`, {
                    functionName: 'prepareChain',
                    error: 'ratchet missing signaturePublicKey',
                });
                throw new Error(`ratchet missing signaturePublicKey`);
            }
            msg.signaturePublicKey = new Uint8Array(session.currentRatchet.signaturePublicKey);
            const chain = session.chains[base64.fromByteArray(msg.signaturePublicKey)];
            if (chain?.chainType === session_types_1.ChainType.RECEIVING) {
                this.logger.sendEvent(`group-encrypt:address=${this.address.toString()}`, {
                    functionName: 'prepareChain',
                    error: 'Tried to encrypt on a receiving chain',
                });
                throw new Error('Tried to encrypt on a receiving chain');
            }
            await this.fillMessageKeys(chain, chain.chainKey.counter + 1);
            return { chain };
        };
        this.fillMessageKeys = async (chain, counter) => {
            if (chain.chainKey.counter >= counter) {
                return Promise.resolve(); // Already calculated
            }
            if (chain.chainKey.key === undefined) {
                this.logger.sendEvent(`group-encrypt&decrypt:address=${this.address.toString()}`, {
                    functionName: 'fillMessageKeys',
                    error: 'Got invalid request to extend chain after it was already closed',
                });
                throw new Error('Got invalid request to extend chain after it was already closed');
            }
            const ckey = chain.chainKey.key;
            if (!ckey) {
                this.logger.sendEvent(`group-encrypt&decrypt:address=${this.address.toString()}`, {
                    functionName: 'fillMessageKeys',
                    error: 'hain key is missing',
                });
                throw new Error(`chain key is missing`);
            }
            // Compute KDF_CK as described in X3DH specification
            const byteArray = new Uint8Array(1);
            byteArray[0] = 1;
            const mac = await Internal.crypto.sign(ckey, byteArray.buffer);
            byteArray[0] = 2;
            const key = await Internal.crypto.sign(ckey, byteArray.buffer);
            chain.messageKeys[chain.chainKey.counter + 1] = mac;
            chain.chainKey.key = key;
            chain.chainKey.counter += 1;
            this.logger.sendEvent(`group-encrypt&decrypt:address=${this.address.toString()}`, {
                functionName: 'fillMessageKeys',
                info: 'derived a new key successfully ',
                chainKeyCounter: chain.chainKey.counter,
            });
            await this.fillMessageKeys(chain, counter);
        };
        this.createSenderSessionJob = async (version) => {
            let session = await this.getSession(this.address.toString());
            if (session) {
                this.logger.sendEvent(`group-create-session:address=${this.address.toString()}`, {
                    functionName: 'createSenderSessionJob',
                    error: `SENDER_KEY_ALREADY_CREATED`,
                });
                throw new Error(`SENDER_KEY_ALREADY_CREATED`);
            }
            // generate keys
            const { signatureKeyPair, chainKey } = await this.generateGroupSenderKey();
            // create the session
            session = {
                currentRatchet: {
                    senderKeyVersion: version,
                    signaturePublicKey: signatureKeyPair.pubKey,
                    signatureKeyPair: signatureKeyPair,
                    previousCounter: 0,
                },
                oldRatchetList: [],
                chains: {
                    [base64.fromByteArray(new Uint8Array(signatureKeyPair.pubKey))]: {
                        chainKey: {
                            key: chainKey,
                            counter: -1,
                        },
                        chainType: session_types_1.ChainType.SENDING,
                        messageKeys: {},
                    },
                },
            };
            group_session_record_1.GroupSessionRecord.removeOldChains(session);
            // TODO check race cond
            await this.storage.storeSession(this.address.toString(), group_session_record_1.GroupSessionRecord.serializeGroupSession(session));
            const senderKey = group_session_record_1.GroupSessionRecord.serializeSenderKey({
                signatureKey: signatureKeyPair.pubKey,
                chainKey,
                previousCounter: 0,
                senderKeyVersion: version,
            });
            this.logger.sendEvent(`group-create-session:address=${this.address.toString()}`, {
                functionName: 'createSenderSessionJob',
                info: `successfully stored the session for sender key`,
                senderKeyVersion: version,
                signaturePubKey: senderKey.signatureKey,
            });
            await this.storage.saveSenderKey(this.address.toString(), version, senderKey);
            this.logger.sendEvent(`group-create-session:address=${this.address.toString()}`, {
                functionName: 'createSenderSessionJob',
                info: `successfully added pending sender key`,
                senderKeyVersion: version,
                signaturePubKey: senderKey.signatureKey,
            });
            return senderKey;
        };
        this.resetSenderSessionJob = async (version) => {
            // generate keys
            const { signatureKeyPair, chainKey } = await this.generateGroupSenderKey();
            // update the session
            const session = await this.getSession(this.address.toString());
            if (!session) {
                this.logger.sendEvent(`group-reset-session:address=${this.address.toString()}`, {
                    functionName: 'resetSenderSessionJob',
                    error: `No session for address`,
                });
                throw new Error(`No session for address ${this.address.toString()}`);
            }
            if (session.currentRatchet.senderKeyVersion >= version) {
                this.logger.sendEvent(`group-reset-session:address=${this.address.toString()}`, {
                    functionName: 'resetSenderSessionJob',
                    error: `SENDER_KEY_ALREADY_CREATED`,
                });
                throw new Error(`SENDER_KEY_ALREADY_CREATED`);
            }
            session.chains[base64.fromByteArray(new Uint8Array(signatureKeyPair.pubKey))] = {
                messageKeys: {},
                chainKey: { counter: -1, key: chainKey },
                chainType: session_types_1.ChainType.SENDING,
            };
            const ratchet = session.currentRatchet;
            const previousRatchetKey = ratchet.signaturePublicKey;
            const previousRatchetKeyString = base64.fromByteArray(new Uint8Array(ratchet.signaturePublicKey));
            if (session.chains[previousRatchetKeyString] !== undefined) {
                ratchet.previousCounter = session.chains[previousRatchetKeyString].chainKey.counter;
                delete session.chains[previousRatchetKeyString];
            }
            ratchet.signaturePublicKey = signatureKeyPair.pubKey;
            ratchet.signatureKeyPair = signatureKeyPair;
            ratchet.senderKeyVersion = version;
            group_session_record_1.GroupSessionRecord.removeOldChains(session);
            // TODO check race cond
            await this.storage.storeSession(this.address.toString(), group_session_record_1.GroupSessionRecord.serializeGroupSession(session));
            const senderKey = group_session_record_1.GroupSessionRecord.serializeSenderKey({
                signatureKey: signatureKeyPair.pubKey,
                chainKey,
                previousCounter: ratchet.previousCounter,
                previousChainSignatureKey: previousRatchetKey,
                senderKeyVersion: version,
            });
            this.logger.sendEvent(`group-reset-session:address=${this.address.toString()}`, {
                functionName: 'resetSenderSessionJob',
                info: `successfully stored the session for sender key`,
                senderKeyVersion: version,
                signaturePubKey: senderKey.signatureKey,
            });
            await this.storage.saveSenderKey(this.address.toString(), version, senderKey);
            this.logger.sendEvent(`group-reset-session:address=${this.address.toString()}`, {
                functionName: 'resetSenderSessionJob',
                info: `successfully added pending sender key`,
                senderKeyVersion: version,
                signaturePubKey: senderKey.signatureKey,
            });
            return senderKey;
        };
        // createSenderKey1 => sendMessage 7 times  => resetSenderKey2 => sendMessage 4 times =>  resetSenderKey3 => sendMessage 5 times
        // createSenderKey1 => sendMessage 7 times  => resetSenderKey3 => sendMessage 5 times =>  resetSenderKey2 => sendMessage 4 times
        this.createOrUpdateReceiverSessionJob = async (senderKey) => {
            let existingSession = await this.getSession(this.address.toString());
            if (existingSession) {
                if (existingSession?.chains[base64.fromByteArray(new Uint8Array(senderKey.signatureKey))]) {
                    // the chain is already exists
                    this.logger.sendEvent(`group-receiver-session:address=${this.address.toString()}`, {
                        functionName: 'createOrUpdateReceiverSessionJob',
                        info: `there is already existing session for this address`,
                        senderKeyVersion: senderKey.senderKeyVersion,
                        signaturePubKey: base64.fromByteArray(new Uint8Array(senderKey.signatureKey)),
                    });
                    return Promise.resolve();
                }
                // todo remove this code
                if (senderKey.previousChainSignatureKey) {
                    const previousChain = existingSession.chains[base64.fromByteArray(new Uint8Array(senderKey.previousChainSignatureKey))];
                    if (previousChain !== undefined) {
                        await this.fillMessageKeys(previousChain, senderKey.previousCounter).then(function () {
                            delete previousChain.chainKey.key;
                            existingSession.oldRatchetList[existingSession.oldRatchetList.length] = {
                                added: Date.now(),
                                signaturePublicKey: senderKey.previousChainSignatureKey,
                            };
                        });
                    }
                    else {
                        existingSession.oldRatchetList[existingSession.oldRatchetList.length] = {
                            added: Date.now(),
                            signaturePublicKey: senderKey.previousChainSignatureKey,
                        };
                    }
                }
                // add the new chain
                existingSession.chains[base64.fromByteArray(new Uint8Array(senderKey.signatureKey))] = {
                    messageKeys: {},
                    chainKey: { counter: -1, key: senderKey.chainKey },
                    chainType: session_types_1.ChainType.RECEIVING,
                };
            }
            else {
                existingSession = {
                    oldRatchetList: [],
                    chains: {
                        [base64.fromByteArray(new Uint8Array(senderKey.signatureKey))]: {
                            chainKey: {
                                key: senderKey.chainKey,
                                counter: -1,
                            },
                            chainType: session_types_1.ChainType.RECEIVING,
                            messageKeys: {},
                        },
                    },
                };
            }
            group_session_record_1.GroupSessionRecord.removeOldChains(existingSession);
            await this.storage.storeSession(this.address.toString(), group_session_record_1.GroupSessionRecord.serializeGroupSession(existingSession));
            this.logger.sendEvent(`group-receiver-session:address=${this.address.toString()}`, {
                functionName: 'createOrUpdateReceiverSessionJob',
                info: `successfully stored the receiver session for sender key`,
                senderKeyVersion: senderKey.senderKeyVersion,
                signaturePubKey: base64.fromByteArray(new Uint8Array(senderKey.signatureKey)),
            });
        };
        this.address = address;
        this.storage = storage;
        this.logger = logger;
    }
    encrypt(buffer) {
        return session_lock_1.SessionLock.queueJob(this.address.toString(), () => this.encryptJob(buffer));
    }
    createSenderSession(version) {
        return session_lock_1.SessionLock.queueJob(this.address.toString(), () => this.createSenderSessionJob(version));
    }
    createOrUpdateReceiverSession(senderKey) {
        return session_lock_1.SessionLock.queueJob(this.address.toString(), () => this.createOrUpdateReceiverSessionJob(senderKey));
    }
    resetSenderSession(version) {
        return session_lock_1.SessionLock.queueJob(this.address.toString(), () => this.resetSenderSessionJob(version));
    }
    decrypt(buff, encoding, textId = '') {
        return session_lock_1.SessionLock.queueJob(this.address.toString(), () => this.decryptJob(buff, encoding, textId));
    }
    async decryptJob(buff, encoding, textId = '') {
        encoding = encoding || 'binary';
        if (encoding !== 'binary') {
            this.logger.sendEvent(`group-decrypt:address=${this.address.toString()}`, {
                functionName: 'decryptJob',
                error: `unsupported encoding: ${encoding}`,
            });
            throw new Error(`unsupported encoding: ${encoding}`);
        }
        const buffer = typeof buff === 'string' ? util.binaryStringToArrayBuffer(buff) : buff;
        const address = this.address.toString();
        const message = proto_1.GroupWhisperMessage.decode(new Uint8Array(buffer));
        await Internal.crypto.Ed25519Verify(util.uint8ArrayToArrayBuffer(message.signaturePublicKey), util.uint8ArrayToArrayBuffer(message.ciphertext), util.uint8ArrayToArrayBuffer(message.signature));
        const session = await this.getSession(address);
        if (!session) {
            this.logger.sendEvent(`group-decrypt:address=${this.address.toString()}`, {
                functionName: 'decryptJob',
                error: `no session`,
            });
            const e = new Error('No record for device ' + address);
            e.name = 'NO_SESSION';
            throw e;
        }
        const chain = session.chains[base64.fromByteArray(message.signaturePublicKey)];
        if (!chain) {
            this.logger.sendEvent(`group-decrypt:address=${this.address.toString()}`, {
                functionName: 'decryptJob',
                error: `no chain for ${base64.fromByteArray(message.signaturePublicKey)}`,
            });
            const e = new Error('no chain found for key ');
            e.name = 'NO_CHAIN';
            throw e;
        }
        if (chain?.chainType === session_types_1.ChainType.SENDING) {
            this.logger.sendEvent(`group-decrypt:address=${this.address.toString()}`, {
                functionName: 'decryptJob',
                error: `Tried to decrypt on a sending chain`,
            });
            throw new Error('Tried to decrypt on a sending chain');
        }
        await this.fillMessageKeys(chain, message.counter);
        const messageKey = chain.messageKeys[message.counter];
        if (messageKey === undefined) {
            const alreadyDecryptedText = await this.storage.getDecryptedText(textId);
            if (alreadyDecryptedText) {
                this.logger.sendEvent(`group-decrypt:address=${this.address.toString()}`, {
                    functionName: 'decryptJob',
                    info: `found already decrypted text saved locally for ${textId}`,
                });
                return alreadyDecryptedText;
            }
            this.logger.sendEvent(`group-decrypt:address=${this.address.toString()}`, {
                functionName: 'decryptJob',
                error: `Message key not found. The counter was repeated or the key was not filled. for message counter ${message.counter}`,
            });
            throw new Error('Message key not found. The counter was repeated or the key was not filled.');
        }
        const keys = await Internal.HKDF(messageKey, new ArrayBuffer(32), 'WhisperMessageKeys');
        const plaintext = await Internal.crypto.decrypt(keys[0], util.uint8ArrayToArrayBuffer(message.ciphertext), keys[2].slice(0, 16));
        await this.storage.storeDecryptedText(textId, plaintext);
        this.logger.sendEvent(`group-decrypt:address=${this.address.toString()}`, {
            functionName: 'decryptJob',
            info: `successfully decrypted and saved locally for ${textId} and the key deleted`,
            msgCounter: message.counter,
        });
        delete chain.messageKeys[message.counter];
        group_session_record_1.GroupSessionRecord.removeOldChains(session);
        const ser = group_session_record_1.GroupSessionRecord.serializeGroupSession(session);
        await this.storage.storeSession(address, ser);
        return plaintext;
    }
    async generateGroupSenderKey() {
        // this will be used for signing the cipher messages
        const signatureKeyPair = await Internal.crypto.createKeyPair();
        // this will be used for deriving the messages keys
        const chainKey = await Internal.crypto.generateAesKey();
        return { signatureKeyPair, chainKey };
    }
    async getSession(encodedNumber) {
        const serialized = await this.storage.loadSession(encodedNumber);
        if (serialized === undefined) {
            return undefined;
        }
        return group_session_record_1.GroupSessionRecord.deserializeGroupSession(serialized);
    }
}
exports.GroupCipher = GroupCipher;
