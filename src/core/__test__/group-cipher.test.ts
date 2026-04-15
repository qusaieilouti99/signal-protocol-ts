import { toByteArray } from 'base64-js'
import { GroupCipher } from '../group-cipher'
import { GroupSessionRecord } from '../group-session-record'
import { SignalProtocolGroupAddress } from '../signal-protocol-group-address'
import { FakeLogger } from './fake-logger'
import { SignalProtocolStore } from './storage-type'
import { SenderKey, ChainType, GroupSessionType } from '../session-types'
import * as utils from '../helpers'

function deserializeSenderKey(senderKey: SenderKey<string>): SenderKey<ArrayBuffer> {
    return {
        chainKey: utils.uint8ArrayToArrayBuffer(toByteArray(senderKey.chainKey)),
        signatureKey: utils.uint8ArrayToArrayBuffer(toByteArray(senderKey.signatureKey)),
        previousCounter: senderKey.previousCounter,
        previousChainSignatureKey: senderKey.previousChainSignatureKey
            ? utils.uint8ArrayToArrayBuffer(toByteArray(senderKey.previousChainSignatureKey))
            : undefined,
        senderKeyVersion: senderKey.senderKeyVersion,
    }
}

describe('GroupCipher', () => {
    const address = new SignalProtocolGroupAddress('group-1', 'alice', 1)
    const senderStore = new SignalProtocolStore()
    const receiverStore = new SignalProtocolStore()
    const logger = new FakeLogger()
    const senderCipher = new GroupCipher(senderStore, address, logger)
    const receiverCipher = new GroupCipher(receiverStore, address, logger)

    test('creates a sender session, encrypts, decrypts, and reuses cached decrypted text', async () => {
        const senderKey = await senderCipher.createSenderSession(1)
        await receiverCipher.createOrUpdateReceiverSession(deserializeSenderKey(senderKey))

        const plaintext = utils.binaryStringToArrayBuffer('hello group')
        const encrypted = await senderCipher.encrypt(plaintext)
        const decrypted = await receiverCipher.decrypt(encrypted.cipherText, 'binary', 'msg-1')

        expect(utils.arrayBufferToString(decrypted)).toBe('hello group')

        const decryptedAgain = await receiverCipher.decrypt(encrypted.cipherText, 'binary', 'msg-1')
        expect(utils.arrayBufferToString(decryptedAgain)).toBe('hello group')
    })

    test('rotates sender keys without breaking receiver decryption', async () => {
        const rotatedSenderKey = await senderCipher.resetSenderSession(2)
        expect(rotatedSenderKey.previousChainSignatureKey).toBeDefined()

        await receiverCipher.createOrUpdateReceiverSession(deserializeSenderKey(rotatedSenderKey))

        const plaintext = utils.binaryStringToArrayBuffer('rotated sender key message')
        const encrypted = await senderCipher.encrypt(plaintext)
        const decrypted = await receiverCipher.decrypt(encrypted.cipherText, 'binary', 'msg-2')

        expect(utils.arrayBufferToString(decrypted)).toBe('rotated sender key message')

        const receiverSessionSerialized = await receiverStore.loadSession(address.toString())
        const receiverSession = GroupSessionRecord.deserializeGroupSession(receiverSessionSerialized!)
        expect(receiverSession.oldRatchetList.length).toBe(1)
    })

    test('rejects duplicate sender session creation for the same version', async () => {
        await expect(senderCipher.createSenderSession(1)).rejects.toThrow('SENDER_KEY_ALREADY_CREATED')
    })
})

describe('GroupSessionRecord', () => {
    test('serializes and deserializes group session state without changing payloads', () => {
        const signatureKey = utils.binaryStringToArrayBuffer('signature-key-32-bytes-signature-key')
        const chainKey = utils.binaryStringToArrayBuffer('chain-key-32-bytes-chain-key-1234')
        const session: GroupSessionType = {
            currentRatchet: {
                senderKeyVersion: 4,
                signaturePublicKey: signatureKey,
                signatureKeyPair: {
                    pubKey: signatureKey,
                    privKey: chainKey,
                },
                previousCounter: 6,
                added: Date.now(),
            },
            oldRatchetList: [],
            chains: {
                [utils.arrayBufferToString(signatureKey)]: {
                    chainType: ChainType.SENDING,
                    chainKey: { key: chainKey, counter: 6 },
                    messageKeys: { 6: chainKey },
                },
            },
        }

        const serialized = GroupSessionRecord.serializeGroupSession(session)
        const deserialized = GroupSessionRecord.deserializeGroupSession(serialized)

        expect(GroupSessionRecord.serializeGroupSession(deserialized)).toBe(serialized)
    })

    test('removes expired old chains beyond the retention limit', () => {
        const now = Date.now()
        const session: GroupSessionType = {
            oldRatchetList: [],
            chains: {},
        }

        for (let i = 0; i < 12; i++) {
            const key = new Uint8Array(33)
            key.fill(i + 1)
            const keyBuffer = key.buffer.slice(0)
            const keyString = utils.arrayBufferToString(keyBuffer)
            session.oldRatchetList.push({
                signaturePublicKey: keyBuffer,
                added: now - 31 * 24 * 60 * 60 * 1000 - i,
            })
            session.chains[keyString] = {
                chainType: ChainType.RECEIVING,
                chainKey: { counter: i },
                messageKeys: {},
            }
        }

        GroupSessionRecord.removeOldChains(session)

        expect(session.oldRatchetList.length).toBeLessThanOrEqual(10)
        expect(Object.keys(session.chains).length).toBeLessThan(12)
    })
})
