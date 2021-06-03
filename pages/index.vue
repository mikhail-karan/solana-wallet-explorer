<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">
        solana-nuxt
      </h1>
      <div class="links">
        <button
          v-if="!walletPubkey"
          class="button--green"
          @click="connectWallet"
        >
          Connect
        </button>
        <div v-else>
          Public Key: {{walletPubkey.toBase58()}} <br>
          Balance: {{balance}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Connection, SystemProgram, Transaction, clusterApiUrl, PublicKey, TokenAccountsFilter } from '@solana/web3.js';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import Wallet from '@project-serum/sol-wallet-adapter';
import * as BufferLayout from 'buffer-layout';
import axios from 'axios'
export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
]);
export default {
  data(){
    return {
      walletPubkey: null,
      balance: '',
      tokenWalletAccounts: []
    }
  },
  methods: {
    parseTokenAccountData(data) {
      let { mint, owner, amount } = ACCOUNT_LAYOUT.decode(data);
      return {
        mint: new PublicKey(mint),
        owner: new PublicKey(owner),
        amount,
      };
    },
    connectWallet(){

      const network = clusterApiUrl('mainnet-beta')
      const providerUrl = 'https://www.sollet.io'
      const connection = new Connection(network)
      let selectedWallet = new Wallet(providerUrl)


      selectedWallet.on('connect', publicKey =>{
        this.walletPubkey = publicKey
        connection.getBalance(publicKey)
        .then(key => {
          this.balance = key
        }
        

        )


        //JSON RPC Test
        // const networkUrl = 'https://api.mainnet-beta.solana.com'
        // axios.post(networkUrl, {
        //   jsonrpc: '2.0',
        //   id: 1,
        //   method: 'getTokenAccountsByOwner',
        //   params: [publicKey.toBase58(),
        //     {
        //       "programId": 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        //       // "mint": "BmLbrYtcWneUY2dYjerwTVoCwVvEbvEBuNqtEz5DRveg"
        //     }
        //   ]
        // })
        // .then(res => {
        //   console.log(res)
        //   debugger
        //   let {mint, owner, amount} = this.parseTokenAccountData(res.data.result.value[0].account.data)
        //   console.log('mint : ', mint) //Array
        // })

        connection.getTokenAccountsByOwner(publicKey, {
          // mint: _pubMint,
          programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        })
        .then(res => {
        console.log(res)
        debugger
        let {mint, owner, amount} = this.parseTokenAccountData(res.value[0].account.data)
        console.log('mint : ', mint.toBase58()) //Array
      })
        
        
    
         console.log('Connected to ' + publicKey.toBase58())
         console.log(selectedWallet)

         new TokenListProvider().resolve().then(tokens => {
        const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();
        console.log('Token List: ', tokenList)
        // tokenList.forEach(token => {
        //   let _pubMint = new PublicKey(token.address)
        //   connection.getTokenAccountsByOwner(publicKey, {
        //     mint: _pubMint
        //   })
        //   .then(res => {
        //     if (res.value && res.value[0].account?.lamports > 0){
        //       this.tokenWalletAccounts.push(res.value[0].account)
        //       console.log(this.tokenWalletAccounts)
        //     }
        //   })
        // })
        

      })

         
      });
      selectedWallet.on('disconnect', () => console.log('Disconnected'));
      
      selectedWallet.connect()
    }
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
