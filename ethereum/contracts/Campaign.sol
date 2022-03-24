// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address public campaignCreator;
    uint public minimumContribution;
    uint public deadline;
    uint public goal;

    // dynamicaly array that store all the instance of Campaign
    Campaign[] public campaignFactory;

    // add the owner of campaign
    constructor() {
        campaignCreator = msg.sender;              
    }

    function factoryCampaign (uint _min, uint _deadline, uint _goal ) public {
        minimumContribution = _min;
        deadline = block.timestamp + _deadline;
        goal = _goal; 
        // create a varibable of campaign instance
        Campaign newCampaignAddress = new Campaign(minimumContribution, deadline, goal, campaignCreator);
        campaignFactory.push(newCampaignAddress);
    }

    function getDeployedCampaigns() public view returns(Campaign [] memory) {
        return campaignFactory;
    }
}

contract Campaign {
    address public manager;
    uint public minimumContribution;
    uint public goal;
    uint public raisedAmount;
    uint public numberOfContributors;
    uint public deadline; // timestamp
    uint public numRequests;

    // info about spending request 
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint numberOfVoters;
        mapping(address => bool) voters;
    }

    mapping(address => uint) public participants;
    mapping(uint => Request) public requests;

    modifier minContribution() {
        require(msg.value > minimumContribution, "You should enter the min value!");
        _;
    }
    modifier onlyManager() {
        require(manager == msg.sender, "You are not the manager.");
        _;
    }

    modifier deadlinePassed() {
        require(block.timestamp < deadline, "Deadline has passed.");
        _;
    }

    event ContributeEvent(address _sender, uint _value);
    event CreateRequestEvent(string _description, address _recipient, uint _value);
    event MakePaymentEvent(address _recipient, uint _value);

    constructor(uint _min, uint _deadline, uint _goal, address eoa) {
        manager = eoa;
        minimumContribution = _min;
        goal = _goal;
        deadline = _deadline;         
    }

    receive() external payable {
        contribute();
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function contribute() public payable minContribution {
        //check if address is the first time sending money
        if(participants[msg.sender] == 0) {
            numberOfContributors++;
        }
        // add participant , event is enter multiple time
        participants[msg.sender] += msg.value;
        raisedAmount += msg.value;
        emit ContributeEvent(msg.sender, msg.value);
    }

    function createRequest(string memory _description, uint _value, address payable _recipient) public onlyManager {
        Request storage newRequest = requests[numRequests];
        numRequests++;

        newRequest.description = _description;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.complete = false;
        newRequest.numberOfVoters = 0;
        
        emit CreateRequestEvent (_description, _recipient, _value);
    }

    function approveRequest(uint _requestNumber) public {
        require(participants[msg.sender] > 0, "You must be a participant to be able to vote");

        // specified witch request is voted and create a local variable
        Request storage thisRequest = requests[_requestNumber];

        // check if the address is already voted, by default voter mapping is set to false 
        require(thisRequest.voters[msg.sender] ==  false, "You already voted!");

        // he vote for accept
        thisRequest.voters[msg.sender] = true;
        // increase the number of voters, help to calculate the percentage of accept
        thisRequest.numberOfVoters++;
    }

    function finalizeRequest(uint _requestNumber) public onlyManager {
        // check the goal 
        require(raisedAmount >= goal, "We don't reach the goal");

        // get request , create a local variable of type request
        Request storage thisRequest = requests[_requestNumber];

        // check the complete status
        require(!thisRequest.complete, "This request is already complete");        

        // check percentage of voting yes
        require(thisRequest.numberOfVoters > numberOfContributors / 2, "Not suficient number of voters!"); 

        // transfer the money
        thisRequest.recipient.transfer(thisRequest.value);

        // change complete status
        thisRequest.complete = true;

        emit MakePaymentEvent(thisRequest.recipient, thisRequest.value);
    }

    // Refund participants if request is not complete
    function getRefund() public deadlinePassed {
        // check the amount 
        require(raisedAmount < goal, "The goal was not reach!");
        // check if address is a participant
        require(participants[msg.sender] > 0, "You are not a participant");

        // create tow local variable
        address payable recipient = payable(msg.sender);
        uint value = participants[msg.sender];

        // transfer the money 
        recipient.transfer(value);
        // set participant to = 0
        participants[msg.sender] = 0;
    }

}