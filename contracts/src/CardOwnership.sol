pragma solidity ^0.8;

import "./CardFactory.sol";
import "./Main.sol";
import "./erc721.sol";
import "./safemath.sol";

contract CardOwnership is CardFactory, ERC721 {
    using SafeMath for uint256;

    mapping (uint => address) cardApprovals;
    /** _tokenId correspond à global */
    function ownerOf(uint256 _tokenId) public view override returns (address _owner) {
        return cardToOwner[_tokenId];
    }

    function balanceOf(address _owner) public view override returns (uint256 _balance) {
        return ownerCardCount[_owner];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) public {
        ownerCardCount[_from] = ownerCardCount[_from].sub(1);
        ownerCardCount[_to] = ownerCardCount[_to].add(1);
        cardToOwner[_tokenId] = _to;
        Transfer(_from, _to, _tokenId);
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