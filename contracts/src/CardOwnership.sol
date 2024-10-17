pragma solidity ^0.8;

import "./Main.sol";
import "./erc721.sol";
import "./safemath.sol";
import "./CardInstance.sol";

contract CardOwnership is ERC721 {
    using SafeMath for uint256;

    mapping (uint => address) cardApprovals;
    /** _tokenId correspond à global */
    function ownerOf(uint256 _tokenId) public view override returns (address _owner) {
        return Main.cardToOwner[_tokenId];
    }

    function balanceOf(address _owner) public view override returns (uint256 _balance) {
        return Main.ownerCardCount[_owner];
    }

    modifier onlyOwnerOf(uint _cardId){
        require(msg.sender == Main.cardToOwner[_cardId]);
        _;
    }
    function _transfer(address _from, address _to, uint256 _tokenId) public {
        Main.ownerCardCount[_from] = Main.ownerCardCount[_from].sub(1);
        Main.ownerCardCount[_to] = Main.ownerCardCount[_to].add(1);
        Main.cardToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public override onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public override onlyOwnerOf(_tokenId)  {
        cardApprovals[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        require(cardApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}