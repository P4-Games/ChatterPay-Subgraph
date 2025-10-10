import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  newMockEvent
} from "matchstick-as/assembly/index"
import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts"

import {
  ProxyCreated,
  NewImplementation,
  DefaultTokensUpdated,
  ChatterPayAccount
} from "../generated/schema"

import {
  ProxyCreated as ProxyCreatedEvent,
  NewImplementation as NewImplementationEvent,
  DefaultTokensUpdated as DefaultTokensUpdatedEvent
} from "../generated/ChatterPayWalletFactory/ChatterPayWalletFactory"

import {
  handleProxyCreated,
  handleNewImplementation,
  handleDefaultTokensUpdated
} from "../src/chatterpay"

describe("ChatterPay Factory Events", () => {
  beforeAll(() => {
    clearStore()
  })

  afterAll(() => {
    clearStore()
  })

  // ---------------------------------------------------------
  // ProxyCreated
  // ---------------------------------------------------------
  test("ProxyCreated event handled correctly", () => {
    let proxyAddress = Address.fromString("0x0000000000000000000000000000000000000001")
    let owner = Address.fromString("0x0000000000000000000000000000000000000002")

    let event = createProxyCreatedEvent(owner, proxyAddress)
    handleProxyCreated(event)

    assert.entityCount("ProxyCreated", 1)
    assert.entityCount("ChatterPayAccount", 1)

    let id = event.transaction.hash.concatI32(event.logIndex.toI32())
    let proxyCreated = ProxyCreated.load(id)
    assert.assertNotNull(proxyCreated)
    assert.bytesEquals(proxyCreated!.proxy, proxyAddress)

    let account = ChatterPayAccount.load(Bytes.fromHexString(proxyAddress.toHexString()))
    assert.assertNotNull(account)
    assert.bytesEquals(account!.owner, owner)
  })

  // ---------------------------------------------------------
  // NewImplementation
  // ---------------------------------------------------------
  test("NewImplementation event handled correctly", () => {
    let implementation = Address.fromString("0x0000000000000000000000000000000000000003")

    let event = createNewImplementationEvent(implementation)
    handleNewImplementation(event)

    assert.entityCount("NewImplementation", 1)

    let id = event.transaction.hash.concatI32(event.logIndex.toI32())
    let newImplementation = NewImplementation.load(id)
    assert.assertNotNull(newImplementation)
    assert.bytesEquals(newImplementation!.implementation, implementation)
  })

  // ---------------------------------------------------------
  // DefaultTokensUpdated
  // ---------------------------------------------------------
  test("DefaultTokensUpdated event handled correctly", () => {
    let tokens = [Address.fromString("0x0000000000000000000000000000000000000004")]
    let priceFeeds = [Address.fromString("0x0000000000000000000000000000000000000005")]

    let event = createDefaultTokensUpdatedEvent(tokens, priceFeeds)
    handleDefaultTokensUpdated(event)

    assert.entityCount("DefaultTokensUpdated", 1)

    let id = event.transaction.hash.concatI32(event.logIndex.toI32())
    let defaultTokensUpdated = DefaultTokensUpdated.load(id)
    assert.assertNotNull(defaultTokensUpdated)
    assert.i32Equals(defaultTokensUpdated!.tokens.length, 1)
    assert.i32Equals(defaultTokensUpdated!.priceFeeds.length, 1)
    assert.bytesEquals(defaultTokensUpdated!.tokens[0], tokens[0])
    assert.bytesEquals(defaultTokensUpdated!.priceFeeds[0], priceFeeds[0])
  })
})

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

function createProxyCreatedEvent(owner: Address, proxy: Address): ProxyCreatedEvent {
  let mockEvent = newMockEvent()
  mockEvent.address = Address.fromString("0x00000000000000000000000000000000000000aa")

  // @ts-ignore
  let event = changetype<ProxyCreatedEvent>(mockEvent)
  event.parameters = new Array<ethereum.EventParam>()
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  event.parameters.push(
    new ethereum.EventParam("proxyAddress", ethereum.Value.fromAddress(proxy))
  )

  return event
}

function createNewImplementationEvent(implementation: Address): NewImplementationEvent {
  let mockEvent = newMockEvent()

  // @ts-ignore
  let event = changetype<NewImplementationEvent>(mockEvent)
  event.parameters = new Array<ethereum.EventParam>()
  event.parameters.push(
    new ethereum.EventParam("_walletImplementation", ethereum.Value.fromAddress(implementation))
  )

  return event
}

function createDefaultTokensUpdatedEvent(
  tokens: Address[],
  priceFeeds: Address[]
): DefaultTokensUpdatedEvent {
  let mockEvent = newMockEvent()

  // @ts-ignore
  let event = changetype<DefaultTokensUpdatedEvent>(mockEvent)
  event.parameters = new Array<ethereum.EventParam>()
  event.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  )
  event.parameters.push(
    new ethereum.EventParam("priceFeeds", ethereum.Value.fromAddressArray(priceFeeds))
  )

  return event
}
