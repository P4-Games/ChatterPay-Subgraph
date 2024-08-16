// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class Execution extends ethereum.Event {
  get params(): Execution__Params {
    return new Execution__Params(this);
  }
}

export class Execution__Params {
  _event: Execution;

  constructor(event: Execution) {
    this._event = event;
  }

  get wallet(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get dest(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get functionData(): Bytes {
    return this._event.parameters[3].value.toBytes();
  }
}

export class Initialized extends ethereum.Event {
  get params(): Initialized__Params {
    return new Initialized__Params(this);
  }
}

export class Initialized__Params {
  _event: Initialized;

  constructor(event: Initialized) {
    this._event = event;
  }

  get version(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class TokenTransfer extends ethereum.Event {
  get params(): TokenTransfer__Params {
    return new TokenTransfer__Params(this);
  }
}

export class TokenTransfer__Params {
  _event: TokenTransfer;

  constructor(event: TokenTransfer) {
    this._event = event;
  }

  get wallet(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get dest(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get fee(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get functionData(): Bytes {
    return this._event.parameters[3].value.toBytes();
  }
}

export class ChatterPay__validateUserOpInputUserOpStruct extends ethereum.Tuple {
  get sender(): Address {
    return this[0].toAddress();
  }

  get nonce(): BigInt {
    return this[1].toBigInt();
  }

  get initCode(): Bytes {
    return this[2].toBytes();
  }

  get callData(): Bytes {
    return this[3].toBytes();
  }

  get accountGasLimits(): Bytes {
    return this[4].toBytes();
  }

  get preVerificationGas(): BigInt {
    return this[5].toBigInt();
  }

  get gasFees(): Bytes {
    return this[6].toBytes();
  }

  get paymasterAndData(): Bytes {
    return this[7].toBytes();
  }

  get signature(): Bytes {
    return this[8].toBytes();
  }
}

export class ChatterPay extends ethereum.SmartContract {
  static bind(address: Address): ChatterPay {
    return new ChatterPay("ChatterPay", address);
  }

  FEE_IN_CENTS(): BigInt {
    let result = super.call("FEE_IN_CENTS", "FEE_IN_CENTS():(uint256)", []);

    return result[0].toBigInt();
  }

  try_FEE_IN_CENTS(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("FEE_IN_CENTS", "FEE_IN_CENTS():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  api3PriceFeed(): Address {
    let result = super.call("api3PriceFeed", "api3PriceFeed():(address)", []);

    return result[0].toAddress();
  }

  try_api3PriceFeed(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "api3PriceFeed",
      "api3PriceFeed():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getEntryPoint(): Address {
    let result = super.call("getEntryPoint", "getEntryPoint():(address)", []);

    return result[0].toAddress();
  }

  try_getEntryPoint(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getEntryPoint",
      "getEntryPoint():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  paymaster(): Address {
    let result = super.call("paymaster", "paymaster():(address)", []);

    return result[0].toAddress();
  }

  try_paymaster(): ethereum.CallResult<Address> {
    let result = super.tryCall("paymaster", "paymaster():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  s_supportedNotStableTokens(param0: BigInt): string {
    let result = super.call(
      "s_supportedNotStableTokens",
      "s_supportedNotStableTokens(uint256):(string)",
      [ethereum.Value.fromUnsignedBigInt(param0)],
    );

    return result[0].toString();
  }

  try_s_supportedNotStableTokens(param0: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall(
      "s_supportedNotStableTokens",
      "s_supportedNotStableTokens(uint256):(string)",
      [ethereum.Value.fromUnsignedBigInt(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  s_supportedStableTokens(param0: BigInt): string {
    let result = super.call(
      "s_supportedStableTokens",
      "s_supportedStableTokens(uint256):(string)",
      [ethereum.Value.fromUnsignedBigInt(param0)],
    );

    return result[0].toString();
  }

  try_s_supportedStableTokens(param0: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall(
      "s_supportedStableTokens",
      "s_supportedStableTokens(uint256):(string)",
      [ethereum.Value.fromUnsignedBigInt(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  validateUserOp(
    userOp: ChatterPay__validateUserOpInputUserOpStruct,
    userOpHash: Bytes,
    missingAccountFunds: BigInt,
  ): BigInt {
    let result = super.call(
      "validateUserOp",
      "validateUserOp((address,uint256,bytes,bytes,bytes32,uint256,bytes32,bytes,bytes),bytes32,uint256):(uint256)",
      [
        ethereum.Value.fromTuple(userOp),
        ethereum.Value.fromFixedBytes(userOpHash),
        ethereum.Value.fromUnsignedBigInt(missingAccountFunds),
      ],
    );

    return result[0].toBigInt();
  }

  try_validateUserOp(
    userOp: ChatterPay__validateUserOpInputUserOpStruct,
    userOpHash: Bytes,
    missingAccountFunds: BigInt,
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "validateUserOp",
      "validateUserOp((address,uint256,bytes,bytes,bytes32,uint256,bytes32,bytes,bytes),bytes32,uint256):(uint256)",
      [
        ethereum.Value.fromTuple(userOp),
        ethereum.Value.fromFixedBytes(userOpHash),
        ethereum.Value.fromUnsignedBigInt(missingAccountFunds),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ExecuteCall extends ethereum.Call {
  get inputs(): ExecuteCall__Inputs {
    return new ExecuteCall__Inputs(this);
  }

  get outputs(): ExecuteCall__Outputs {
    return new ExecuteCall__Outputs(this);
  }
}

export class ExecuteCall__Inputs {
  _call: ExecuteCall;

  constructor(call: ExecuteCall) {
    this._call = call;
  }

  get dest(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get functionData(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class ExecuteCall__Outputs {
  _call: ExecuteCall;

  constructor(call: ExecuteCall) {
    this._call = call;
  }
}

export class ExecuteTokenSwapCall extends ethereum.Call {
  get inputs(): ExecuteTokenSwapCall__Inputs {
    return new ExecuteTokenSwapCall__Inputs(this);
  }

  get outputs(): ExecuteTokenSwapCall__Outputs {
    return new ExecuteTokenSwapCall__Outputs(this);
  }
}

export class ExecuteTokenSwapCall__Inputs {
  _call: ExecuteTokenSwapCall;

  constructor(call: ExecuteTokenSwapCall) {
    this._call = call;
  }

  get dest(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get fee(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get functionData(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class ExecuteTokenSwapCall__Outputs {
  _call: ExecuteTokenSwapCall;

  constructor(call: ExecuteTokenSwapCall) {
    this._call = call;
  }
}

export class ExecuteTokenTransferCall extends ethereum.Call {
  get inputs(): ExecuteTokenTransferCall__Inputs {
    return new ExecuteTokenTransferCall__Inputs(this);
  }

  get outputs(): ExecuteTokenTransferCall__Outputs {
    return new ExecuteTokenTransferCall__Outputs(this);
  }
}

export class ExecuteTokenTransferCall__Inputs {
  _call: ExecuteTokenTransferCall;

  constructor(call: ExecuteTokenTransferCall) {
    this._call = call;
  }

  get dest(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get fee(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get functionData(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class ExecuteTokenTransferCall__Outputs {
  _call: ExecuteTokenTransferCall;

  constructor(call: ExecuteTokenTransferCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _entryPoint(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _newOwner(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _l1Storage(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _l2Storage(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _paymaster(): Address {
    return this._call.inputValues[4].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetPriceFeedAddressCall extends ethereum.Call {
  get inputs(): SetPriceFeedAddressCall__Inputs {
    return new SetPriceFeedAddressCall__Inputs(this);
  }

  get outputs(): SetPriceFeedAddressCall__Outputs {
    return new SetPriceFeedAddressCall__Outputs(this);
  }
}

export class SetPriceFeedAddressCall__Inputs {
  _call: SetPriceFeedAddressCall;

  constructor(call: SetPriceFeedAddressCall) {
    this._call = call;
  }

  get _priceFeed(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetPriceFeedAddressCall__Outputs {
  _call: SetPriceFeedAddressCall;

  constructor(call: SetPriceFeedAddressCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class ValidateUserOpCall extends ethereum.Call {
  get inputs(): ValidateUserOpCall__Inputs {
    return new ValidateUserOpCall__Inputs(this);
  }

  get outputs(): ValidateUserOpCall__Outputs {
    return new ValidateUserOpCall__Outputs(this);
  }
}

export class ValidateUserOpCall__Inputs {
  _call: ValidateUserOpCall;

  constructor(call: ValidateUserOpCall) {
    this._call = call;
  }

  get userOp(): ValidateUserOpCallUserOpStruct {
    return changetype<ValidateUserOpCallUserOpStruct>(
      this._call.inputValues[0].value.toTuple(),
    );
  }

  get userOpHash(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get missingAccountFunds(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class ValidateUserOpCall__Outputs {
  _call: ValidateUserOpCall;

  constructor(call: ValidateUserOpCall) {
    this._call = call;
  }

  get validationData(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class ValidateUserOpCallUserOpStruct extends ethereum.Tuple {
  get sender(): Address {
    return this[0].toAddress();
  }

  get nonce(): BigInt {
    return this[1].toBigInt();
  }

  get initCode(): Bytes {
    return this[2].toBytes();
  }

  get callData(): Bytes {
    return this[3].toBytes();
  }

  get accountGasLimits(): Bytes {
    return this[4].toBytes();
  }

  get preVerificationGas(): BigInt {
    return this[5].toBigInt();
  }

  get gasFees(): Bytes {
    return this[6].toBytes();
  }

  get paymasterAndData(): Bytes {
    return this[7].toBytes();
  }

  get signature(): Bytes {
    return this[8].toBytes();
  }
}
