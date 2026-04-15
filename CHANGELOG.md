# Changelog

## 0.1.0

- merged curve, protobuf, and libsignal TypeScript sources into one package
- renamed the consumer package to `signal-protocol-ts`
- removed `msrcrypto` from the library runtime path
- added supported subpath exports for `helpers`, `curve`, `proto`, and `runtime`
- updated `Chat` integration to import from the new package name
