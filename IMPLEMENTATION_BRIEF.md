# `signal-protocol-ts` Implementation Brief

## Goal

Refactor the current three repositories into a single modern TypeScript package named `signal-protocol-ts`, then migrate the `Chat` application to use it.

This is a **compatibility-preserving refactor and release**, not a protocol redesign.

The main goal is:

- keep Signal protocol behavior compatible with already released devices
- keep persisted local data readable without migration breakage
- keep wire formats compatible with older app versions
- remove obsolete crypto/runtime baggage where safe
- modernize packaging, imports, build, tests, and repo structure

## Scope

In scope:

- merge these three codebases into one package:
  - `curve25519-typescript`
  - `libsignal-protocol-protobuf-ts`
  - `libsignal-protocol-typescript`
- rename the consumer-facing package to `signal-protocol-ts`
- modernize the package structure and exports
- keep current protocol-visible outputs compatible
- update `Chat` to use the new package
- replace obsolete crypto bootstrap choices where safe
- keep persisted data and serialized payloads compatible
- add compatibility tests based on current behavior

Out of scope for this phase:

- redesigning the protocol
- changing persisted session formats
- changing bundle payload shape
- changing key byte formats
- changing the curve/signature model used by the current implementation
- moving fully to a new native-first asymmetric crypto architecture
- plan 2 / future native-only redesign

## Repositories Involved

Current source repos:

- `/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/curve25519-typescript`
- `/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/libsignal-protocol-protobuf-ts`
- `/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/libsignal-protocol-typescript`

Consumer app:

- `/Users/qusaieilouti/WebstormProjects/Chat`

## Non-Negotiable Compatibility Rules

The following must stay compatible with already released devices and existing local installs.

### 1. Persisted Local Data Must Remain Readable

`Chat` already stores Signal data locally and the new package must continue reading and writing the same formats.

Important storage behavior in `Chat`:

- sessions are stored as strings under `session${identifier}`
- identity keys are stored as base64 strings under `identityKey${identifier}`
- prekeys are stored under `25519KeypreKey${keyId}`
- signed prekeys are stored under `25519KeysignedKey${keyId}`
- sender keys are stored under `senderKey:${address}:${senderKeyVersion}`

Relevant file:

- [signal-storage.ts](/Users/qusaieilouti/WebstormProjects/Chat/app/signal-protocol/signal-storage.ts)

Rules:

- do not change session serialization format
- do not change key storage field names
- do not change base64 encoding format used by persisted keys
- do not change public/private key byte layouts
- do not require a one-time DB migration for existing app installs

### 2. Wire Format Must Remain Compatible

The app exchanges identity keys, signed prekeys, one-time prekeys, and sender keys with other devices and server APIs. Old devices must continue to interoperate.

Relevant file:

- [signal-directory.ts](/Users/qusaieilouti/WebstormProjects/Chat/app/signal-protocol/signal-directory.ts)

Rules:

- do not change payload property names
- do not change base64 payload encoding
- do not change signed prekey signature bytes
- do not change identity key public format
- do not change prekey public format
- do not change sender key JSON shape

### 3. Protocol-Critical Crypto Behavior Must Stay the Same

For this phase, preserve the current asymmetric behavior exactly.

Important detail:

- the current implementation is not just plain WebCrypto-style `Ed25519`
- it uses the existing Curve25519/XEdDSA-style flow from the current curve backend

Relevant files:

- [curve_sigs.c](/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/curve25519-typescript/native/ed25519/additions/curve_sigs.c)
- [curve-wrapper.ts](/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/curve25519-typescript/src/curve-wrapper.ts)
- [internal/curve.ts](/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/libsignal-protocol-typescript/src/internal/curve.ts)

Rules:

- do not replace the current curve/signature behavior with plain native `Ed25519`/`X25519`
- do not change public key version-byte behavior
- do not change verify/sign semantics unless fully wrapped to preserve external behavior

## Current Issues To Fix During Refactor

### Repo / Package Shape

Current problems:

- three separate git repos for one logical library
- old TypeScript and old package layout
- no single release flow
- GitHub package dependencies between the three repos
- CommonJS-only old-style package structure

### Runtime / Crypto Problems

Current problems:

- `msrcrypto` is still referenced and must be removed
- fingerprint hashing still depends on `msrcrypto`
- runtime detection is brittle
- `Chat` currently bootstraps `react-native-quick-crypto`

Relevant files:

- [internal/crypto.ts](/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/libsignal-protocol-typescript/src/internal/crypto.ts)
- [fingerprint-generator.ts](/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/libsignal-protocol-typescript/src/fingerprint-generator.ts)
- [index.js](/Users/qusaieilouti/WebstormProjects/Chat/index.js)

### Import / API Problems

Current problems:

- `Chat` imports the library under `@qusaieilouti99/libsignal-protocol-typescript`
- `Chat` has a deep import into `lib/helpers`
- internal boundaries between curve, proto, and core are package boundaries instead of module boundaries

Relevant files:

