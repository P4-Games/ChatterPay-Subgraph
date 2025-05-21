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
import { Address, Bytes, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { 
  ChatterPayTransfer,
  Approval,
  WETHApproval,
  WBTCApproval,
  ChatterPayAccount
} from "../generated/schema"
import { 
  Transfer as TransferEvent,
  Approval as ApprovalEvent
} from "../generated/USDT/USDT"
import { 
  Transfer as WETHTransferEvent,
  Approval as WETHApprovalEvent
} from "../generated/WETH/WETH"
import { 
  Transfer as WBTCTransferEvent,
  Approval as WBTCApprovalEvent
} from "../generated/WBTC/WBTC"
import { 
  handleUSDTTransfer,
  handleWETHTransfer,
  handleWBTCTransfer,
  handleApproval,
  handleWETHApproval,
  handleWBTCApproval
} from "../src/chatterpay"

describe("Token Events", () => {
  beforeAll(() => {
    clearStore()
  })

  afterAll(() => {
    clearStore()
  })

  test("USDT Transfer event handled correctly", () => {
    // Setup test data
    let chatterPayAccount = Address.fromString("0x0000000000000000000000000000000000000003")
    let from = Address.fromString("0x0000000000000000000000000000000000000002")
    let to = Address.fromString("0x0000000000000000000000000000000000000003")
    let value = BigInt.fromI32(1000)

    // Create ChatterPay account
    let account = new ChatterPayAccount(Bytes.fromHexString(chatterPayAccount.toHexString()))
    account.owner = Bytes.fromHexString(from.toHexString())
    account.createdAt = BigInt.fromI32(1234567890)
    account.createdAtBlock = BigInt.fromI32(1)
    account.createdAtTransaction = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000001")
    account.save()

    // Create and handle event
    let event = createTransferEvent(from, to, value)
    handleUSDTTransfer(event)

    // Assertions
    assert.entityCount("ChatterPayTransfer", 1)

    let transfer = ChatterPayTransfer.load(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    assert.assertNotNull(transfer)
    assert.bytesEquals(transfer!.from, Bytes.fromHexString("0x0000000000000000000000000000000000000002"))
    assert.bytesEquals(transfer!.to, Bytes.fromHexString("0x0000000000000000000000000000000000000003"))
    assert.bigIntEquals(transfer!.value, BigInt.fromI32(1000))
  })

  test("WETH Transfer event handled correctly", () => {
    // Setup test data
    let chatterPayAccount = Address.fromString("0x0000000000000000000000000000000000000003")
    let from = Address.fromString("0x0000000000000000000000000000000000000002")
    let to = Address.fromString("0x0000000000000000000000000000000000000003")
    let value = BigInt.fromI32(1000)

    // Create ChatterPay account
    let account = new ChatterPayAccount(Bytes.fromHexString(chatterPayAccount.toHexString()))
    account.owner = Bytes.fromHexString(from.toHexString())
    account.createdAt = BigInt.fromI32(1234567890)
    account.createdAtBlock = BigInt.fromI32(1)
    account.createdAtTransaction = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000001")
    account.save()

    // Create and handle event
    let event = createWETHTransferEvent(from, to, value)
    handleWETHTransfer(event)

    // Assertions
    assert.entityCount("ChatterPayTransfer", 1)

    let transfer = ChatterPayTransfer.load(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    assert.assertNotNull(transfer)
    assert.bytesEquals(transfer!.from, Bytes.fromHexString("0x0000000000000000000000000000000000000002"))
    assert.bytesEquals(transfer!.to, Bytes.fromHexString("0x0000000000000000000000000000000000000003"))
    assert.bigIntEquals(transfer!.value, BigInt.fromI32(1000))
  })

  test("WBTC Transfer event handled correctly", () => {
    // Setup test data
    let chatterPayAccount = Address.fromString("0x0000000000000000000000000000000000000003")
    let from = Address.fromString("0x0000000000000000000000000000000000000002")
    let to = Address.fromString("0x0000000000000000000000000000000000000003")
    let value = BigInt.fromI32(1000)

    // Create ChatterPay account
    let account = new ChatterPayAccount(Bytes.fromHexString(chatterPayAccount.toHexString()))
    account.owner = Bytes.fromHexString(from.toHexString())
    account.createdAt = BigInt.fromI32(1234567890)
    account.createdAtBlock = BigInt.fromI32(1)
    account.createdAtTransaction = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000001")
    account.save()

    // Create and handle event
    let event = createWBTCTransferEvent(from, to, value)
    handleWBTCTransfer(event)

    // Assertions
    assert.entityCount("ChatterPayTransfer", 1)

    let transfer = ChatterPayTransfer.load(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    assert.assertNotNull(transfer)
    assert.bytesEquals(transfer!.from, Bytes.fromHexString("0x0000000000000000000000000000000000000002"))
    assert.bytesEquals(transfer!.to, Bytes.fromHexString("0x0000000000000000000000000000000000000003"))
    assert.bigIntEquals(transfer!.value, BigInt.fromI32(1000))
  })

  test("USDT Approval event handled correctly", () => {
    // Setup test data
    let from = Address.fromString("0x0000000000000000000000000000000000000002")
    let spender = Address.fromString("0x0000000000000000000000000000000000000004")
    let value = BigInt.fromI32(1000)

    // Create and handle event
    let event = createApprovalEvent(from, spender, value)
    handleApproval(event)

    // Assertions
    assert.entityCount("Approval", 1)

    let approval = Approval.load(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    assert.assertNotNull(approval)
    assert.bytesEquals(approval!.owner, Bytes.fromHexString("0x0000000000000000000000000000000000000002"))
    assert.bytesEquals(approval!.spender, Bytes.fromHexString("0x0000000000000000000000000000000000000004"))
    assert.bigIntEquals(approval!.value, BigInt.fromI32(1000))
  })

  test("WETH Approval event handled correctly", () => {
    // Setup test data
    let from = Address.fromString("0x0000000000000000000000000000000000000002")
    let spender = Address.fromString("0x0000000000000000000000000000000000000004")
    let value = BigInt.fromI32(1000)

    // Create and handle event
    let event = createWETHApprovalEvent(from, spender, value)
    handleWETHApproval(event)

    // Assertions
    assert.entityCount("WETHApproval", 1)

    let approval = WETHApproval.load(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    assert.assertNotNull(approval)
    assert.bytesEquals(approval!.owner, Bytes.fromHexString("0x0000000000000000000000000000000000000002"))
    assert.bytesEquals(approval!.spender, Bytes.fromHexString("0x0000000000000000000000000000000000000004"))
    assert.bigIntEquals(approval!.value, BigInt.fromI32(1000))
  })

  test("WBTC Approval event handled correctly", () => {
    // Setup test data
    let from = Address.fromString("0x0000000000000000000000000000000000000002")
    let spender = Address.fromString("0x0000000000000000000000000000000000000004")
    let value = BigInt.fromI32(1000)

    // Create and handle event
    let event = createWBTCApprovalEvent(from, spender, value)
    handleWBTCApproval(event)

    // Assertions
    assert.entityCount("WBTCApproval", 1)

    let approval = WBTCApproval.load(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    assert.assertNotNull(approval)
    assert.bytesEquals(approval!.owner, Bytes.fromHexString("0x0000000000000000000000000000000000000002"))
    assert.bytesEquals(approval!.spender, Bytes.fromHexString("0x0000000000000000000000000000000000000004"))
    assert.bigIntEquals(approval!.value, BigInt.fromI32(1000))
  })
})

// Helper functions to create test events
function createTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): TransferEvent {
  let event = changetype<TransferEvent>(newMockEvent())
  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  event.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  event.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  return event
}

function createWETHTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): WETHTransferEvent {
  let event = changetype<WETHTransferEvent>(newMockEvent())
  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  event.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  event.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  return event
}

function createWBTCTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): WBTCTransferEvent {
  let event = changetype<WBTCTransferEvent>(newMockEvent())
  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  event.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  event.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  return event
}

function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): ApprovalEvent {
  let event = changetype<ApprovalEvent>(newMockEvent())
  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  event.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  event.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  return event
}

function createWETHApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): WETHApprovalEvent {
  let event = changetype<WETHApprovalEvent>(newMockEvent())
  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  event.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  event.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  return event
}

function createWBTCApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): WBTCApprovalEvent {
  let event = changetype<WBTCApprovalEvent>(newMockEvent())
  event.parameters = new Array()
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  event.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  event.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )
  return event
} 