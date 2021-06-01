<template>
  <div>
      Hello Dashboard!!!
        <br>

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
    <b-card-text>
      Public Key: {{pubKey.toBase58()}}
    </b-card-text>

    <b-button href="#" variant="primary">Go somewhere</b-button>
  </b-card>
</div>


  </div>



  
</template>

<script>
import { Connection, SystemProgram, Transaction, clusterApiUrl, PublicKey } from '@solana/web3.js';
//console.log('DB pubkey: ' + this.manPubKey);
import { mapState } from 'vuex'
export default {
  computed: mapState({
    pubKey: state => new PublicKey(state.publicKey.pubKey) 
  })
  
}
</script>

<style>

</style>