#!/usr/bin/env node

import { createWalletClient, getContract, http } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import figlet from 'figlet';
import { MailboxABI } from './MailboxABI';
import { publicClient } from './client';
import { dispatchEvent } from './mailboxEvents.js';
import ethers from 'ethers';
const privateKey = '0xcdb5e52887be9b218623c980ac93c1a5f67e6bf135a9f5c9724e03c6daf600b9';
const account = privateKeyToAccount(privateKey);

const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(),
});

const mailboxAddress = '0xc005dc82818d67AF737725bD4bf75435d065D239';
const contract = getContract({
  address: mailboxAddress,
  abi: MailboxABI,
  client: publicClient,
});

const program = new Command();
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
  .requiredOption('--matching-list <value>', 'Matching criteria as JSON')
  .action(searchMessages);

program.parse(process.argv);

const options = program.opts();

async function sendMessage(options: any) {
  try {
    const destinationDomain = options['destination']; // Keep as string if possible
    const recipientAddress = ethers.utils.formatBytes32String(destinationDomain);
    const messageBody = ethers.utils.toUtf8Bytes(options.message);
    const dispatch = await contract.write.dispatch(destinationDomain, recipientAddress, messageBody);
    console.log('Message sent successfully.');
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

async function searchMessages(options: any) {
  const matchingList = JSON.parse(options.matchingList);
  const originChain = options.originChain;

  console.log('Searching messages from:', originChain);
  console.log('Matching criteria:', matchingList);
  const latestBlock = await publicClient.getBlockNumber();
  const startBlock = Math.max(0, Number(latestBlock) - 1000000);
  const chunkSize = 5000; // Define chunk size based on provider limits

  try {
    for (let fromBlock = startBlock; fromBlock < latestBlock; fromBlock += chunkSize) {
      const toBlock = Math.min(fromBlock + chunkSize - 1, latestBlock);

      const logs = await publicClient.getLogs({
        address: mailboxAddress,
        event: dispatchEvent,
        fromBlock: BigInt(fromBlock), // Convert fromBlock to BigInt
        toBlock: BigInt(toBlock)      // Convert toBlock to BigInt
      });
      const filteredLogs = logs.filter(log => {
        const sender = log.topics[1];
        const destinationDomain = log.data.slice(0, 66);
        const recipientAddress = log.data.slice(66, 130);
        const message = log.data.slice(130);

        // Apply matching criteria from MatchingList
        return matchingList.some(item => 
          item.sender === sender &&
          item.destinationDomain === destinationDomain &&
          item.recipientAddress === recipientAddress &&
          item.message === message
        );
      });

      filteredLogs.forEach(log => {
        console.log('Match found:', log);
      });
    }
  } catch (error) {
    console.error('Error searching messages:', error);
  }
}

function listDirContents(filepath: string) {
  try {
    const files = fs.readdirSync(filepath);
    const detailedFiles = files.map((file: string) => {
      const fileDetails = fs.statSync(path.resolve(filepath, file));
      const { size, birthtime } = fileDetails;
      return { filename: file, 'size(KB)': size, created_at: birthtime };
    });
    console.table(detailedFiles);
  } catch (error) {
    console.error('Error occurred while reading the directory!', error);
  }
}

function createDir(filepath: string) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
    console.log('The directory has been created successfully');
  } else {
    console.log('The directory already exists');
  }
}

function createFile(filepath: string) {
  try {
    fs.writeFileSync(filepath, '');
    console.log('An empty file has been created');
  } catch (error) {
    console.error('Error occurred while creating the file!', error);
  }
}

if (options.ls) {
  const filepath = typeof options.ls === 'string' ? options.ls : __dirname;
  listDirContents(filepath);
}

if (options.mkdir) {
  createDir(path.resolve(__dirname, options.mkdir));
}

if (options.touch) {
  createFile(path.resolve(__dirname, options.touch));
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

console.log(figlet.textSync('Hyperlane Messaging CLI', { horizontalLayout: 'full' }));
