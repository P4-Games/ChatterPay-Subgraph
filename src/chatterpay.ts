import {
  DefaultTokensUpdated as DefaultTokensUpdatedEvent,
  NewImplementation as NewImplementationEvent,
  ProxyCreated as ProxyCreatedEvent
} from "../generated/ChatterPayWalletFactory_0/ChatterPayWalletFactory"
import {
  ChatterPayAccount,
  ChatterPayTransfer,
  DefaultTokensUpdated,
  NewImplementation,
  ProxyCreated,
  USDTApproval,
  WETHApproval,
  WBTCApproval,
  SCRApproval,
  USDCApproval,
  wstETHApproval,
  USXApproval,
  StakedUSXApproval,
  USDQApproval
} from "../generated/schema"
import { Transfer as USDTTransferEvent, Approval as USDTApprovalEvent } from "../generated/USDT/ERC20"
import { Transfer as WETHTransferEvent, Approval as WETHApprovalEvent } from "../generated/WETH/ERC20"
import { Transfer as WBTCTransferEvent, Approval as WBTCApprovalEvent } from "../generated/WBTC/ERC20"
import { Transfer as SCRTransferEvent, Approval as SCRApprovalEvent } from "../generated/SCR/ERC20"
import { Transfer as USDCTransferEvent, Approval as USDCApprovalEvent } from "../generated/USDC/ERC20"
import { Transfer as wstETHTransferEvent, Approval as wstETHApprovalEvent } from "../generated/wstETH/ERC20"
import { Transfer as USXTransferEvent, Approval as USXApprovalEvent } from "../generated/USX/ERC20"
import { Transfer as StakedUSXTransferEvent, Approval as StakedUSXApprovalEvent } from "../generated/StakedUSX/ERC20"
import { Transfer as USDQTransferEvent, Approval as USDQApprovalEvent } from "../generated/USDQ/ERC20"
import { Bytes, Address } from "@graphprotocol/graph-ts"

const ZERO_ADDRESS = Address.fromString("0x0000000000000000000000000000000000000000")

export function handleProxyCreated(event: ProxyCreatedEvent): void {
  const entity = new ProxyCreated(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.proxy = event.params.proxyAddress
  entity.owner = event.params.owner
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  const account = new ChatterPayAccount(event.params.proxyAddress)
  account.owner = event.params.owner
  account.createdAt = event.block.timestamp
  account.createdAtBlock = event.block.number
  account.createdAtTransaction = event.transaction.hash
  account.save()
}

export function handleNewImplementation(event: NewImplementationEvent): void {
  const entity = new NewImplementation(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.implementation = event.params._walletImplementation
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleDefaultTokensUpdated(event: DefaultTokensUpdatedEvent): void {
  const entity = new DefaultTokensUpdated(event.transaction.hash.concatI32(event.logIndex.toI32()))

  const tokens: Bytes[] = []
  for (let i = 0; i < event.params.tokens.length; i++) {
    tokens.push(event.params.tokens[i] as Bytes)
  }
  entity.tokens = tokens

  const priceFeeds: Bytes[] = []
  for (let i = 0; i < event.params.priceFeeds.length; i++) {
    priceFeeds.push(event.params.priceFeeds[i] as Bytes)
  }
  entity.priceFeeds = priceFeeds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleUSDTTransfer(event: USDTTransferEvent): void {
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS) return
  const toAccount = ChatterPayAccount.load(event.params.to)
  const fromAccount = ChatterPayAccount.load(event.params.from)

  if (toAccount != null && fromAccount == null) {
    const entity = new ChatterPayTransfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value
    entity.token = event.address
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
}

export function handleWETHTransfer(event: WETHTransferEvent): void {
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS) return
  const toAccount = ChatterPayAccount.load(event.params.to)
  const fromAccount = ChatterPayAccount.load(event.params.from)

  if (toAccount != null && fromAccount == null) {
    const entity = new ChatterPayTransfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value
    entity.token = event.address
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
}

export function handleWBTCTransfer(event: WBTCTransferEvent): void {
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS) return
  const toAccount = ChatterPayAccount.load(event.params.to)
  const fromAccount = ChatterPayAccount.load(event.params.from)

  if (toAccount != null && fromAccount == null) {
    const entity = new ChatterPayTransfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value
    entity.token = event.address
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
}

export function handleSCRTransfer(event: SCRTransferEvent): void {
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS) return
  const toAccount = ChatterPayAccount.load(event.params.to)
  const fromAccount = ChatterPayAccount.load(event.params.from)

  if (toAccount != null && fromAccount == null) {
    const entity = new ChatterPayTransfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value
    entity.token = event.address
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
}

export function handleUSDCTransfer(event: USDCTransferEvent): void {
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS) return
  const toAccount = ChatterPayAccount.load(event.params.to)
  const fromAccount = ChatterPayAccount.load(event.params.from)

  if (toAccount != null && fromAccount == null) {
    const entity = new ChatterPayTransfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value
    entity.token = event.address
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
}

export function handlewstETHTransfer(event: wstETHTransferEvent): void {
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS) return
  const toAccount = ChatterPayAccount.load(event.params.to)
  const fromAccount = ChatterPayAccount.load(event.params.from)

  if (toAccount != null && fromAccount == null) {
    const entity = new ChatterPayTransfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value
    entity.token = event.address
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
}

export function handleUSXTransfer(event: USXTransferEvent): void {
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS) return
  const toAccount = ChatterPayAccount.load(event.params.to)
  const fromAccount = ChatterPayAccount.load(event.params.from)

  if (toAccount != null && fromAccount == null) {
    const entity = new ChatterPayTransfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value
    entity.token = event.address
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
}

export function handleStakedUSXTransfer(event: StakedUSXTransferEvent): void {
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS) return
  const toAccount = ChatterPayAccount.load(event.params.to)
  const fromAccount = ChatterPayAccount.load(event.params.from)

  if (toAccount != null && fromAccount == null) {
    const entity = new ChatterPayTransfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value
    entity.token = event.address
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
}

export function handleUSDQTransfer(event: USDQTransferEvent): void {
  if (event.params.from == ZERO_ADDRESS || event.params.to == ZERO_ADDRESS) return
  const toAccount = ChatterPayAccount.load(event.params.to)
  const fromAccount = ChatterPayAccount.load(event.params.from)

  if (toAccount != null && fromAccount == null) {
    const entity = new ChatterPayTransfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.from = event.params.from
    entity.to = event.params.to
    entity.value = event.params.value
    entity.token = event.address
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
}

export function handleUSDTApproval(event: USDTApprovalEvent): void {
  const entity = new USDTApproval(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleWETHApproval(event: WETHApprovalEvent): void {
  const entity = new WETHApproval(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleWBTCApproval(event: WBTCApprovalEvent): void {
  const entity = new WBTCApproval(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleSCRApproval(event: SCRApprovalEvent): void {
  const entity = new SCRApproval(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleUSDCApproval(event: USDCApprovalEvent): void {
  const entity = new USDCApproval(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handlewstETHApproval(event: wstETHApprovalEvent): void {
  const entity = new wstETHApproval(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleUSXApproval(event: USXApprovalEvent): void {
  const entity = new USXApproval(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleStakedUSXApproval(event: StakedUSXApprovalEvent): void {
  const entity = new StakedUSXApproval(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleUSDQApproval(event: USDQApprovalEvent): void {
  const entity = new USDQApproval(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}
