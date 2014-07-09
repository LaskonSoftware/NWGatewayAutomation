NWGatewayAutomation
===================

Automation for the Neverwinter Gateway website [https://gateway.playneverwinter.com/]

There are 2 versions; src and src2. They use the same basic JSON; src2 tries to be a little smarter... I think it works a little better.

The intent is to work with multiple characters; and src2 does... sometimes... Best bet is to use a single character and multiple browsers/private sessions. 

The Big Idea: Gateway is a website. JQuery does stuff in websites - Can the crafting (primarily) be fully automated??? Answer: Yes!

Here is a sample JSON
```javascript
{
    name: 'This Guy',
    assignments : {
        filter:{
            sort: 'asc|desc',
            hide_abovelevel: true|false,
            hide_unmetreqs: true|false
        },
        tasks:{
            leadership: [],
            leatherworking: [],
            tailoring : [],
            mailsmithing: [],
            platesmithing: [],
            artificing: [],
            weaponsmithing: [],
            alchemy:[]
        },
        todo:[]
    }
};
```
Let's break this down! 

name: Your characters name!
assignments: This is what you want your charcter to be crafting
    filter:
        sort: 'desc' or 'asc'. If you are primarily doing low level, pick the one showing level level first; if doing lvl 20 stuff; pick the other (I do't remember which is which)
        hide_abovelevel: true hides the items you can't do yet
        hide_unmetreqs: true hides the items you don't have things for
    tasks: The things to actually do
        CRAFT_TYPE: In the array [] put the name of the actual things you want to craft. The special ones often have 'secret' names. 
    todo: [] Put the tasks you want to do in here. todo:["leadership", "tailoring"...]

These go in order. It will try to do all of the (in the above todo) leadership items (in the order declared in the leadership array) and then all the tailoring items... ect

This crazy thing ALSO can automate the Sword Coast Adventure bit... It's not smart about it though. Above tier-3 will fail. BUT.... 

After assignments in the json you add
```javascript
adv : [{
                tier:'tier-3',
                companions:[]}
    ]
```
as valid json (of course) this will run tier-3 adventures. Putting companions in the array will select them first, but missing that will select the next available.
It will run adventures until it can't run no more adventures.


There is a bit more to it; but it never got fully functional before I lost interest in fine tuning. I proved the concept and had fun with it - I moved on. Putting the readme up to better help anyone else finding this.

To run this requires the console dev tool of; more or less, any browser. I used firebug in firefox mostly.

Here is what I actually used (minus char name) to run the automation.

```javascript
//This pulls all the requisite files
$.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/NeverwinterGateway.js').then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src/js/taskPromise.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/switchToCharacter.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/professionTask.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/swordCoastAdventureTask.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/dicePickerBrain.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/Fyzxs/NWGatewayAutomation/master/src2/dicePickerTask.js');
})

//This is my character definition
var thor = {
    name: 'Thor',
    assignments:{
        filter:{
            sort: 'desc',
            hide_abovelevel: true,
            hide_unmetreqs: true
        },
        tasks: {
            leadership: ['Assemble Maps', 'Chart Region', 'Explore Local Area', 'Patrol the Mines', 'Feed the Needy', 'War Games Training'],
            tailoring:['Intensive Scrap Gathering'],
            artificing:['Gather Ore and Wood']
        },
        todo:['leadership']
    },
    adv : [{
                tier:'tier-3',
                companions:[]}
    ]
};

//This starts the profession
(function($){
    var profTask = $.nwg.profession.create(thor);
    var task = $.task.create(profTask.start);
    task.progress();
}(jQuery));

//This starts the adventure

(function($){
    var profTask = $.nwg.adventure.create(thor);
    var task = profTask.create_base_task();
    task.progress();
}(jQuery));

```

The crafting and adventure can be run at the same time. The system queues so they don't step on toes. Might look odd; but should be OK for the most part.


There are still glitches; sometimes the adventure module will glitch and get stuck... Hence this mostly works. :)