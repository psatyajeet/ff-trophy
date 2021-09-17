// contracts/Trophy.sol
// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./BokkyPooBahsDateTimeLibrary.sol";

contract Trophy is ERC721, Ownable {
  uint256 private _value;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(string => uint8) hashes;
  mapping(uint256 => mapping(uint16 => string)) yearToWinner;

  event WinnerNameSet(uint256 tokenId, uint16 year, string winnerName);

  constructor() ERC721("Fantasy Football Trophy", "TROPHY") {}

  function mintNFT(
    address recipient,
    string memory hash,
    string memory tokenURI
  ) public onlyOwner returns (uint256) {
    require(hashes[hash] != 1);
    hashes[hash] = 1;

    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _safeMint(recipient, newItemId);
    _setTokenURI(newItemId, tokenURI);

    return newItemId;
  }

  function getWinnerName(uint256 tokenId, uint16 year)
    public
    view
    returns (string memory)
  {
    return yearToWinner[tokenId][year];
  }

  /**
   * @dev Sets winner name for this year on `tokenId`.
   *
   * Requirements:
   *
   * - `tokenId` must exist.
   * - a `winnerName` must not have been set yet this year
   *
   * Emits a {WinnerNameSet} event.
   */
  function setWinnerName(uint256 tokenId, string memory winnerName) public {
    require(
      _isApprovedOrOwner(_msgSender(), tokenId),
      "ERC721: setWinnerName caller is not owner nor approved"
    );

    uint16 year = getYear();

    require(
      keccak256(abi.encodePacked(yearToWinner[tokenId][year])) ==
        keccak256(abi.encodePacked("")),
      "Winner has already been set this year"
    );

    yearToWinner[tokenId][year] = winnerName;

    emit WinnerNameSet(tokenId, year, winnerName);
  }

  function getYear() public view returns (uint16) {
    return uint16(BokkyPooBahsDateTimeLibrary.getYear(block.timestamp));
  }
}
