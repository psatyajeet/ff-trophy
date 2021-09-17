// test/Trophy.test.js
// Load dependencies
const { expect } = require("chai");
const { accounts, contract } = require("@openzeppelin/test-environment");
const {
  BN,
  expectEvent,
  expectRevert,
  time,
} = require("@openzeppelin/test-helpers");

// Load compiled artifacts
const Trophy = contract.fromArtifact("Trophy");

// Start test block
describe("Trophy", function () {
  // Use large integers ('big numbers')
  const [owner, user1, other] = accounts;
  let tokenId;

  beforeEach(async function () {
    // Deploy a new Trophy contract for each test
    this.trophy = await Trophy.new({ from: owner });

    await this.trophy.mintNFT(
      user1,
      "QmfAvnM89JrqvdhLymbU5sXoAukEJygSLk9cJMBPTyrmxo",
      "ipfs://QmfAvnM89JrqvdhLymbU5sXoAukEJygSLk9cJMBPTyrmxo",
      { from: owner }
    );

    tokenId = await this.trophy.tokenOfOwnerByIndex(user1, 0);
  });

  it("retrieve returns a trophy name previously stored", async function () {
    const year1 = await this.trophy.getYear();
    const receipt = await this.trophy.setWinnerName(tokenId, "Hodl the rock", {
      from: user1,
    });

    expectEvent(receipt, "WinnerNameSet", {
      tokenId,
      year: year1,
      winnerName: "Hodl the rock",
    });

    await time.increase(time.duration.years(1));

    const year2 = await this.trophy.getYear();
    await this.trophy.setWinnerName(tokenId, "Knowshon Monero", {
      from: user1,
    });

    expect(await this.trophy.getWinnerName(tokenId, year1)).to.be.equal(
      "Hodl the rock"
    );
    expect(await this.trophy.getWinnerName(tokenId, year2)).to.be.equal(
      "Knowshon Monero"
    );
  });

  it("does not allow different user to set winner", async function () {
    await expectRevert(
      this.trophy.setWinnerName(tokenId, "Knowshon Monero", {
        from: other,
      }),
      "ERC721: setWinnerName caller is not owner nor approved"
    );
  });

  it("does not allow setting a trophy name multiple times in a year", async function () {
    const year1 = await this.trophy.getYear();
    await this.trophy.setWinnerName(tokenId, "Hodl the rock", {
      from: user1,
    });

    await expectRevert(
      this.trophy.setWinnerName(tokenId, "Knowshon Monero", {
        from: user1,
      }),
      "Winner has already been set this year"
    );

    expect(await this.trophy.getWinnerName(tokenId, year1)).to.be.equal(
      "Hodl the rock"
    );
  });
});