// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/CallRegistry.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock", "MCK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract CallRegistryTest is Test {
    CallRegistry public registry;
    MockERC20 public token;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        registry = new CallRegistry();
        token = new MockERC20();
        
        token.transfer(user1, 1000 * 10**18);
        token.transfer(user2, 1000 * 10**18);
        
        vm.prank(user1);
        token.approve(address(registry), type(uint256).max);
        
        vm.prank(user2);
        token.approve(address(registry), type(uint256).max);
    }

    function testCreateCall() public {
        vm.prank(user1);
        registry.createCall(
            address(token),
            100 * 10**18,
            block.timestamp + 1 days,
            address(0x123),
            bytes32("pair"),
            "ipfs_cid"
        );

        (address creator, address stakeToken, uint256 totalStake,,,,,,,,) = registry.calls(0);
        assertEq(creator, user1);
        assertEq(stakeToken, address(token));
        assertEq(totalStake, 100 * 10**18);
    }

    function testStakeOnCall() public {
        vm.prank(user1);
        registry.createCall(
            address(token),
            100 * 10**18,
            block.timestamp + 1 days,
            address(0x123),
            bytes32("pair"),
            "ipfs_cid"
        );

        vm.prank(user2);
        registry.stakeOnCall(0, 50 * 10**18);

        (,, uint256 totalStake,,,,,,,,) = registry.calls(0);
        assertEq(totalStake, 150 * 10**18);
    }
}
