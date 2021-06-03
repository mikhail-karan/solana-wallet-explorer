import * as BufferLayout from 'buffer-layout';
import { Connection, SystemProgram, Transaction, clusterApiUrl, PublicKey, TokenAccountsFilter } from '@solana/web3.js';

export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
]);

export const parseTokenAccountData = function(data) {
  let { mint, owner, amount } = ACCOUNT_LAYOUT.decode(data);
  return {
    mint: new PublicKey(mint),
    owner: new PublicKey(owner),
    amount,
  };
}
