import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
// import { EthereumProvider } from '@walletconnect/ethereum-provider';

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// export const walletClient = createWalletClient({
//   chain: mainnet,
//   transport: custom((window as any).ethereum), // Type assertion here
// });

// eg: WalletConnect
// const provider = await EthereumProvider.init({
//     projectId: "abcd1234",
//     showQrModal: true,
//     chains: [1],
// });

// export const walletClientWC = createWalletClient({
//     chain: mainnet,
//     transport: custom(provider),
// });
