import { MARKETS } from '@project-serum/serum';
import { PublicKey } from '@solana/web3.js';
import { MAINNET_URL } from './connection';



export const serumMarkets = (() => {
  let m = {};
  MARKETS.forEach((market) => {
    const coin = market.name.split('/')[0];
    if (m[coin]) {
      // Only override a market if it's not deprecated	.
      if (!m.deprecated) {
        m[coin] = {
          publicKey: market.address,
          name: market.name.split('/').join(''),
        };
      }
    } else {
      m[coin] = {
        publicKey: market.address,
        name: market.name.split('/').join(''),
      };
    }
  });
  return m;
})();
