/* global artifacts, contract, web3 */

const Token = artifacts.require('Token')

let logGas = function (name, r) {
    console.log(`${name} - gas - ${r.receipt.gasUsed}`)
}

contract('Token', accounts => {
    it('should init', async () => {
        let TokenI = await Token.deployed()

        await web3.eth.sendTransaction({
            from: accounts[0],
            to: TokenI.address,
            value: 0
        })
    })

    it('should transfer money', async () => {
        let TokenI = await Token.deployed()

        let r = await TokenI.transfer(accounts[1], 10, { from: accounts[0] })
        logGas('token transfer', r)
    })
})
