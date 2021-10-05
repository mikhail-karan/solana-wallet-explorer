import * as BufferLayout from 'buffer-layout';
import {PublicKey} from '@solana/web3.js';
import {str, vec} from '@project-serum/borsh'
import { ParamDesc, AssetInfo } from "@project-serum/pool";

export const publicKey = property => {
  return BufferLayout.blob(32, property);
};

export const uint64 = property => {
  return BufferLayout.blob(8, property);
};

export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
]);

export const SWAP_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  BufferLayout.u8("nonce"),
  BufferLayout.blob(32, "tokenProgramId"),
  BufferLayout.blob(32, "tokenAccountA"),
  BufferLayout.blob(32, "tokenAccountB"),
  BufferLayout.blob(32, "tokenPool"),
  BufferLayout.blob(32, "mintA"),
  BufferLayout.blob(32, "mintB"),
  BufferLayout.blob(32, "feeAccount"),
  BufferLayout.u8("curveType"),
  uint64("tradeFeeNumerator"),
  uint64("tradeFeeDenominator"),
  uint64("ownerTradeFeeNumerator"),
  uint64("ownerTradeFeeDenominator"),
  uint64("ownerWithdrawFeeNumerator"),
  uint64("ownerWithdrawFeeDenominator"),
  BufferLayout.blob(16, "padding"),
]);

export const POOL_STATE = BufferLayout.struct([
  BufferLayout.blob(32, "poolTokenMint"),
  BufferLayout.blob(32, "vaultSigner"),
  str('name'),
  vec(ParamDesc, 'accountParams'),
  vec(AssetInfo, 'assets')
])

export const parseTokenAccountData = function(data) {
  let { mint, owner, amount } = ACCOUNT_LAYOUT.decode(data);
  return {
    mint: new PublicKey(mint),
    owner: new PublicKey(owner),
    amount,
  };
}

export const parsePoolAccountData = function(data) {
  let {poolTokenMint, vaultSigner, name, accountParams, assets} = POOL_STATE.decode(data)
  return {
    poolTokenMint: poolTokenMint,
    vaultSigner: vaultSigner,
    name: name,
    accountParams,
    assets
  }
}

export const parseSwapAccountData = function(data) {
  return SWAP_LAYOUT.decode(data);
}
