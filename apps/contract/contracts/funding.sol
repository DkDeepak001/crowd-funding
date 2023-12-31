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
        
        function getCampaign(uint campaingId) external view returns(Campaign memory){
            return campaigns[campaingId];
        }


    function donate(uint campaignId, uint amount) external payable{
        require(amount > 0, "Donation amount must be greater than 0");
        require(campaigns[campaignId].deadline >= block.timestamp, "Campaign has been closed");
        require(campaigns[campaignId].recievedAmount + amount <= campaigns[campaignId].target, "Campaign target has been reached");

        // Transfer tokens from the donor to the contract
        tokenAddress.allowance(msg.sender, address(this));
        require(tokenAddress.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        Campaign storage campaign = campaigns[campaignId];

        campaign.recievedAmount += amount;
        campaign.donorAddresses.push(msg.sender);
        campaign.donationAmounts.push(amount);
    }

    function withdrawl (uint campaignId) external payable{
        require(campaigns[campaignId].deadline < block.timestamp, "Campaign has not been closed yet");
        require(campaigns[campaignId].owner == msg.sender, "Only the owner can withdraw the funds");
        tokenAddress.allowance(address(this), msg.sender);
        tokenAddress.transfer(msg.sender, campaigns[campaignId].recievedAmount);
    }



}
