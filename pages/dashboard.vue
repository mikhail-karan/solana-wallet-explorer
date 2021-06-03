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
        
        <!--
        <b-row v-if="pubKey">
            <span>Wallet Balance: {{this.walletBalance}}</span>
        </b-row>
        -->
        <div class="flex flex-col">
          <div class="flex flex-row my-2" v-for="token in walletTokens" :key="token.id">
            <img class="w-5 mx-2" :src="token.icon" :alt="token.name">
            <div class="mx-2">{{token.name}}</div>
            <div class="mx-2" v-if="token.amount">{{token.amount}} Lamports</div>
          </div>
        </div>
      </b-container>
      


      <!--
      <div>
        <b-card
          title="Its a Beautiful Day"
          img-src="https://picsum.photos/600/300/?image=25"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem;"
          class="mb-2"
        >
          <b-card-text v-if="pubKey">
            Public Key: {{pubKey.toBase58()}}
            <br>
            Wallet Balance: {{this.walletBalance}}
          </b-card-text>

          <b-button href="#" variant="primary">Go somewhere</b-button>
        </b-card>
      </div>
      -->

  </div>

</template>

<script>
import { Connection, SystemProgram, Transaction, clusterApiUrl, PublicKey } from '@solana/web3.js';
//console.log('DB pubkey: ' + this.manPubKey);
import {tokenAccountByOwner, extractMintAccounts} from '../functions/connection'
import { returnToken } from '../functions/tokenList'

import { mapState } from 'vuex'
export default {
  data() {
    return {
      walletBalance: this.walletBalance,
      lamports: this.lamports,
      isExecutable: this.isExecutable,
      walletTokens: []
    };
  },
  computed: mapState({
    pubKey: state => new PublicKey(state.publicKey.pubKey) 
  }),
  async mounted(){
    //console.log(this.pubKey.toBase58());
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