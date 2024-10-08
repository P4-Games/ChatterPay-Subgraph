import {
  Execution as ExecutionEvent
} from "../generated/templates/ChatterPay/ChatterPay"
import { Execution } from "../generated/schema"

export function handleExecution(event: ExecutionEvent): void {
  let entity = new Execution(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.wallet = event.transaction.from
  entity.dest = event.params.dest
  entity.value = event.params.value
  entity.data = event.params.functionData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}