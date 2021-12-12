[solid-webhook-client](README.md) / Exports

# solid-webhook-client

## Table of contents

### Functions

- [subscribe](modules.md#subscribe)
- [unsubscribe](modules.md#unsubscribe)
- [verifyAuthIssuer](modules.md#verifyauthissuer)

## Functions

### subscribe

▸ **subscribe**(`resourceUri`, `webhookTarget`, `options?`): `Promise`<{ `unsubscribeEndpoint`: `string`  }\>

Creates a webhook subscription

#### Parameters

| Name | Type |
| :------ | :------ |
| `resourceUri` | `string` |
| `webhookTarget` | `string` |
| `options?` | `Object` |
| `options.fetch?` | `FetchFunction` |

#### Returns

`Promise`<{ `unsubscribeEndpoint`: `string`  }\>

#### Defined in

[subscribe.ts:11](https://github.com/o-development/solid-webhook-client/blob/0340cba/lib/subscribe.ts#L11)

___

### unsubscribe

▸ **unsubscribe**(`unsubscribeEndpoint`, `options?`): `Promise`<`void`\>

Unsubscribe from a resource

#### Parameters

| Name | Type |
| :------ | :------ |
| `unsubscribeEndpoint` | `string` |
| `options?` | `Object` |
| `options.authenticatedFetch?` | (`input`: `RequestInfo`, `init?`: `RequestInit`) => `Promise`<`Response`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[unsubscribe.ts:6](https://github.com/o-development/solid-webhook-client/blob/0340cba/lib/unsubscribe.ts#L6)

___

### verifyAuthIssuer

▸ **verifyAuthIssuer**(`authHeader?`): `Promise`<`string` \| `undefined`\>

Parses the incoming webhook request

#### Parameters

| Name | Type |
| :------ | :------ |
| `authHeader?` | `string` |

#### Returns

`Promise`<`string` \| `undefined`\>

the issuer if the token is valid, undefined if it is not

#### Defined in

[verifyAuthIssuer.ts:12](https://github.com/o-development/solid-webhook-client/blob/0340cba/lib/verifyAuthIssuer.ts#L12)
