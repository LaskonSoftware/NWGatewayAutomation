 var character = {
        name: 'This Guy',
        assignments : {
            filter:{
                sort: 'asc|desc',
                hide_abovelevel: true||false,
                hide_unmetreqs: true||false
            },
            todo:[],
            tasks:{
                leadership: [],
                leatherworking: [],
                tailoring : [],
                mailsmithing: [],
                platesmithing: [],
                artificing: [],
                weaponsmithing: [],
                alchemy:[]
            }
        }
    };

var thor = {
    name: 'Akta Incubore',
    assignments:{
        filter:{
            sort: 'desc',
            hide_abovelevel: true,
            hide_unmetreqs: true
        },
        tasks: {
            leadership: ['Survey Terrain', 'Gather Astral Diamonds'],//['Assemble Maps', 'Chart Region', 'Feed the Needy']
            tailoring:['Intensive Scrap Gathering'],
            artificing:['Gather Ore and Wood']
        },
        todo:['leadership','tailoring','artificing']
    }
};

$.getScript('https://rawgithub.com/djgilcrease/NWGatewayAutomation/master/src2/NeverwinterGateway.js').then(function(){
    return $.getScript('https://rawgithub.com/djgilcrease/NWGatewayAutomation/master/src/js/taskPromise.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/djgilcrease/NWGatewayAutomation/master/src2/switchToCharacter.js');
}).then(function(){
    return $.getScript('https://rawgithub.com/djgilcrease/NWGatewayAutomation/master/src2/professionTask.js');
})


    (function($){
        var profTask = $.nwg.profession.create(thor);
        var task = profTask.create_base_task();
        task.then(profTask.check_job_progress.bind(profTask));
        task.progress();
        console.log(task.id);
    }(jQuery));



(function($){
    var profTask = $.nwg.profession.create(thor);
    var task = $.task.create(profTask.start);
    task.progress();
    console.log(task.id);
}(jQuery));

var amaranthine = {
    name: 'Amaranthine',
    assignments:{
        filter:{
            sort: 'desc',
            hide_abovelevel: true,
            hide_unmetreqs: true
        },
        tasks: {
            leadership: ['Explore Local Area'],
            leatherworking: ['Gather Simple Pelts'],
            tailoring : ['Gather Wool Scraps'],
            mailsmithing: ['Gather Iron Ore'],
            platesmithing: ['Gather Iron Ore'],
            artificing: ['Gather Ore and Wood'],
            weaponsmithing: ['Gather Iron Ore and Pine Wood'],
            alchemy:['Gather Simple Components']
        },
        todo:['tailoring', 'leatherworking', 'mailsmithing', 'artificing'],
    }
};


(function($){
    var profTask = $.nwg.profession.create(amaranthine);
    var task = $.task.create(profTask.start);
    task.progress();
}(jQuery));

(function($){
    var profTask = $.nwg.profession.create(amaranthine);
    var task = $.task.create(profTask.start);
    task.progress();
    var profTask2 = $.nwg.profession.create(amaranthine);
    var task2 = $.task.create(profTask2.start);
    task2.progress();
}(jQuery));
