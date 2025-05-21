import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  newMockEvent,
  createMockedFunction
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
} from "../generated/ChatterPayFactory/ChatterPayFactory"
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

  test("ProxyCreated event handled correctly", () => {
    // Setup test data
    let proxyAddress = Address.fromString("0x0000000000000000000000000000000000000001")
    let owner = Address.fromString("0x0000000000000000000000000000000000000002")
    
    // Create and handle event
    let event = createProxyCreatedEvent(proxyAddress, owner)
    handleProxyCreated(event)

    // Assertions
    assert.entityCount("ProxyCreated", 1)
    assert.entityCount("ChatterPayAccount", 1)

    let proxyCreated = ProxyCreated.load(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    assert.assertNotNull(proxyCreated)
    assert.bytesEquals(proxyCreated!.proxy, Bytes.fromHexString(proxyAddress.toHexString()))

    let account = ChatterPayAccount.load(
      Bytes.fromHexString(proxyAddress.toHexString())
    )
    assert.assertNotNull(account)
    assert.bytesEquals(account!.owner, Bytes.fromHexString(owner.toHexString()))
  })

  test("NewImplementation event handled correctly", () => {
    // Setup test data
    let implementation = Address.fromString("0x0000000000000000000000000000000000000003")
    
    // Create and handle event
    let event = createNewImplementationEvent(implementation)
    handleNewImplementation(event)

    // Assertions
    assert.entityCount("NewImplementation", 1)

    let newImplementation = NewImplementation.load(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    assert.assertNotNull(newImplementation)
    assert.bytesEquals(
      newImplementation!.implementation,
      Bytes.fromHexString("0x0000000000000000000000000000000000000003")
    )
  })

  test("DefaultTokensUpdated event handled correctly", () => {
    // Setup test data
    let tokens = [Address.fromString("0x0000000000000000000000000000000000000004")]
    let priceFeeds = [Address.fromString("0x0000000000000000000000000000000000000005")]
    
    // Create and handle event
    let event = createDefaultTokensUpdatedEvent(tokens, priceFeeds)
    handleDefaultTokensUpdated(event)

    // Assertions
    assert.entityCount("DefaultTokensUpdated", 1)

    let defaultTokensUpdated = DefaultTokensUpdated.load(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    assert.assertNotNull(defaultTokensUpdated)
    assert.i32Equals(defaultTokensUpdated!.oldTokens.length, 1)
    assert.i32Equals(defaultTokensUpdated!.newTokens.length, 1)
    assert.bytesEquals(
      defaultTokensUpdated!.oldTokens[0],
      Bytes.fromHexString("0x0000000000000000000000000000000000000004")
    )
    assert.bytesEquals(
      defaultTokensUpdated!.newTokens[0],
      Bytes.fromHexString("0x0000000000000000000000000000000000000005")
    )
  })
})

// Helper functions to create test events
function createProxyCreatedEvent(
  proxyAddress: Address,
  owner: Address
): ProxyCreatedEvent {
  let event = changetype<ProxyCreatedEvent>(newMockEvent())
  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  event.parameters.push(
    new ethereum.EventParam("proxyAddress", ethereum.Value.fromAddress(proxyAddress))
  )
  return event
}

function createNewImplementationEvent(
  implementation: Address
): NewImplementationEvent {
  let event = changetype<NewImplementationEvent>(newMockEvent())
  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam(
      "_walletImplementation",
      ethereum.Value.fromAddress(implementation)
    )
  )
  return event
}

function createDefaultTokensUpdatedEvent(
  tokens: Address[],
  priceFeeds: Address[]
): DefaultTokensUpdatedEvent {
  let event = changetype<DefaultTokensUpdatedEvent>(newMockEvent())
  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  )
  event.parameters.push(
    new ethereum.EventParam("priceFeeds", ethereum.Value.fromAddressArray(priceFeeds))
  )
  return event
} 