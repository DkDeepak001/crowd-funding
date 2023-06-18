// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract Funding {

    struct Campaign {
        address owner;
        string title;
        string description;
        uint target;
        uint deadline;
        uint recievedAmount;
        string image;
        address[] donorAddresses;
        uint[] donationAmounts;

    }    

    mapping (uint256 => Campaign) campaigns;

    IERC20 public immutable tokenAddress;

    constructor (IERC20 _tokenAddress){
        tokenAddress =_tokenAddress;
    }

    uint public campaignCount;
    //TODO get all campaing 
    //TODO make this pay using specfing token
    

    function createCampaing(string memory _title,string memory  _descripition,uint _target,string memory image)  external {
        Campaign storage campaign = campaigns[campaignCount];
        
        require(bytes(_title).length > 0, "Title must not be empty");
        require(bytes(_descripition).length > 0, "Description must not be empty");
        require(_target > 0, "Target must be greater than 0");
        require(bytes(image).length > 0, "Image must not be empty");
        require(msg.sender != address(0), "Owner must be a valid address");

        

        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _descripition;
        campaign.target = _target;
        campaign.deadline = block.timestamp + 30 days;
        campaign.image = image;
        campaignCount++;
    }
        
        function getCampaing(uint campaingId) external view returns(Campaign memory){
            return campaigns[campaingId];
        }


    function donate(uint campaignId, uint amount) external {
        require(amount > 0, "Donation amount must be greater than 0");
        require(campaigns[campaignId].deadline >= block.timestamp, "Campaign has been closed");

        // Transfer tokens from the donor to the contract
        require(tokenAddress.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        Campaign storage campaign = campaigns[campaignId];

        campaign.recievedAmount += amount;
        campaign.donorAddresses.push(msg.sender);
        campaign.donationAmounts.push(amount);
    }


}
