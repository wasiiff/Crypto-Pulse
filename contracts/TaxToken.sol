// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TaxToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public owner;
    address public taxReceiver;
    
    uint256 public buyTax; // in basis points (100 = 1%)
    uint256 public sellTax;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bool) public isExcludedFromTax;
    mapping(address => bool) public isPair;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TaxUpdated(uint256 buyTax, uint256 sellTax);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        uint8 _decimals,
        address _owner,
        uint256 _buyTax,
        uint256 _sellTax,
        address _taxReceiver
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply * 10**_decimals;
        owner = _owner;
        buyTax = _buyTax;
        sellTax = _sellTax;
        taxReceiver = _taxReceiver;
        
        balanceOf[_owner] = totalSupply;
        isExcludedFromTax[_owner] = true;
        isExcludedFromTax[address(this)] = true;
        
        emit Transfer(address(0), _owner, totalSupply);
    }
    
    function transfer(address to, uint256 value) external returns (bool) {
        return _transfer(msg.sender, to, value);
    }
    
    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        allowance[from][msg.sender] -= value;
        return _transfer(from, to, value);
    }
    
    function _transfer(address from, address to, uint256 value) internal returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        
        uint256 taxAmount = 0;
        
        if (!isExcludedFromTax[from] && !isExcludedFromTax[to]) {
            if (isPair[to]) {
                // Selling
                taxAmount = (value * sellTax) / 10000;
            } else if (isPair[from]) {
                // Buying
                taxAmount = (value * buyTax) / 10000;
            }
        }
        
        uint256 amountAfterTax = value - taxAmount;
        
        balanceOf[from] -= value;
        balanceOf[to] += amountAfterTax;
        
        if (taxAmount > 0) {
            balanceOf[taxReceiver] += taxAmount;
            emit Transfer(from, taxReceiver, taxAmount);
        }
        
        emit Transfer(from, to, amountAfterTax);
        return true;
    }
    
    function setPair(address pair, bool status) external onlyOwner {
        isPair[pair] = status;
    }
    
    function excludeFromTax(address account, bool status) external onlyOwner {
        isExcludedFromTax[account] = status;
    }
    
    function updateTax(uint256 _buyTax, uint256 _sellTax) external onlyOwner {
        require(_buyTax <= 1000 && _sellTax <= 1000, "Tax too high");
        buyTax = _buyTax;
        sellTax = _sellTax;
        emit TaxUpdated(_buyTax, _sellTax);
    }
    
    function updateTaxReceiver(address _taxReceiver) external onlyOwner {
        taxReceiver = _taxReceiver;
    }
}
