# Changelog

## 0.1.3

- Fixed WebCrypto compatibility issue with react-native-nitro-crypto by adding explicit `length` property to AES-CBC algorithm during key import
- This resolves the `NitroNodeCrypto.createCipheriv(...): createCipheriv failed` error in React Native environments

## 0.1.2

- added root subpath shims and `typesVersions` so editors and older resolvers can resolve `signal-protocol-ts/helpers`, `curve`, `proto`, and `runtime` reliably

## 0.1.0

- merged curve, protobuf, and libsignal TypeScript sources into one package
- renamed the consumer package to `signal-protocol-ts`
- removed `msrcrypto` from the library runtime path
- added supported subpath exports for `helpers`, `curve`, `proto`, and `runtime`
- updated `Chat` integration to import from the new package name
