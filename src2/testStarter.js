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
    name: 'Thoradin Strifeminer',
    assignments:{
        filter:{
            sort: 'desc',
            hide_abovelevel: true,
            hide_unmetreqs: true
        },
        tasks: {
            leadership: ['Feed the Needy']//['Assemble Maps', 'Chart Region', 'Feed the Needy']
        },
        todo:['leadership'],
    }
};

(function($){
    var profTask = $.nwg.profession.create(thor);
    var task = $.task.create(profTask.start);
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
