<template>
  <div>
      <b-container>        
        <b-row v-if="pubKey">
            <b-col>
              <h2>Account Info</h2>
              <br>
              Executable: {{isExecutable}}
              <br>
              Lamports: {{lamports}}
            </b-col>

            <b-col>
              <span>Wallet Balance: {{walletBalance}}</span>
            </b-col>
            
        </b-row>
        
        <div class="flex flex-col">
          <div class="flex flex-row my-2" v-for="token in walletTokens" :key="token.id">
            <img class="w-5 mx-2" :src="token.icon" :alt="token.name">
            <div class="mx-2">{{token.name}}</div>
            <div class="mx-2" v-if="token.amount">{{token.amount}} Lamports</div>
          </div>
        </div>
      </b-container>
  </div>

</template>

<script>
import { Connection, SystemProgram, Transaction, clusterApiUrl, PublicKey } from '@solana/web3.js';
import {tokenAccountByOwner, extractMintAccounts} from '../functions/connection'
import { returnToken } from '../functions/tokenList'

import { mapState } from 'vuex'
export default {
  data() {
    //debugger
    return {
      walletBalance: this.walletBalance,
      lamports: this.lamports,
      isExecutable: this.isExecutable,
      walletTokens: []
    };
  },
  computed: {
    pubKey() {
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
    //pubKey: state => new PublicKey(state.publicKey.pubKey) 
    
    pubKey: function(state) {
      console.log('mapState');
      debugger
      let _key;
      _key = new PublicKey(state.publicKey.pubKey);
      //state = new PublicKey('2HQmxjk3i2y9RBDzw4CtXwMDt2YPDrNZYLdBxJ2ouD5Y');
      return _key;
    }
    
  }),
  */
  async mounted(){
    //console.log(this.pubKey.toBase58());

    //debugger

    if ( !this.pubKey ) {
      this.$router.push('/');
      return;
    }

    let self = this;

    const network = clusterApiUrl('mainnet-beta')
    const connection = new Connection(network)
    
    const walletBalance = ''
    const isExecutable = ''
    const lamports = ''
    
    
    const _key = this.pubKey;
    connection.getBalance(_key).then(function (balResp) {
        console.log(balResp)
        self.walletBalance = balResp;
    })

    
    connection.getAccountInfo(_key).then(function (accountInfo) {
        //debugger
        console.log('Account Info: ' + accountInfo)
        
        self.isExecutable = accountInfo.executable;
        self.lamports = accountInfo.lamports;
        
    })

    const tokenAccounts = await tokenAccountByOwner(_key.toBase58())
    const mintAccounts = await extractMintAccounts(tokenAccounts)
    mintAccounts.forEach(_token => {
      let tokenInfo = returnToken(_token.mint.toBase58())
      self.walletTokens.push({
        icon: tokenInfo.logoURI || null,
        amount: _token.amount,
        name: tokenInfo.name,
        address: tokenInfo.address
      })
    })
    
  },
  ready: function () {
      //debugger
      console.log('dashboard ready...');
  },
  created() {
    //debugger
    console.log('dashboard  created');
  },
  methods:{
    /*
    disconnect() {
      console.log('disconnecting...');
    }
    */
  }
  
}
</script>

<style>

</style>