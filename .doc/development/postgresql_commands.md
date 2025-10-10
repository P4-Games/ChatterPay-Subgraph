# PostgreSQL Access & Verification (Graph Node)

### 1. Access the Postgres container

If you’re running your **Graph Node stack with Docker Compose**, first list your containers:

```bash
docker ps
```

Look for one named something like `graph-node_postgres_1` or simply `postgres`.

Then connect to it:

```bash
docker exec -it graph-node_postgres_1 psql -U graph-node
```

> ⚠️ Replace `graph-node_postgres_1` with the actual container name from `docker ps`.

---

### 2. List all schemas and find your deployment

Inside the `psql` prompt:

```sql
\dn
```

This lists all schemas.
You’ll see something like:

```
  List of schemas
  Name  |  Owner
 -------+-----------
  public | graph-node
  sgd1   | graph-node
  sgd2   | graph-node
  sgd3   | graph-node
```

Your **latest deployment** is usually the highest `sgdN` (for example, `sgd3`).

---

### 3. List all tables inside the deployment schema

```sql
\dt sgd3.*
```

Example output:

```
 Schema |          Name          | Type  |   Owner
--------+------------------------+-------+------------
 sgd3   | chatter_pay_account    | table | graph-node
 sgd3   | chatter_pay_transfer   | table | graph-node
 sgd3   | erc20_transfer         | table | graph-node
 sgd3   | erc20_approval         | table | graph-node
 sgd3   | proxy_created          | table | graph-node
```

---

### 4. Switch schema context (optional)

```sql
SET search_path TO sgd3;
```

Now you can query tables directly without prefixing `sgd3.` each time.

---

### 5. Check if entities contain data

Run this query to count how many rows each key table has:

```sql
SELECT 'chatter_pay_transfer' AS table, COUNT(*) FROM sgd3.chatter_pay_transfer
UNION ALL
SELECT 'erc20_transfer', COUNT(*) FROM sgd3.erc20_transfer
UNION ALL
SELECT 'proxy_created', COUNT(*) FROM sgd3.proxy_created;
```

**Example output:**

```
        table         | count
----------------------+-------
 chatter_pay_transfer |     0
 erc20_transfer       |    14
 proxy_created        |     0
(3 rows)
```

This means:

* `ERC20Transfer` events have been indexed correctly.
* No `ChatterPayTransfer` or `ProxyCreated` events were emitted yet.

---

### 6. Exit the container

```bash
\q
exit
```

---

### ✅ Summary

| Step                                                       | Command                             | Purpose |
| ---------------------------------------------------------- | ----------------------------------- | ------- |
| `docker exec -it graph-node_postgres_1 psql -U graph-node` | Access the database                 |         |
| `\dn`                                                      | List schemas                        |         |
| `\dt sgd3.*`                                               | List tables in your subgraph schema |         |
| `SELECT COUNT(*)...`                                       | Verify indexed data                 |         |
| `\q`                                                       | Quit `psql`                         |         |

---
