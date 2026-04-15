import signalProtocol from '../../src'
import compatibilityFixture from '../fixtures/compatibility.json'
import { SessionRecord } from '../../src/core/session-record'
import { PushMessageContentCompatible } from '../../src/proto'

function hexToArrayBuffer(hex: string): ArrayBuffer {
    return Uint8Array.from(hex.match(/../g)!.map((value) => parseInt(value, 16))).buffer
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
    return Buffer.from(buffer).toString('hex')
}

describe('compatibility fixtures', () => {
    test('identity key version byte layout stays unchanged', async () => {
        const signal = await signalProtocol()
        const pair = signal.Curve.createKeyPair(hexToArrayBuffer(compatibilityFixture.identityKeyPair.privKeyHex))

        expect(arrayBufferToHex(pair.pubKey)).toBe(compatibilityFixture.identityKeyPair.pubKeyHex)
        expect(arrayBufferToHex(pair.privKey)).toBe(compatibilityFixture.identityKeyPair.privKeyHex)
    })

    test('signed prekey signatures verify against the fixture identity key', async () => {
        const signal = await signalProtocol()
        const verified = signal.Curve.verifySignature(
            hexToArrayBuffer(compatibilityFixture.identityKeyPair.pubKeyHex),
            hexToArrayBuffer(compatibilityFixture.signedPreKey.publicKeyHex),
            hexToArrayBuffer(compatibilityFixture.signedPreKey.signatureHex)
        )

        expect(verified).toBe(false)
    })

    test('serialized session records remain readable and stable', () => {
        const serialized = Buffer.from(compatibilityFixture.sessionRecordBase64, 'base64').toString('utf8')
        const record = SessionRecord.deserialize(serialized)

        expect(record.serialize()).toBe(serialized)
    })

    test('sender key JSON shape remains unchanged', () => {
        expect(Object.keys(compatibilityFixture.senderKey).sort()).toEqual([
            'chainKey',
            'previousChainSignatureKey',
            'previousCounter',
            'senderKeyVersion',
            'signatureKey',
        ])
        expect(compatibilityFixture.senderKey.senderKeyVersion).toBe(17)
        expect(compatibilityFixture.senderKey.signatureKey).toBe(
            Buffer.from(compatibilityFixture.identityKeyPair.pubKeyHex, 'hex').toString('base64')
        )
        expect(compatibilityFixture.senderKey.previousChainSignatureKey).toBe(
            Buffer.from(compatibilityFixture.preKey.publicKeyHex, 'hex').toString('base64')
        )
    })

    test('protobuf payload bytes remain stable for a compatibility message', () => {
        const encoded = PushMessageContentCompatible.encode(
            PushMessageContentCompatible.fromJSON({ body: 'compatibility-check' })
        ).finish()
        const fixtureHex = compatibilityFixture.pushMessageContentHex

        expect(Buffer.from(encoded).toString('hex')).toBe(fixtureHex)
        expect(PushMessageContentCompatible.decode(Buffer.from(fixtureHex, 'hex')).body).toBe('compatibility-check')
    })
})
