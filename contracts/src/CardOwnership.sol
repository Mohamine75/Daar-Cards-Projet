pragma solidity ^0.8;

import "./Main.sol";
import "./erc721.sol";
import "./safemath.sol";
import "./CardInstance.sol";

contract CardOwnership is ERC721 {
    using SafeMath for uint256;
    mainContract _mainContract;

    constructor(address _mainAddress) {
        _mainContract = mainContract(_mainAddress);  // Initialise l'instance de Main avec l'adresse du contrat déployé
    }
    mapping (uint => address) cardApprovals;
    /** _tokenId correspond à global */
    function ownerOf(uint256 _tokenId) public view override returns (address _owner) {
        return _mainContract._getCardToOwner(_tokenId);
    }

    function balanceOf(address _owner) public view override returns (uint256 _balance) {
        return _mainContract._getOwnerCardCount(_owner);
    }

    modifier onlyOwnerOf(uint _cardId){
        require(msg.sender == _mainContract._getCardToOwner(_cardId));
        _;
    }
    function _transfer(address _from, address _to, uint256 _tokenId) public {
        _mainContract._setterOwnerCardCount(_from,_mainContract._getOwnerCardCount(_from).sub(1));
        _mainContract._setterOwnerCardCount(_to,_mainContract._getOwnerCardCount(_to).add(1));
        _mainContract._setterCardToOwner(_tokenId,_to);
        emit Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public override onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public override onlyOwnerOf(_tokenId)  {
        cardApprovals[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId);
    }


    function takeOwnership(uint256 _tokenId) public override {
        require(cardApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}