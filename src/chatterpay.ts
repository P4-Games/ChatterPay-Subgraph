import {
  DefaultTokensUpdated as DefaultTokensUpdatedEvent,
  NewImplementation as NewImplementationEvent,
  ProxyCreated as ProxyCreatedEvent
} from "../generated/ChatterPayWalletFactory/ChatterPayWalletFactory"
import {
  ChatterPayAccount,
  ChatterPayTransfer,
  DefaultTokensUpdated,
  NewImplementation,
  ProxyCreated,
  USDTApproval,
  WETHApproval
} from "../generated/schema"
import { Transfer as USDTTransferEvent, Approval as USDTApprovalEvent } from "../generated/USDT/ERC20"
import { Transfer as WETHTransferEvent, Approval as WETHApprovalEvent } from "../generated/WETH/ERC20"
import { Bytes } from "@graphprotocol/graph-ts"

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
