import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";

// default IDLs
import TOKEN_STAKING_IDL from "../../../programs/token_staking/token_staking.json";
import { TokenStaking } from "../types";

export const DEFAULTS = {
  IDL: {
    TokenStaking: TOKEN_STAKING_IDL as TokenStaking,
  },
  RPC: {
    devnet: anchor.web3.clusterApiUrl("devnet"),
    testnet: anchor.web3.clusterApiUrl("testnet"),
    mainnet: anchor.web3.clusterApiUrl("mainnet-beta"),
  },
  CLUSTER: "devnet" as web3.Cluster,
  CONFIRMATION: { commitment: "confirmed" } as web3.ConfirmOptions,
};
