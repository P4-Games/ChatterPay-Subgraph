# The Graph Query Behavior — Development Notes

### Purpose

This note documents the behavior observed when querying the deployed ChatterPay subgraph on **The Graph Studio** endpoint.
It serves as a reference for developers verifying data availability and response consistency between base entities (`ERC20Transfer`, `ERC20Approval`) and derived entities (`ChatterPayTransfer`).

## 1. Query using generic ERC20 entities

When running the following request, data is returned correctly:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer xxx" \
  -d '{"query": "{ erc20Transfers(first: 5) { id token from to } erc20Approvals(first: 5) { id token owner spender } }", "operationName": "Subgraphs", "variables": {}}' \
  https://api.studio.thegraph.com/query/86507/chatterpay-scroll-sepolia/version/latest
```

**Response:**

```json
{
  "data": {
    "erc20Transfers": [
      {
        "id": "0x2a7292a6...02000000",
        "token": "0x776133ea03666b73a8e3fc23f39f90e66360716e",
        "from": "0xae133ebbc8eb4df0ab836519890cff285a386a40",
        "to": "0xe54b48f8caf88a08849dcdde3d3d41cd6d7ab369"
      },
      ...
    ],
    "erc20Approvals": [...]
  }
}
```

This confirms that:

* The subgraph endpoint is healthy and reachable.
* ERC20 base event handlers (`Transfer`, `Approval`) are working and producing data.

## 2. Query using ChatterPay-specific entities

When performing a query targeting the **ChatterPay-specific** entity `chatterPayTransfers`, the response differs:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer xxx" \
  -d '{
    "query": "query getExternalDeposits($lastTimestamp: BigInt!) { chatterPayTransfers(where: { blockTimestamp_gt: $lastTimestamp }, orderBy: blockTimestamp, orderDirection: asc, first: 5) { id from to value token blockNumber blockTimestamp transactionHash } }",
    "variables": { "lastTimestamp": 0 }
  }' \
  https://api.studio.thegraph.com/query/86507/chatterpay-scroll-sepolia/version/latest
```

**Response:**

```json
{
  "data": {
    "chatterPayTransfers": []
  }
}
```


## 3. Observed difference

The query without parameters (`erc20Transfers`) retrieves valid transfer data,
while the query that filters by timestamp and targets `chatterPayTransfers` returns an empty array.

This indicates that the entity exists in the schema but currently holds no records in the indexed dataset.


## 4. Context and interpretation for developers

* The Graph responds successfully (HTTP 200, valid structure), confirming the query syntax and schema match.
* The `chatterPayTransfers` entity is defined but has no stored entries at the time of the query.
* No backend issues are involved; the backend only forwards the GraphQL request.

## 5. Practical verification workflow

To verify or reproduce the behavior:

1. Run both queries from any terminal with `curl`.
2. Confirm `erc20Transfers` returns populated data.
3. Observe that `chatterPayTransfers` returns an empty array until indexing logic populates that entity.
4. Optionally, query other entities (e.g., `proxyCreated`) to confirm which ones are active in the dataset.

### Summary

| Query type   | Entity                             | Returns data | Notes                                 |
| ------------ | ---------------------------------- | ------------ | ------------------------------------- |
| Base query   | `erc20Transfers`, `erc20Approvals` | ✅ Yes        | Generic ERC20 indexing working        |
| Custom query | `chatterPayTransfers`              | ⛔ No         | Entity deployed but not populated yet |