- [signal-service.ts](/Users/qusaieilouti/WebstormProjects/Chat/app/signal-protocol/signal-service.ts)
- [signal-storage.ts](/Users/qusaieilouti/WebstormProjects/Chat/app/signal-protocol/signal-storage.ts)
- [pending-message-repository.ts](/Users/qusaieilouti/WebstormProjects/Chat/app/services/low-level-services/database/repositories/pending-message-repository.ts:1)

## Target Outcome

Deliver one package:

- package name: `signal-protocol-ts`
- modern TypeScript package structure
- single repo
- single version
- single test suite
- compatibility preserved for old app installs and older devices

Deliver one `Chat` migration:

- switch imports from old package to `signal-protocol-ts`
- replace old crypto bootstrap with the chosen new runtime bootstrap
- keep all persisted and networked Signal data compatible

## Recommended Package Structure

Use a single package, no workspaces.

Suggested structure:

```text
signal-protocol-ts/
  package.json
  tsconfig.json
  tsconfig.build.json
  README.md
  CHANGELOG.md
  scripts/
  src/
    index.ts
    compat/
    core/
    curve/
    proto/
    runtime/
    test/
  test/
    compatibility/
    integration/
    fixtures/
  dist/
```

Suggested logical module split:

- `src/core`
  - session builder
  - session cipher
  - group cipher
  - helpers
  - types
  - storage-facing serialization logic
- `src/curve`
  - legacy curve backend preserved for compatibility
  - wrapper around current curve implementation
- `src/proto`
  - generated protobuf code
  - compatibility wrappers if needed
- `src/runtime`
  - crypto provider detection
  - web / react-native bootstrap helpers
- `src/compat`
  - old export names or shims if needed

## Naming and Export Requirements

### Package Name

Rename the final published package to:

- `signal-protocol-ts`

### Public API

Preserve the useful current top-level exports where practical:

- `KeyHelper`
- `SessionBuilder`
- `SessionCipher`
- `GroupCipher`
- `SignalProtocolAddress`
- `SignalProtocolGroupAddress`
- `FingerprintGenerator`
- types used by `Chat`

### Imports in `Chat`

Update `Chat` imports from:

- `@qusaieilouti99/libsignal-protocol-typescript`

to:

- `signal-protocol-ts`

Also remove deep imports like:

- `@qusaieilouti99/libsignal-protocol-typescript/lib/helpers`

If helper APIs are still needed by `Chat`, expose them from a supported public subpath or top-level export.

Do not leave `Chat` relying on internal build output paths.

## Runtime and Polyfill Decisions

### React Native

Use:

- `react-native-nitro-crypto`

Do not keep relying on:

- `msrcrypto`
- `react-native-quick-crypto`

unless there is a concrete blocker discovered during implementation.

### Web

Use:

- built-in `globalThis.crypto`

### Base64 / Buffer

Short-term:

- it is acceptable for `Chat` to continue using `react-native-quick-base64` for app-level storage/network encoding if that keeps compatibility simple

Library goal for this phase:

- remove unnecessary runtime dependency on `Buffer`, `atob`, and `btoa` from the core happy path if possible
- but do not break wire compatibility to do so

### TextEncoder / TextDecoder

Do not make these a hard core-library dependency unless truly needed.

## Protocol and Serialization Constraints

The new package may be reorganized internally, but these must remain stable:

- session record serialization
- session archive behavior
- identity key trust checks
- signed prekey verification flow
- public key version-byte handling
- one-time prekey generation behavior
- sender key payload format

Relevant files to preserve behavior from:

- [session-record.ts](/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/libsignal-protocol-typescript/src/session-record.ts)
- [session-builder.ts](/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/libsignal-protocol-typescript/src/session-builder.ts)
- [session-cipher.ts](/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/libsignal-protocol-typescript/src/session-cipher.ts)
- [group-cipher.ts](/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/libsignal-protocol-typescript/src/group-cipher.ts)
- [internal/curve.ts](/Users/qusaieilouti/WebstormProjects/signal-protocol-ts/libsignal-protocol-typescript/src/internal/curve.ts)

## Required Implementation Phases

### Phase 1. Consolidate Code Without Behavior Changes

Steps:

1. create the new single-package repo structure
2. move code from the three repos into internal modules
3. replace package-to-package imports with internal imports
4. keep runtime behavior unchanged as much as possible
5. keep current tests passing

Acceptance:

- code builds from one package
- no GitHub package dependencies remain between the former subprojects
- all existing tests are wired into the unified project

### Phase 2. Modernize the Package Surface

Steps:

1. upgrade TypeScript to a modern version
2. add modern `exports`
3. produce clean build outputs
4. remove legacy package assumptions
5. expose a stable public API for consumers

Acceptance:

- package is installable as `signal-protocol-ts`
- `Chat` can import it without deep internal paths

### Phase 3. Remove `msrcrypto`

Steps:

1. remove the React Native `msrcrypto` fallback in the library
2. route fingerprint hashing through the active crypto provider
3. use injected WebCrypto/Nitro-backed crypto instead

Acceptance:

- no runtime import of `msrcrypto`
- no code path depends on bundled legacy JS crypto

### Phase 4. Add Compatibility Fixtures

