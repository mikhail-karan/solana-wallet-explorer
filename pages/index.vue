<template>
  <div class="container">
    <div>
      <!-- Logo / -->
      <h4 class="subtitle">
        Manage your Solana assets and liabilities in one simple interface
      </h4>
      <br>
      <b-container fluid="md">
        <b-row>
            <b-col>
              <div v-if="!walletPubkey">
                <input type="text"               
                  v-on:keyup.enter="connectWalletFromPubKey" 
                  v-model="manPubKey"            
                />
                &nbsp;&nbsp;
                <button             
                  class="button--green"
                  @click="connectWalletFromPubKey"
                  >
                  Let's Go!
                </button>  

              </div> 
            </b-col>
        </b-row>
        <b-row>
            <b-col class="m-3">
              -- OR --
            </b-col>
        </b-row>
        <b-row>
            <b-col>
              <button
                v-if="!walletPubkey"
                class="button--green"
                @click="connectWallet"
              >
                Connect Wallet
              </button>
            </b-col>
        </b-row>
      </b-container>

      <!--
      <div class="links">
        
        <div v-else>
          Public Key: {{walletPubkey.toBase58()}} <br>
          Balance: {{balance}}
        </div>
        <br>
        <br>

        <NuxtLink to="dashboard" v-if="walletPubkey">
          Go!
        </NuxtLink>        
      </div>
      -->
    </div>
  </div>
</template>

<script>
import { Connection, SystemProgram, Transaction, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import Wallet from '@project-serum/sol-wallet-adapter';
import { mapState } from 'vuex';
export default {  
  data(){
    return {
      //walletPubkey: null,
      balance: '',
      manPubKey: '2HQmxjk3i2y9RBDzw4CtXwMDt2YPDrNZYLdBxJ2ouD5Y'
    }
  },
  computed: {
    walletPubkey() {
      //return new PublicKey(this.$store.getters['publicKey/getPubKey']) || null
      if ( this.$auth.$storage.getState('pubKey') ) {
        return new PublicKey(this.$auth.$storage.getState('pubKey')) 
      } else {
        return null
      }
    }
  },  
  /*
  computed: mapState({
    //walletPubkey: state => new PublicKey(state.publicKey.pubKey) 
     walletPubkey: state => {
        if ( state.publicKey.pubKey ) {
            return new PublicKey(state.publicKey.pubKey) 
        } else {
            return null
        }
    }
  }),
  */
  mounted(){        
        if ( this.walletPubkey ) {
          this.$router.push('dashboard');
          return;
        }
  },
  methods: {

    connectWalletFromPubKey() {

        console.log('pubkey: ' + this.manPubKey);

        const network = clusterApiUrl('mainnet-beta')
        const connection = new Connection(network)
        const _key = new PublicKey(this.manPubKey)
        this.$auth.$storage.setUniversal('pubKey', _key.toBase58());
        connection.getBalance(_key).then(function (balResp) {
            console.log(balResp)
        })

        let self = this;
        connection.getAccountInfo(_key).then(function (accountInfo) {
            //debugger
            console.log('Account Info: ' + accountInfo)
            self.walletPubkey = _key;
            self.$store.commit('publicKey/setKey', _key.toBase58());
            self.$router.push('dashboard')
        })

        /*
       var mintKey = new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt');
        
        var _params = {
          mint: mintKey
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
      let self = this
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
         self.$store.commit('publicKey/setKey', publicKey.toBase58())

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
  font-size: 30px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
  text-align: left;
}

.links {
  padding-top: 15px;
}

input {
  border:1px solid gray;
  min-width:450px;
  padding:5px;
}
</style>
