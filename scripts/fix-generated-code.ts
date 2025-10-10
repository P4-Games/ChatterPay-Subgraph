import * as fs from "fs"
import * as path from "path"

const targets = [
  path.join("generated", "USDT", "ERC20.ts"),
  path.join("generated", "WETH", "ERC20.ts")
]

for (const file of targets) {
  if (!fs.existsSync(file)) {
    console.warn(`⚠️  File not found: ${file}`)
    continue
  }

  let src = fs.readFileSync(file, "utf8")

  // --- 1. Rename every local declaration "let value = result.value;"
  // and any later references to value[...] in the same function.
  src = src.replace(
    /let value = result\.value;/g,
    "let res = result.value;"
  )
  src = src.replace(
    /return ethereum\.CallResult\.fromValue\(value\[0\]\.toBoolean\(\)\);/g,
    "return ethereum.CallResult.fromValue(res[0].toBoolean());"
  )
  src = src.replace(
    /return ethereum\.CallResult\.fromValue\(value\[0\]\.toBigInt\(\)\);/g,
    "return ethereum.CallResult.fromValue(res[0].toBigInt());"
  )
  src = src.replace(
    /return ethereum\.CallResult\.fromValue\(value\[0\]\.toI32\(\)\);/g,
    "return ethereum.CallResult.fromValue(res[0].toI32());"
  )
  src = src.replace(
    /return ethereum\.CallResult\.fromValue\(value\[0\]\.toString\(\)\);/g,
    "return ethereum.CallResult.fromValue(res[0].toString());"
  )

  // --- 2. Handle decimals() → i32 error: Graph-TS uses i32 not number.
  // Ensure all occurrences use toI32() (already correct, just sanity check)
  // No code change needed unless it used toNumber().

  fs.writeFileSync(file, src)
  console.log(`✅ Fully patched ERC20 duplicates in ${file}`)
}
