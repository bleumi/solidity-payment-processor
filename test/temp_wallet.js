/* globals artifacts, web3, expect, contract, assert */

const BigNumber = require('bignumber.js').BigNumber
const Token = artifacts.require('Token')
const TempWallet = artifacts.require('TempWallet')

BigNumber.config({
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
    EXPONENTIAL_AT: 1e9
})

let logGas = function (name, r) {
    console.log(`${name} - gas - ${r.receipt.gasUsed}`)
}

contract('TempWallet', (accounts) => {
    let netId

    it('should init', async () => {
        netId = (await web3.eth.net.getId()).toString()

        let TokenI = await Token.deployed()

        await web3.eth.sendTransaction({
            from: accounts[0],
            to: TokenI.address,
            value: 0
        })
    })

    it('should settle', async () => {
        const TokenI = await Token.deployed()
        const W = await TempWallet.deployed()

        await TokenI.transfer(W.address, 10, { from: accounts[0] })
        let r = await W.settle(TokenI.address, { from: accounts[0] })
        logGas('settle erc20', r)

        let acc1Bal = await TokenI.balanceOf(accounts[1])

        assert.equal(acc1Bal, 10)

        acc1Bal = new BigNumber(await web3.eth.getBalance(accounts[1]))

        await web3.eth.sendTransaction({
            from: accounts[0],
            to: W.address,
            value: 100000000
        })

        r = await W.settleETH({ from: accounts[0] })
        logGas('settle eth', r)

        let _acc1Bal = await web3.eth.getBalance(accounts[1])

        assert.equal(_acc1Bal, acc1Bal.plus(100000000).toString())
    })

    it('should refund', async () => {
        const TokenI = await Token.deployed()
        const W = await TempWallet.deployed()

        await TokenI.transfer(W.address, 10, { from: accounts[0] })
        let r = await W.refund(TokenI.address, { from: accounts[0] })
        logGas('refund erc20', r)

        let acc2Bal = await TokenI.balanceOf(accounts[2])

        assert.equal(acc2Bal, 10)

        acc2Bal = new BigNumber(await web3.eth.getBalance(accounts[2]))

        await web3.eth.sendTransaction({
            from: accounts[0],
            to: W.address,
            value: 100000000
        })

        r = await W.refundETH({ from: accounts[0] })
        logGas('refund eth', r)

        let _acc2Bal = await web3.eth.getBalance(accounts[2])

        assert.equal(_acc2Bal, acc2Bal.plus(100000000).toString())
    })
})