Before changing `Chat`, create fixtures from the current implementation for:

- identity keypairs
- prekeys
- signed prekeys
- signed prekey signatures
- serialized session records
- key bundles
- sender key payloads
- encrypted/decrypted message vectors

Acceptance:

- new package can read old fixtures
- new package emits payloads matching old fixtures where required

### Phase 5. Update `Chat`

Steps:

1. switch dependency to `signal-protocol-ts`
2. update imports
3. remove deep imports from internal build paths
4. replace `react-native-quick-crypto` bootstrap with Nitro bootstrap
5. keep storage and payload formatting the same

Acceptance:

- `Chat` builds and boots
- existing local Signal state remains usable
- old devices still interoperate with the updated app

## `Chat`-Specific Requirements

### Current Usage

Important files:

- [package.json](/Users/qusaieilouti/WebstormProjects/Chat/package.json)
- [index.js](/Users/qusaieilouti/WebstormProjects/Chat/index.js)
- [signal-service.ts](/Users/qusaieilouti/WebstormProjects/Chat/app/signal-protocol/signal-service.ts)
- [signal-storage.ts](/Users/qusaieilouti/WebstormProjects/Chat/app/signal-protocol/signal-storage.ts)
- [signal-directory.ts](/Users/qusaieilouti/WebstormProjects/Chat/app/signal-protocol/signal-directory.ts)

Current `Chat` facts:

- it installs `react-native-quick-crypto`
- it calls `install()` from `react-native-quick-crypto` in app bootstrap
- it depends on `@qusaieilouti99/libsignal-protocol-typescript`
- it stores Signal material in MMKV
- it serializes keys to base64 using `react-native-quick-base64`

### Migration Rules for `Chat`

Required:

- keep persisted keys readable
- keep persisted sessions readable
- keep local sender keys readable
- keep server payloads compatible
- keep inter-device messaging compatible

Allowed:

- changing import paths
- changing package name
- changing bootstrap library from Quick Crypto to Nitro
- changing internal helper imports to supported exports

Not allowed:

- silently changing storage keys
- silently changing serialization format
- forcing session resets for existing users
- forcing all users to re-register keys

## Testing Requirements

### Mandatory Test Categories

1. Unit tests

- existing crypto tests
- existing protobuf tests
- existing session tests
- existing group tests

2. Compatibility tests

- old serialized session record can be loaded by new library
- old signed prekey signature verifies under new library
- old key bundle deserializes identically
- sender key JSON/base64 format is unchanged

3. Cross-version tests

- encrypt with old implementation, decrypt with new
- encrypt with new implementation, decrypt with old
- verify signed prekey created by old with new
- verify signed prekey created by new with old

4. `Chat` integration tests or smoke tests

- existing MMKV data remains readable
- session creation still works
- message encryption/decryption still works
- group sender key flow still works

### Suggested Fixtures To Capture Before Refactor

Capture from current implementation:

- registration bundle examples
- identity keypair example
- signed prekey example
- one-time prekey examples
- session store string examples
- sender key examples
- encrypted message examples

Store them under:

```text
test/fixtures/
```

## Build and Tooling Requirements

Recommended:

- TypeScript 5.x
- modern linting/formatting
- one root `package.json`
- one root test command
- one root build command

Suggested package features:

- `exports`
- `types`
- ESM + CJS output if needed for compatibility
- no unsupported deep-import-only APIs

## Explicit Do / Do Not List

### Do

- merge the three libraries into one package
- rename the package to `signal-protocol-ts`
- modernize internal structure
- preserve protocol-visible bytes
- preserve persisted storage formats
- add compatibility tests before aggressive refactors
- update `Chat` to the new package
- move `Chat` off `react-native-quick-crypto` if Nitro works cleanly

### Do Not

- do not change session serialization
- do not change key encoding format
- do not change signature behavior
- do not switch the asymmetric implementation to plain WebCrypto-only curves
- do not break old devices
- do not require clearing app storage
- do not require re-registering user identity keys
- do not leave `Chat` depending on internal build paths

## Deliverables

Expected deliverables for this phase:

1. new single-package repo `signal-protocol-ts`
2. passing unified test suite
3. compatibility fixture suite
4. updated `Chat` imports and runtime bootstrap
5. successful local validation that existing stored Signal state still works
6. release-ready package and app changes

## Definition of Done

This phase is done only when all of the following are true:

- there is one package named `signal-protocol-ts`
- the three old library repos are no longer needed for normal development
- `Chat` uses the new package
- `Chat` no longer depends on the old library package name
- existing user data remains readable
- older devices can still communicate with updated devices
- session and sender key data remain compatible
- the library no longer depends on `msrcrypto`
- the release is safe to publish without breaking existing conversations

## Final Instruction To Implementer

If there is any conflict between:

- modernization
- cleanup
- API aesthetics
- new crypto approaches

and:

- persisted data compatibility
- wire compatibility
- interoperability with already released devices

then choose compatibility first.

The correct mindset for this phase is:

**same bytes, better package, better runtime, better tests**

not:

**new protocol behavior**
