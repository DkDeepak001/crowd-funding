// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


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

    uint public campaignCount;

    function createCampaing(string memory _title,string memory  _descripition,uint _target,string memory image)  external {
        Campaign storage campaign = campaigns[campaignCount];

        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _descripition;
        campaign.target = _target;
        campaign.deadline = block.timestamp + 30 days;
        campaign.image = image;
        campaignCount++;
    }
        
        function getCampaing(uint _campaignCount) external view returns(Campaign memory){
            return campaigns[_campaignCount];
        }
    

}
