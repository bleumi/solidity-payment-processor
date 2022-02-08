/* globals artifacts */

const Token = artifacts.require('Token')

module.exports = function (deployer, network, accounts) {
    if (network !== 'mainnet' && network !== 'rsk') {
        deployer.deploy(Token, 'USD Token', 'USDToken', 18, {
            from: accounts[0]
        })

        deployer.deploy(Token, 'EUR Token', 'EURToken', 18, {
            from: accounts[0]
        })
    }
}
