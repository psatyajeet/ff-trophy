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
    await this.trophy.setBaseURI("some-base-URI", { from: owner });

    await this.trophy.mintNFT(user1, { from: user1 });

    tokenId = await this.trophy.tokenOfOwnerByIndex(user1, 0);
  });

  it("allows owner to setBaseURI", async function () {
    this.trophy.setBaseURI("another-base-URI", {
      from: owner,
    }),
      expect(await this.trophy.baseURI()).to.be.equal("another-base-URI");
  });

  it("does not allow non owner to setBaseURI", async function () {
    await expectRevert(
      this.trophy.setBaseURI("another-base-URI", {
        from: user1,
      }),
      "Ownable: caller is not the owner"
    );
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

    const yearsWithWinner = await this.trophy.getYearsWithWinner(tokenId);
    expect(yearsWithWinner.length).to.be.equal(2);
    expect(yearsWithWinner[0].toString()).to.equal(year1.toString());
    expect(yearsWithWinner[1].toString()).to.equal(year2.toString());
  });

  it("does not allow different user to setWinnerName", async function () {
    await expectRevert(
      this.trophy.setWinnerName(tokenId, "Knowshon Monero", {
        from: other,
      }),
      "Trophy: setWinnerName caller is not owner nor approved"
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
      "Trophy: Winner has already been set this year"
    );

    expect(await this.trophy.getWinnerName(tokenId, year1)).to.be.equal(
      "Hodl the rock"
    );
  });
});
