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

  // Base URI
  string private _baseURI;

  mapping(uint256 => mapping(uint16 => string)) yearToWinner;
  mapping(uint256 => uint16[]) yearsWithWinner;

  event WinnerNameSet(uint256 indexed tokenId, uint16 year, string winnerName);

  constructor() ERC721("Fantasy Football Trophy", "TROPHY") {}

  function mintNFT(address recipient) public returns (uint256) {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _safeMint(recipient, newItemId);

    return newItemId;
  }

  function getWinnerName(uint256 tokenId, uint16 year)
    public
    view
    returns (string memory)
  {
    return yearToWinner[tokenId][year];
  }

  function getYearsWithWinner(uint256 tokenId)
    public
    view
    returns (uint16[] memory)
  {
    return yearsWithWinner[tokenId];
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
      "Trophy: setWinnerName caller is not owner nor approved"
    );

    uint16 year = getYear();

    require(
      keccak256(abi.encodePacked(yearToWinner[tokenId][year])) ==
        keccak256(abi.encodePacked("")),
      "Trophy: Winner has already been set this year"
    );

    yearsWithWinner[tokenId].push(year);
    yearToWinner[tokenId][year] = winnerName;

    emit WinnerNameSet(tokenId, year, winnerName);
  }

  function setBaseURI(string memory baseURI) public onlyOwner {
    _setBaseURI(baseURI);
  }

  function getYear() public view returns (uint16) {
    return uint16(BokkyPooBahsDateTimeLibrary.getYear(block.timestamp));
  }
}
