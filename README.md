# Solidity Payment Processor

This repository contrains Solidity contracts that can be used by a merchant to accept payments from their customers.

The contracts are to be used to create a unique escrow account (`TempWallet.sol`) for each order. This makes it easy for the merchant to reconcile payents from buyers who use centralized exchanges (e.g., Coinbase, Binance) as such providers often use a common on-chain wallet address for multiple users.

The `Create2Factory.sol` contract allows a merchant to reserve an address for an order without having to deploy a contract on the network. This is made possible thanks to the [CREATE2 EVM OpCode](https://eips.ethereum.org/EIPS/eip-1014). The merchant can deploy the contract only if payment is received for an order.

The escrow contract allows merchants to perform the following functions,
1. Settle - Withdraw the funds from the escrow account
1. Refund - Transfer the funds from the escrow account back to the buyer

## Network Configuration

Configure the desired EVM compatible network in the file `truffle-config.js`. The default configuration uses [INFURA](https://infura.io/) as the Ethereum node, please replace if desired.

The script expects a seed phrase to be set in the environment variable `MNEMONIC`. This account is used to deploy contracts to the network.

## Deployment

Run the following command to deploy the contracts to the specified network

```
$ truffle migrate --network <network>
```

## Sample Payment Flow

**Step 1:** Customer places an order on an eCommerce store and provides their wallet address.

**Step 2:** The eCommerce store assigns a unique order id. A random string of 32 bytes needs to be generated and associated with the order. This value should come from a cryptographically secure pseudorandom number generator as the unique wallet address for the order is devired from this.

The following sample Node.js code uses the `crytpo` module to generate an appropriate salt,
```js
const getSalt = async function () {
    let salt = await crypto.randomBytes(32)
    return '0x' + salt.toString('hex')
}
```

**Step 3:** The eCommerce store will derive a unique escrow address. For ease of use, one may also use the `computeAddress` view function on `Create2Factory.sol`.

**Step 4:** The customer transfers the specified token into the unique escrow for the order.

**Step 5:** The eCommerce store confirms the payment transaction and completes the order. The user is then redirected to the order completed page.
