<template>
  <div>
    <b-container>
      <!--
      <b-row v-if="pubKey">
        <b-col>
          <h2>Solana Account Info</h2>
          <br />
          Executable: {{ isExecutable }}
          <br />
          Solana Balance: {{ solLamports }} Lamports
        </b-col>
      </b-row>
      -->

      <div class="flex flex-col snl-padded">
        <div
          class="flex flex-row my-2"
          v-for="token in walletTokens"
          :key="token.id"
        >
          <img class="w-5 mx-2" :src="token.icon" :alt="token.name" />
          <div class="mx-2">{{ token.name }}</div>
          <div class="mx-2" v-if="token.amount">
            {{ token.amount }} Lamports
          </div>
          <div class="mx-2" v-if="token.price">${{ token.price }}</div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { tokenAccountByOwner, extractMintAccounts } from "../utils/connection";
import { serumMarkets, priceStore } from "../utils/markets.ts";
import { returnToken } from "../utils/tokenList";
export default {
  data() {
    return {
      solLamports: 0,
      isExecutable: false,
      walletTokens: [],
      sol: {}
    };
  },
  computed: {
    pubKey() {
      return this.$store.getters.getPubKey;
    },
  },
  async mounted() {
    if (!this.pubKey) {
      this.$router.push("/");
      return;
    }

    let self = this;

    const network = clusterApiUrl("mainnet-beta");
    const connection = new Connection(network);

    console.log("dashboard Key: ", this.pubKey);

    const _key = new PublicKey(this.pubKey);

    //Get solana Account Info
    connection.getAccountInfo(_key).then(function (accountInfo) {
      console.log("Account Info: " + accountInfo);

      self.isExecutable = accountInfo.executable;
      self.solLamports = accountInfo.lamports;
    });
    console.log('sol balance: ', this.sol)
    //Get mint tokens assosiated with Solana Account
    const tokenAccounts = await tokenAccountByOwner(_key.toBase58());
    const mintAccounts = await extractMintAccounts(tokenAccounts);

    const solTokenInfo = returnToken('SOL')
    const solMarket = serumMarkets['SOL']
    let solToken = {
      icon: solTokenInfo.logoURI || null,
      amount: this.solLamports,
      name: 'SOL',
      address: solTokenInfo.address,
      symbol: solTokenInfo.symbol,
      marketName: solMarket?.name || null,
      decimals: solTokenInfo.decimals,
      price: null
    }
    this.walletTokens.push(solToken)
    priceStore.getPrice(solMarket.name)
    .then((returnPrice)=> {
      const token = self.walletTokens.find(tok => {
        return tok.marketName === returnPrice.name
      })
      if (token){
        token.price = Math.round(((token.amount/(Math.pow(10,token.decimals)))*returnPrice.price) * 100)/100 
      }
    })
    

    mintAccounts.forEach((_token) => {
      let tokenInfo = returnToken(_token.mint.toBase58());
      const tokenSymbol = tokenInfo.symbol
      let sMarket = serumMarkets[tokenSymbol]
      let price = null
      if (sMarket){
        priceStore.getPrice(sMarket.name)
        .then((returnPrice) => {
          const token = self.walletTokens.find(tok => {
            return tok.marketName === returnPrice.name
          })
          if (token){
            token.price = Math.round(((token.amount/(Math.pow(10,token.decimals)))*returnPrice.price) * 100)/100 
          }
        });
      }

      self.walletTokens.push({
        icon: tokenInfo.logoURI || null,
        amount: _token.amount,
        name: tokenInfo.name,
        address: tokenInfo.address,
        symbol: tokenInfo.symbol,
        marketName: sMarket?.name || null,
        decimals: tokenInfo.decimals,
        price: price,
      });
    });
  },
  methods: {},
};
</script>

<style>
.snl-padded {
    padding: 20px;
    background-color: rgba(4,4,4,0.6);
    border-radius: 5px;
}
</style>