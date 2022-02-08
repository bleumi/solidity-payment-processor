/* globals artifacts */

const TempWallet = artifacts.require('TempWallet')
const Create2Factory = artifacts.require('Create2Factory')

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(TempWallet, accounts[0], accounts[0], {
        from: accounts[0]
    })

    await deployer.deploy(Create2Factory, {
        from: accounts[0]
    })
}
