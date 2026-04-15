# Compatibility Notes

This package is intended to preserve compatibility with the existing `Chat` deployment.

## Storage invariants

- session records stay JSON-string serialized
- identity keys remain stored by bare user identifier
- prekeys remain stored under `25519KeypreKey${keyId}`
- signed prekeys remain stored under `25519KeysignedKey${keyId}`
- sender keys remain stored as `senderKey:${address}:${senderKeyVersion}`

## Wire invariants

- public keys keep the legacy leading version byte
- signed prekey signatures keep the existing curve/XEdDSA-compatible behavior
- protobuf payloads keep the legacy field layout
- group sender-key payloads keep the current JSON shape

## Runtime invariants

- the library no longer depends on `msrcrypto`
- the package ships prebuilt `dist/` output so Bun/Git installs do not need lifecycle scripts
- React Native consumers should inject a Web Crypto implementation such as `react-native-nitro-crypto`
