<template>
  <div>
    <b-container>
      <div>
        <b-row class="mb-3">
          <b-col class="text-left"><h1>Wallet</h1></b-col>
          <b-col class="text-right">${{totalPrice}}</b-col>
        </b-row>

        <b-row class="snl-padded" v-for="token in walletTokens" :key="token.id">
          <b-col
            ><img class="w-5 mx-2" :src="token.icon" :alt="token.name"
          /></b-col>
          <b-col class="text-left">{{ token.symbol }}</b-col>
          <b-col cols="5" class="text-left">{{ token.name }}</b-col>
          <b-col>${{ token.price }}</b-col>
        </b-row>

        <b-row class="my-3">
          <b-col class="text-left"><h1>Staking Positions</h1></b-col>
          <b-col class="text-right">$XYZ.ZZ</b-col>
        </b-row>
        <b-row v-for="pool in walletPools" :key="pool.id" class="snl-padded">
          <b-col
            >{{pool.name}}</b-col>
          <b-col cols="5" class="text-left">{{pool.symbol}}</b-col>
          <b-col>$199.99</b-col>
        </b-row>

      </div>

      <!--
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
      -->
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
      walletPools: [],
      sol: {},
    };
  },
  computed: {
    pubKey() {
      return this.$store.getters.getPubKey;
    },
    totalPrice() {
      let _totalPrice = 0
      this.walletTokens.forEach(token => {
        if (token.price){
          _totalPrice += parseFloat(token.price)
        }
      })
      return _totalPrice.toFixed(2)
    }
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
    console.log("sol balance: ", this.sol);
    //Get mint tokens assosiated with Solana Account
    const tokenAccounts = await tokenAccountByOwner(_key.toBase58());
    const mintAccounts = await extractMintAccounts(tokenAccounts);

    const solTokenInfo = returnToken("SOL");
    const solMarket = serumMarkets["SOL"];
    let solToken = {
      icon: solTokenInfo.logoURI || null,
      amount: this.solLamports,
      name: "SOL",
      address: solTokenInfo.address,
      symbol: solTokenInfo.symbol,
      marketName: solMarket?.name || null,
      decimals: solTokenInfo.decimals,
      price: null,
    };
    this.walletTokens.push(solToken);
    priceStore.getPrice(solMarket.name).then((returnPrice) => {
      const token = self.walletTokens.find((tok) => {
        return tok.marketName === returnPrice.name;
      });
      if (token) {
        token.price =
          (Math.round(
            (token.amount / Math.pow(10, token.decimals)) *
              returnPrice.price *
              100
          ) / 100).toFixed(2);
      }
    });

    mintAccounts.forEach((_token) => {
      let tokenInfo = returnToken(_token.mint.toBase58());
      const tokenSymbol = tokenInfo.symbol;
      let sMarket = serumMarkets[tokenSymbol];
      let price = null;
      if (sMarket) {
        priceStore.getPrice(sMarket.name).then((returnPrice) => {
          const token = self.walletTokens.find((tok) => {
            return tok.marketName === returnPrice.name;
          });
          if (token) {
            token.price =
              (Math.round(
                (token.amount / Math.pow(10, token.decimals)) *
                  returnPrice.price *
                  100
              ) / 100).toFixed(2);
          }
        });
      }
      if (!tokenInfo.symbol.includes('-')){
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
      }
      else {
        self.walletPools.push({
          icon: tokenInfo.logoURI || null,
          amount: _token.amount,
          name: tokenInfo.name,
          address: tokenInfo.address,
          symbol: tokenInfo.symbol,
          marketName: sMarket?.name || null,
          decimals: tokenInfo.decimals,
          price: price,
        })
      }
    });
  },
  methods: {},
};
</script>

<style>
.snl-padded {
  padding: 10px;
  background-color: rgba(4, 4, 4, 0.6);
  border-radius: 5px;
}

#wallet-table {
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
}

#wallet-table td {
  word-wrap: break-word;
  word-break: break-all;
}
</style>