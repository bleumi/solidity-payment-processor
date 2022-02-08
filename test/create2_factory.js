/* global artifacts, contract, web3, assert */

const crypto = require('crypto')
const Create2Factory = artifacts.require('Create2Factory')
const TempWallet = artifacts.require('TempWallet')
const Token = artifacts.require('Token')

let logGas = function (name, r) {
    console.log(`${name} - gas - ${r.receipt.gasUsed}`)
}

let getSalt = async function () {
    let salt = await crypto.randomBytes(32)
    return '0x' + salt.toString('hex')
}

contract('Create2Factory', (accounts) => {
    it('should init', async () => {
        let TokenI = await Token.deployed()

        await web3.eth.sendTransaction({
            from: accounts[0],
            to: TokenI.address,
            value: 0
        })
    })

    it('should deploy eip 1167', async () => {
        let Create2FactoryI = await Create2Factory.deployed()

        let salt = await getSalt()
        let bytes =
            '0x3d602d80600a3d3981f3363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3'
        let bytesHash = web3.utils.keccak256(bytes)

        let r = await Create2FactoryI.deploy(salt, bytes)
        logGas('eip 1167', r)

        let addr = await Create2FactoryI.computeAddress.call(salt, bytesHash, {
            from: accounts[0]
        })

        let bc = await web3.eth.getCode(addr)
        assert.equal(
            bc,
            '0x363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3'
        )
    })

    it('should deploy tempwallet', async () => {
        let TempWalletI = await TempWallet.deployed()
        let Create2FactoryI = await Create2Factory.deployed()

        let salt = await getSalt()

        let args = [
            // Set 0x01 at address 0 (Reentrancy Guard)
            '6000600155',
            // Set merchant as accounts[1] (Constructor Arg 1)
            `73${accounts[1].toLowerCase().substring(2)}600155`,
            // Set buyer as accounts[2] (Constructor Arg 2)
            `73${accounts[2].toLowerCase().substring(2)}600255`
        ].join('')

        // Static 10 is for EIP 1167 (3d60<size>8060563d3981f3)
        let runtimeOffset = (args.length / 2 + 10).toString(16)
        if (runtimeOffset.length === 1) {
            runtimeOffset = '0' + runtimeOffset
        }

        let bytes =
            '0x' +
            [
                args,
                // EIP 1167 with TempWalletI
                `3d602d8060${runtimeOffset}3d3981f3363d3d373d3d3d363d`,
                `73${TempWalletI.address.toLowerCase().substring(2)}`,
                '5af43d82803e903d91602b57fd5bf3'
            ].join('')

        let bytesHash = web3.utils.keccak256(bytes)

        let r = await Create2FactoryI.deploy(salt, bytes)
        logGas('tempwallet', r)

        let addr = await Create2FactoryI.computeAddress.call(salt, bytesHash, {
            from: accounts[0]
        })

        let bc = await web3.eth.getCode(addr)
        assert.equal(
            bc,
            `0x363d3d373d3d3d363d73${TempWalletI.address
                .toLowerCase()
                .substring(2)}5af43d82803e903d91602b57fd5bf3`
        )

        // Check accounts[1] set as merchant
        let _storage1 = await web3.eth.getStorageAt(addr, 1)
        assert.equal(_storage1, accounts[1].toLowerCase())

        // Check accounts[2] set as buyer
        let _storage2 = await web3.eth.getStorageAt(addr, 2)
        assert.equal(_storage2, accounts[2].toLowerCase())
    })
})
