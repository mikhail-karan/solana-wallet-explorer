<template>
  <div class="container">
    <div>
      <!-- Logo / -->
      <h1 class="title">
        solana-nuxt
      </h1>
      <div class="links">
        <button
          v-if="!walletPubkey"
          class="button--green"
          @click="connectWallet"
        >
          Connect Wallet
        </button>        
        <div v-else>
          Public Key: {{walletPubkey.toBase58()}} <br>
          Balance: {{balance}}
        </div>
        <br>
        <br>
        <div v-if="!walletPubkey">

          -- OR --
          <br>
          <input type="text"               
            v-on:keyup.enter="connectWalletFromPubKey" 
            v-model="manPubKey"            
            />


          <button             
            class="button--green"
            @click="connectWalletFromPubKey"
            >
            Let's Go!
          </button>  

        </div>``

      </div>
    </div>
  </div>
</template>

<script>
import { Connection, SystemProgram, Transaction, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import Wallet from '@project-serum/sol-wallet-adapter';
export default {
  data(){
    return {
      walletPubkey: null,
      balance: '',
      manPubKey: '2HQmxjk3i2y9RBDzw4CtXwMDt2YPDrNZYLdBxJ2ouD5Y'
    }
  },
  methods: {

    connectWalletFromPubKey() {
        console.log('pubkey: ' + this.manPubKey);

        const network = clusterApiUrl('mainnet-beta')
        const connection = new Connection(network)
        const _key = new PublicKey(this.manPubKey)
        connection.getBalance(_key).then(function (balResp) {
            console.log(balResp)
        })

        connection.getAccountInfo(_key).then(function (accountInfo) {
            //debugger
            console.log('Account Info: ' + accountInfo)
        })


        /*
        var _params = {
          mint: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt'
        };
        connection.getTokenAccountsByOwner(_key, _params).then(function (tokenAccounts) {
            //debugger
            console.log('Token Accounts: ' + tokenAccounts)
        })
        */        

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

input {
  border:1px solid gray;
  margin:20px;
  min-width:450px;
  padding:5px;
}
</style>
