import {
  DefaultTokensUpdated as DefaultTokensUpdatedEvent,
  NewImplementation as NewImplementationEvent,
  ProxyCreated as ProxyCreatedEvent
} from "../generated/ChatterPayFactory/ChatterPayFactory"
import { 
  ChatterPayAccount, 
  ChatterPayTransfer,
  DefaultTokensUpdated,
  NewImplementation,
  ProxyCreated,
  Approval,
  WETHApproval,
  WBTCApproval
} from "../generated/schema"
import { Transfer as TransferEvent, Approval as ApprovalEvent } from "../generated/USDT/USDT"
import { Transfer as WETHTransferEvent, Approval as WETHApprovalEvent } from "../generated/WETH/WETH"
import { Transfer as WBTCTransferEvent, Approval as WBTCApprovalEvent } from "../generated/WBTC/WBTC"
import { Bytes } from "@graphprotocol/graph-ts"

export function handleProxyCreated(event: ProxyCreatedEvent): void {
  let entity = new ProxyCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.proxy = event.params.proxyAddress
  entity.implementation = event.params.owner
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  // Create a ChatterPayAccount entity when a new proxy is created
  let account = new ChatterPayAccount(event.params.proxyAddress)
  account.owner = event.params.owner
  account.createdAt = event.block.timestamp
  account.createdAtBlock = event.block.number
  account.createdAtTransaction = event.transaction.hash
  account.save()
}

export function handleNewImplementation(event: NewImplementationEvent): void {
  let entity = new NewImplementation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params._walletImplementation
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleDefaultTokensUpdated(event: DefaultTokensUpdatedEvent): void {
  let entity = new DefaultTokensUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // Convert Address[] to Bytes[]
  let oldTokens: Bytes[] = []
  for (let i = 0; i < event.params.tokens.length; i++) {
    oldTokens.push(event.params.tokens[i] as Bytes)
  }
  entity.oldTokens = oldTokens

  let newTokens: Bytes[] = []
  for (let i = 0; i < event.params.priceFeeds.length; i++) {
    newTokens.push(event.params.priceFeeds[i] as Bytes)
  }
  entity.newTokens = newTokens

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleUSDTTransfer(event: TransferEvent): void {
  // Check if to is a ChatterPay account and from is NOT a ChatterPay account
  let toAccount = ChatterPayAccount.load(event.params.to)
  let fromAccount = ChatterPayAccount.load(event.params.from)
  
  if (toAccount != null && fromAccount == null) {
    let entity = new ChatterPayTransfer(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
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
  // Check if to is a ChatterPay account and from is NOT a ChatterPay account
  let toAccount = ChatterPayAccount.load(event.params.to)
  let fromAccount = ChatterPayAccount.load(event.params.from)
  
  if (toAccount != null && fromAccount == null) {
    let entity = new ChatterPayTransfer(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
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
  // Check if to is a ChatterPay account and from is NOT a ChatterPay account
  let toAccount = ChatterPayAccount.load(event.params.to)
  let fromAccount = ChatterPayAccount.load(event.params.from)
  
  if (toAccount != null && fromAccount == null) {
    let entity = new ChatterPayTransfer(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
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

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleWETHApproval(event: WETHApprovalEvent): void {
  let entity = new WETHApproval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleWBTCApproval(event: WBTCApprovalEvent): void {
  let entity = new WBTCApproval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
} 