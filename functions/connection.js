import { Connection, SystemProgram, Transaction, clusterApiUrl, PublicKey, TokenAccountsFilter } from '@solana/web3.js';
import {parseTokenAccountData} from './utility'

export const SOL_PROGRAM_TOKEN = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

export function establishConnection(){
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

export async function extractMintAccounts(tokenAccounts){ //pass in token accounts array []
  let mintAccounts = []
  tokenAccounts.forEach(acc => {
    const {mint, owner, amount} = parseTokenAccountData(acc.account.data)
    mintAccounts.push({
      mint,
      owner,
      amount
    })
  })
  return mintAccounts
}