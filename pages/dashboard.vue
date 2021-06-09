<template>
  <div>
    <b-container>
      <b-row v-if="pubKey">
        <b-col>
          <h2>Solana Account Info</h2>
          <br />
          Executable: {{ isExecutable }}
          <br />
          Solana Balance: {{ solLamports }} Lamports
        </b-col>
      </b-row>

      <div class="flex flex-col">
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
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import {
  tokenAccountByOwner,
  extractMintAccounts,
} from "../functions/connection";
import { returnToken } from "../functions/tokenList";
export default {
  data() {
    return {
      solLamports: 0,
      isExecutable: false,
      walletTokens: [],
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
      //debugger
      console.log("Account Info: " + accountInfo);

      self.isExecutable = accountInfo.executable;
      self.solLamports = accountInfo.lamports;
    });

    //Get mint tokens assosiated with Solana Account
    const tokenAccounts = await tokenAccountByOwner(_key.toBase58());
    const mintAccounts = await extractMintAccounts(tokenAccounts);
    mintAccounts.forEach((_token) => {
      let tokenInfo = returnToken(_token.mint.toBase58());
      self.walletTokens.push({
        icon: tokenInfo.logoURI || null,
        amount: _token.amount,
        name: tokenInfo.name,
        address: tokenInfo.address,
      });
    });
  },
  methods: {},
};
</script>

<style>
</style>