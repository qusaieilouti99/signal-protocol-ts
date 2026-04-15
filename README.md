# signal-protocol-ts

Merged TypeScript package for the existing Signal-compatible curve, protobuf, and core session logic used by `Chat`.

## Goals

- preserve current key, session, and wire compatibility
- expose one installable package instead of three interdependent repos
- remove `msrcrypto` from the library runtime path
- provide supported public exports for consumers like `Chat`

## Install

```bash
npm install signal-protocol-ts
```

## Public Surface

Top-level exports preserve the existing `libsignal-protocol-typescript` API where practical:

- `KeyHelper`
- `SessionBuilder`
- `SessionCipher`
- `GroupCipher`
- `SignalProtocolAddress`
- `SignalProtocolGroupAddress`
- `FingerprintGenerator`
- protocol-facing types used by `Chat`

Supported subpaths:

- `signal-protocol-ts/helpers`
- `signal-protocol-ts/curve`
- `signal-protocol-ts/proto`
- `signal-protocol-ts/runtime`

## Development

```bash
npm install
npm test
npm run build
```
