"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchEvent = void 0;
exports.dispatchEvent = {
    name: 'Dispatch',
    inputs: [
        {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
        },
        {
            indexed: false,
            internalType: 'uint32',
            name: 'destinationDomain',
            type: 'uint32',
        },
        {
            indexed: true,
            internalType: 'bytes32',
            name: 'recipientAddress',
            type: 'bytes32',
        },
        {
            indexed: false,
            internalType: 'bytes',
            name: 'message',
            type: 'bytes',
        },
    ],
    type: 'event'
};
//# sourceMappingURL=mailboxEvents.js.map