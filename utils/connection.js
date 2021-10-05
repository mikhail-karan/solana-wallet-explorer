import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { parseTokenAccountData, parseSwapAccountData } from './utility'
import Wallet from "@project-serum/sol-wallet-adapter";

export const SOL_PROGRAM_TOKEN = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

export function establishConnection() {
  const network = clusterApiUrl('mainnet-beta')
  const connection = new Connection(network)
  return connection
}

export async function tokenAccountByOwner(_publicKey) {
  const connection = establishConnection()
  const tokenAccounts = await connection.getTokenAccountsByOwner(new PublicKey(_publicKey), {
    programId: SOL_PROGRAM_TOKEN,
  })
  return tokenAccounts.value

}

export async function extractMintAccounts(tokenAccounts) { //pass in token accounts array []
  let mintAccounts = []
  tokenAccounts.forEach(acc => {
    const accountKey = acc.pubkey.toBase58()
    const { mint, owner, amount } = parseTokenAccountData(acc.account.data)
    mintAccounts.push({
      mint,
      owner,
      amount,
      accountKey,
    })
  })
  return mintAccounts
}

export async function extractSwapAccounts(tokenAccounts) { //pass in token accounts array []
  let swapAccounts = []
  tokenAccounts.forEach(acc => {
    const swapAccount = parseSwapAccountData(acc.account.data)
    swapAccounts.push(swapAccount)
  })
  return swapAccounts
}

export async function connectWallet() {
  return new Promise((resolve, reject) => {
    const providerUrl = "https://www.sollet.io";
    let selectedWallet = new Wallet(providerUrl);
    selectedWallet.on("connect", (publicKey) => {
      resolve(publicKey)
    });
    selectedWallet.on("disconnect", () => console.log("Disconnected"));

    selectedWallet.connect();
  })

}

export async function connectWalletFromPubKey(pubKey) {

  console.log("Utils - pubkey: " + pubKey);

  const network = clusterApiUrl("mainnet-beta");
  const connection = new Connection(network);

  let _key = null;
  try {
    _key = new PublicKey(pubKey);
  } catch (error) {
    console.log(error);
    //this.pubKeyError = true;
    return 'ERROR - failed to connect from pubkey';
  }
  const accountInfo = await connection.getAccountInfo(_key).catch((e) => {
    console.log("key doesn`t match");
  });
  console.log("Account Info: " + accountInfo);
  //this.$store.dispatch("setKeyAction", _key.toBase58());
  //this.$router.push("dashboard");
  return _key.toBase58();
}