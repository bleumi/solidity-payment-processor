// SPDX-License-Identifier: MIT
// From https://github.com/OpenZeppelin/openzeppelin-contracts/blob/90ed1af972299070f51bf4665a85da56ac4d355e/contracts/utils/Create2.sol

pragma solidity >=0.4.22 <0.9.0;

contract Create2Factory {
    function deploy(bytes32 salt, bytes memory bytecode) public {
        assembly {
            let addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if eq(addr, 0) {
                revert(0x00, 0x00)
            }
        }
    }
    
    function computeAddress(bytes32 salt, bytes32 bytecodeHash) external view returns (address) {
        bytes32 _data = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), salt, bytecodeHash)
        );
        
        return address(uint160(uint256(_data)));
    }
}