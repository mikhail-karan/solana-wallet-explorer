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
import { Connection, SystemProgram, Transaction, clusterApiUrl, publicKey } from '@solana/web3.js';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import Wallet from '@project-serum/sol-wallet-adapter';
export default {
  data(){
    return {
      walletPubkey: null,
      balance: ''
    }
  },
  methods: {
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
        connection.getProgramAccounts(publicKey).then(res => {
          console.log('Program info: ', res)
        }) 
         console.log('Connected to ' + publicKey.toBase58())
         console.log(selectedWallet)

         
      });
      selectedWallet.on('disconnect', () => console.log('Disconnected'));
      new TokenListProvider().resolve().then(tokens => {
        const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();
        console.log('Token List: ', tokenList)
      })
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
