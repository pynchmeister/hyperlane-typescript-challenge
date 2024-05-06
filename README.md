# Hyperlane Messaging CLI

This CLI tool allows users to send and query messages using the Hyperlane messaging protocol.

## Installation

To install the Hyperlane Messaging CLI, follow these steps:

1. Clone the repository to your local machine:

```shell
git clone https://github.com/pynchmeister/hyperlane-typescript-challenge.git
````

2. Navigate to the project directory:

```shell
cd hyperlane-messaging-cli
```

3. Install dependencies

```shell
npm install
```


4. Compile the Typescript file into Javascript:

```shell
npm run build
```

## Usage

### Sending a Message

To send a message, use the following command:

```shell
node dist/hyperlane-cli.js send --origin-chain <origin-chain> --rpc-url <rpc-url> --destination <destination> --message <message>```
```

Replace `<origin-chain>`, `<rpc-url>`, `<destination>`, and `<message>` with the appropriate values.

### Searching for Messages

To search for messages, use the following command:

```shell
node dist/hyperlane-cli.js search --origin-chain <origin-chain>
```

Replace <origin-chain> with the chain from which you want to search for messages.

## Testing

To test the application, you can run the provided unit tests:

```shell
npm test
```


## Example
```shell
npx tsx src/hyperlane-cli.ts send --origin-chain Ethereum --rpc-url https://mainnet.infura.io/v3/2KA4tLp4l5GmgGWRU07aeNwLkcJ --destination 0x1234567890123456789012345678901234567890 --message Hello, Hyperlane!
```
