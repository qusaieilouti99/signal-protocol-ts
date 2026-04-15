import { Curve25519Wrapper } from '../curve'
import { Curve } from './curve'

export * from './types'
export * from './signal-protocol-address'
export * from './signal-protocol-group-address'
export * from './key-helper'
export * from './fingerprint-generator'
export * from './session-builder'
export * from './session-cipher'
export * from './session-types'
export * from './curve'
export * from './group-cipher'
export * from './group-session-record'
export * from './helpers'

import * as Internal from './internal'

export { setWebCrypto, setCurve } from './internal'

// returns a promise of something with the shape of the old libsignal
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async () => {
    const cw = await Curve25519Wrapper.create()

    return {
        Curve: new Curve(new Internal.Curve(cw)),
    }
}
