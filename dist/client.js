"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicClient = void 0;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
// import { EthereumProvider } from '@walletconnect/ethereum-provider';
exports.publicClient = (0, viem_1.createPublicClient)({
    chain: chains_1.mainnet,
    transport: (0, viem_1.http)(),
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
//# sourceMappingURL=client.js.map