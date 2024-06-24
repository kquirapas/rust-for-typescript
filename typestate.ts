import * as anchor from "@coral-xyz/anchor";
import { TokenStaking } from "../core/types";

// Our Builder Pattern utilizes the Typestate Pattern
// Why Typestate Pattern? Google it ;)

export interface IConfig {
  walletAddress: anchor.web3.PublicKey;
  cluster: string;
  rpc: string;
  confirm: anchor.web3.ConfirmOptions;
  idl: anchor.Idl;
}

export enum BuilderState {
  Empty,
  Ready, // for sending
}

// Transaction Builder Generic Interface
export interface IBuilder<T extends anchor.Idl> {
  //----- DATA ------
  readonly wallet: anchor.Wallet;
  readonly idl: anchor.Idl;
  readonly cluster: anchor.web3.Cluster;
  readonly rpc: string;
  readonly confirmOpts: anchor.web3.ConfirmOptions;
  readonly program: anchor.Program<T>;
  readonly provider: anchor.AnchorProvider;
}
export interface IEmpty {
  readonly state: BuilderState.Empty;
}

export interface IReadyBuilder {
  readonly state: BuilderState.Ready;
  readonly transactionPromise: Promise<anchor.web3.Transaction>;
  // clear tx
  clear: () => void;
  // send tx
  send: () => void;
}

export interface IStakingBuilder extends IBuilder<TokenStaking> {}

export class EmptyStakingBuilder implements IEmpty {
  state: BuilderState.Empty = BuilderState.Empty;
  data: IStakingBuilder;

  constructor(data: IStakingBuilder) {
    this.data = data;
  }

  // instruction: init_stake_pool;
  initialize(): ReadyStakingBuilder {
    const txPromise = this.data.program.methods
      .initializeStakePool()
      .accounts({})
      .signers([])
      .transaction();

    return new ReadyStakingBuilder(this.data, txPromise);
  }

  // instruction: add_reward_pool
  register(): ReadyStakingBuilder {
    const txPromise = this.data.program.methods
      .addRewardPool()
      .accounts({})
      .signers([])
      .transaction();

    return new ReadyStakingBuilder(this.data, txPromise);
  }

  // instruction: deposit
  stake(): ReadyStakingBuilder {
    const txPromise = this.data.program.methods
      .deposit()
      .accounts({})
      .signers([])
      .transaction();

    return new ReadyStakingBuilder(this.data, txPromise);
  }

  // instruction: withdraw
  unstake(): ReadyStakingBuilder {
    const txPromise = this.data.program.methods
      .withdraw()
      .accounts({})
      .signers([])
      .transaction();

    return new ReadyStakingBuilder(this.data, txPromise);
  }
}

export class ReadyStakingBuilder implements IReadyBuilder {
  state: BuilderState.Ready = BuilderState.Ready;
  transactionPromise: Promise<anchor.web3.Transaction>;
  data: IStakingBuilder;

  constructor(data: IStakingBuilder, tx: Promise<anchor.web3.Transaction>) {
    this.data = data;
    this.transactionPromise = tx;
  }

  clear(): EmptyStakingBuilder {
    return new EmptyStakingBuilder(this.data);
  }

  async send(): Promise<void> {
    const tx = await this.transactionPromise;
    await this.data.provider.sendAndConfirm(tx);
  }
}

export function createBuilder(
  wallet: anchor.Wallet,
  cluster: anchor.web3.Cluster,
  idl: TokenStaking,
  rpc: string,
  confirmOpts: anchor.web3.ConfirmOptions,
): EmptyStakingBuilder {
  const connection = new anchor.web3.Connection(rpc);
  const provider = new anchor.AnchorProvider(connection, wallet, confirmOpts);

  return {
    state: BuilderState.Empty,
    data: {
      wallet,
      idl,
      cluster,
      rpc,
      confirmOpts,
      provider,
      program: new anchor.Program<TokenStaking>(idl, provider),
    },
  };
}
