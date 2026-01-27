// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StandardToken.sol";
import "./TaxToken.sol";

contract TokenFactory {
    address public owner;
    address public feeCollector;
    uint256 public launchFee = 0.1 ether;
    uint256 public antiBotFee = 0.02 ether;
    uint256 public taxFeatureFee = 0.02 ether;
    
    struct TokenInfo {
        address tokenAddress;
        address creator;
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 launchedAt;
        bool hasTax;
        bool hasAntiBot;
    }
    
    mapping(address => TokenInfo[]) public userTokens;
    mapping(address => TokenInfo) public tokenDetails;
    TokenInfo[] public allTokens;
    
    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 totalSupply,
        bool hasTax
    );
    
    event FeeCollected(address indexed from, uint256 amount);
    
    constructor(address _feeCollector) {
        owner = msg.sender;
        feeCollector = _feeCollector;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    function createStandardToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimals
    ) external payable returns (address) {
        require(msg.value >= launchFee, "Insufficient launch fee");
        
        StandardToken token = new StandardToken(
            name,
            symbol,
            totalSupply,
            decimals,
            msg.sender
        );
        
        address tokenAddress = address(token);
        
        TokenInfo memory info = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            name: name,
            symbol: symbol,
            totalSupply: totalSupply,
            launchedAt: block.timestamp,
            hasTax: false,
            hasAntiBot: false
        });
        
        userTokens[msg.sender].push(info);
        tokenDetails[tokenAddress] = info;
        allTokens.push(info);
        
        payable(feeCollector).transfer(msg.value);
        
        emit TokenCreated(tokenAddress, msg.sender, name, symbol, totalSupply, false);
        emit FeeCollected(msg.sender, msg.value);
        
        return tokenAddress;
    }
    
    function createTaxToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint8 decimals,
        uint256 buyTax,
        uint256 sellTax,
        address taxReceiver
    ) external payable returns (address) {
        uint256 requiredFee = launchFee + taxFeatureFee;
        require(msg.value >= requiredFee, "Insufficient fee");
        require(buyTax <= 1000 && sellTax <= 1000, "Tax too high"); // Max 10%
        
        TaxToken token = new TaxToken(
            name,
            symbol,
            totalSupply,
            decimals,
            msg.sender,
            buyTax,
            sellTax,
            taxReceiver
        );
        
        address tokenAddress = address(token);
        
        TokenInfo memory info = TokenInfo({
            tokenAddress: tokenAddress,
            creator: msg.sender,
            name: name,
            symbol: symbol,
            totalSupply: totalSupply,
            launchedAt: block.timestamp,
            hasTax: true,
            hasAntiBot: false
        });
        
        userTokens[msg.sender].push(info);
        tokenDetails[tokenAddress] = info;
        allTokens.push(info);
        
        payable(feeCollector).transfer(msg.value);
        
        emit TokenCreated(tokenAddress, msg.sender, name, symbol, totalSupply, true);
        emit FeeCollected(msg.sender, msg.value);
        
        return tokenAddress;
    }
    
    function getUserTokens(address user) external view returns (TokenInfo[] memory) {
        return userTokens[user];
    }
    
    function getAllTokens() external view returns (TokenInfo[] memory) {
        return allTokens;
    }
    
    function getTotalTokensLaunched() external view returns (uint256) {
        return allTokens.length;
    }
    
    function updateLaunchFee(uint256 newFee) external onlyOwner {
        launchFee = newFee;
    }
    
    function updateFeeCollector(address newCollector) external onlyOwner {
        feeCollector = newCollector;
    }
    
    function withdrawStuckFunds() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
