import type { Token } from "@lifi/types";
import type { Address, Chain, Hash } from "viem";
import { _SupportedEVMChainList } from "../edwin-core/wallets/evm_wallet";
import type { Edwin } from "../edwin-client";

export type SupportedEVMChain = (typeof _SupportedEVMChainList)[number];

export type SupportedChain = SupportedEVMChain | 'solana';

// Token types
export interface TokenWithBalance {
    token: Token;
    balance: bigint;
    formattedBalance: string;
    priceUSD: string;
    valueUSD: string;
}

export interface WalletBalance {
    chain: SupportedEVMChain;
    address: Address;
    totalValueUSD: string;
    tokens: TokenWithBalance[];
}

// Chain configuration
export interface ChainMetadata {
    chainId: number;
    name: string;
    chain: Chain;
    rpcUrl: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    blockExplorerUrl: string;
}

export interface EdwinConfig {
    evmPrivateKey?: `0x${string}`;
    solanaPrivateKey?: string;
    actions: string[];
}

// Base interface for all protocol parameters
export interface ActionParams {
    protocol: string;
    chain: SupportedChain;
    amount: string;
    asset: string;
    data?: string;
}

export interface SupplyParams extends ActionParams {}

export interface WithdrawParams extends ActionParams {}

export interface StakeParams extends ActionParams {}

export interface LiquidityParams extends ActionParams {
    assetB: string;
    amountB?: string;
    poolAddress?: string;
}

export interface DeFiProtocol {
    supportedChains: SupportedChain[];
    getPortfolio(): Promise<string>;
}

export interface ILendingProtocol extends DeFiProtocol {
    supply(params: SupplyParams): Promise<string>;
    withdraw(params: WithdrawParams): Promise<string>;
}

export interface IStakingProtocol extends DeFiProtocol {
    stake(params: StakeParams): Promise<string>;
    unstake(params: StakeParams): Promise<string>;
    claimRewards?(params: StakeParams): Promise<string>;
}

export interface IDEXProtocol extends DeFiProtocol {
    swap(params: LiquidityParams): Promise<string>;
    addLiquidity(params: LiquidityParams): Promise<string>;
    removeLiquidity(params: LiquidityParams): Promise<string>;
    getPools?(params: LiquidityParams): Promise<any>;
    getPositions?(params: LiquidityParams): Promise<any>;
}

export interface EdwinAction {
    name: string;
    description: string;
    template: string;
    edwin: Edwin;
    execute: (params: any) => Promise<any>;
    // Future feature: pass input schema to params to enforce correct input
}