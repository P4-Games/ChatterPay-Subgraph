import {
  ProxyCreated as ProxyCreatedEvent
} from "../generated/ChatterPayWalletFactory/ChatterPayWalletFactory"
import { Wallet } from "../generated/schema"
import { ChatterPay } from "../generated/templates";
import { DataSourceContext } from "@graphprotocol/graph-ts";

export function handleProxyCreated(event: ProxyCreatedEvent): void {
  let entity = new Wallet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  let context = new DataSourceContext()
  context.setString('owner', event.params.owner.toHexString())

  ChatterPay.createWithContext(event.params.proxyAddress, context)

  entity.owner = event.params.owner
  entity.proxyAddress = event.params.proxyAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

// pending: add ownership transfer