#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const accounts_1 = require("viem/accounts");
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const figlet_1 = __importDefault(require("figlet"));
const MailboxABI_1 = require("./MailboxABI");
const client_1 = require("./client");
const mailboxEvents_js_1 = require("./mailboxEvents.js");
const ethers_1 = __importDefault(require("ethers"));
const privateKey = '0xcdb5e52887be9b218623c980ac93c1a5f67e6bf135a9f5c9724e03c6daf600b9';
const account = (0, accounts_1.privateKeyToAccount)(privateKey);
const walletClient = (0, viem_1.createWalletClient)({
    account,
    chain: chains_1.mainnet,
    transport: (0, viem_1.http)(),
});
const mailboxAddress = '0xc005dc82818d67AF737725bD4bf75435d065D239';
const contract = (0, viem_1.getContract)({
    address: mailboxAddress,
    abi: MailboxABI_1.MailboxABI,
    client: client_1.publicClient,
});
const program = new commander_1.Command();
program
    .version('1.0.0')
    .description('An example CLI for managing a directory')
    .option('-l, --ls [value]', 'List directory contents')
    .option('-m, --mkdir <value>', 'Create a directory')
    .option('-t, --touch <value>', 'Create a file')
    .command('send')
    .description('Send a message')
    .requiredOption('--origin-chain <value>', 'Origin chain')
    .requiredOption('--rpc-url <value>', 'RPC URL')
    .requiredOption('--destination <value>', 'Destination address/chain')
    .requiredOption('--message <value>', 'Message bytes')
    .action(sendMessage);
program
    .command('search')
    .description('Search for a message')
    .requiredOption('--origin-chain <value>', 'Origin chain')
    .action(searchMessages);
program.parse(process.argv);
const options = program.opts();
function sendMessage(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const destinationDomain = options['destination']; // Keep as string if possible
            const recipientAddress = ethers_1.default.utils.formatBytes32String(destinationDomain);
            const messageBody = ethers_1.default.utils.toUtf8Bytes(options.message);
            const dispatch = yield contract.write.dispatch(destinationDomain, recipientAddress, messageBody);
            console.log('Message sent successfully.');
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
    });
}
function searchMessages(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Searching messages with options:', options);
            const filter = yield client_1.publicClient.createEventFilter({
                address: mailboxAddress,
                event: mailboxEvents_js_1.dispatchEvent,
            });
            const messageLogs = yield client_1.publicClient.getLogs(filter);
            messageLogs.forEach((log) => {
                const sender = log.topics[1];
                const destinationDomain = log.data.slice(0, 66);
                const recipientAddress = log.data.slice(66, 130);
                const message = log.data.slice(130);
                console.log('Sender:', sender);
                console.log('Destination Domain:', destinationDomain);
                console.log('Recipient Address:', recipientAddress);
                console.log('Message:', message);
            });
            const latestBlock = yield client_1.publicClient.getBlockNumber();
            const startBlock = BigInt(Math.max(0, Number(latestBlock) - 1000000));
            const extendedFilter = Object.assign(Object.assign({}, filter), { fromBlock: startBlock, toBlock: latestBlock });
            const extendedLogs = yield client_1.publicClient.getLogs(extendedFilter);
            extendedLogs.forEach((log) => {
                const sender = log.topics[1];
                const destinationDomain = log.data.slice(0, 66);
                const recipientAddress = log.data.slice(66, 130);
                const message = log.data.slice(130);
                console.log('Sender:', sender);
                console.log('Destination Domain:', destinationDomain);
                console.log('Recipient Address:', recipientAddress);
                console.log('Message:', message);
            });
        }
        catch (error) {
            console.error('Error searching messages:', error);
        }
    });
}
function listDirContents(filepath) {
    try {
        const files = fs_1.default.readdirSync(filepath);
        const detailedFiles = files.map((file) => {
            const fileDetails = fs_1.default.statSync(path_1.default.resolve(filepath, file));
            const { size, birthtime } = fileDetails;
            return { filename: file, 'size(KB)': size, created_at: birthtime };
        });
        console.table(detailedFiles);
    }
    catch (error) {
        console.error('Error occurred while reading the directory!', error);
    }
}
function createDir(filepath) {
    if (!fs_1.default.existsSync(filepath)) {
        fs_1.default.mkdirSync(filepath);
        console.log('The directory has been created successfully');
    }
    else {
        console.log('The directory already exists');
    }
}
function createFile(filepath) {
    try {
        fs_1.default.writeFileSync(filepath, '');
        console.log('An empty file has been created');
    }
    catch (error) {
        console.error('Error occurred while creating the file!', error);
    }
}
if (options.ls) {
    const filepath = typeof options.ls === 'string' ? options.ls : __dirname;
    listDirContents(filepath);
}
if (options.mkdir) {
    createDir(path_1.default.resolve(__dirname, options.mkdir));
}
if (options.touch) {
    createFile(path_1.default.resolve(__dirname, options.touch));
}
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
console.log(figlet_1.default.textSync('Hyperlane Messaging CLI', { horizontalLayout: 'full' }));
//# sourceMappingURL=hyperlane-cli.js.map