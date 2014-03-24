var roster = function(){
    var characters = [];

    var thor_stats = {
        name: 'Thoradin Strifeminer',
        professions:{
            tasks:{
                leadership: ['Assemble Maps', 'Chart Region', 'Feed the Needy']
            },
            todo:['leadership'],
            assignmentSort:'desc'
        },
        swordCoastAdventure:{
            /*
            runs:{
                {
                    tier: 'tier-1',
                    companions:{
                        'Cal',
                        'Drugar'
                    }
                }
            },
            */
            tierClass:'tier-1'
        }
    };

    var wizardia_stats = {
        name: 'Wizardia',
        professions:{
            tasks:{
                leadership: ['Hire Your First Mercenary','Basic Training', 'Pick Up Package', 'Protect Grateful Merchant', 'Complete Advanced Training', 'Need the Needy'],
                leatherworking: ['Hire your first Skinner', 'Gather Simple Pelts'],
                tailoring : ['Hire your first Weaver', 'Gather Wool Scraps'],
                mailsmithing: ['Hire your first Prospector','Gather Iron Ore'],
                platesmithing: ['Hire your first Miner', 'Gather Iron Ore'],
                artificing: ['Hire your first Carve', 'Gather Ore and Wood'],
                weaponsmithing: ['Hire your first Smelter', 'Gather Iron Ore and Pine Wood'],
                alchemy:['Hire your first Apothecary', 'Gather Simple Components']
            },
            todo:['leadership', 'leatherworking', 'tailoring'],//, 'mailsmithing', 'platesmithing', 'artificing', 'weaponsmithing', 'alchemy'],
            assignmentSort:'asc'
        },
        swordCoastAdventure:{
            tierClass:'tier-1'
        }
    };


    var amaranthine = {
        name: 'Amaranthine',
        professions:{
           tasks: {
                leadership: ['Explore Local Area'],
                leatherworking: ['Deep Wilderness Gathering', 'Gather Simple Pelts'],
                tailoring : ['Gather Wool Scraps'],
                mailsmithing: ['Hire your first Prospector','Gather Iron Ore'],
                platesmithing: ['Gather Iron Ore'],
                artificing: ['Gather Ore and Wood'],
                weaponsmithing: ['Hire your first Smelter', 'Gather Iron Ore and Pine Wood'],
                alchemy:['Hire your first Apothecary', 'Gather Simple Components']
            },
            todo:['leadership', 'leatherworking', 'tailoring', 'mailsmithing', 'platesmithing', 'artificing', 'weaponsmithing', 'alchemy'],
            assignmentSort:'desc'
        },
        swordCoastAdventure:{
            tierClass:'tier-1'
        }
    };

    characters.push(character(thor_stats));
    characters.push(character(wizardia_stats));

    //characters.push(character(amaranthine));

    return collection(characters, "_ROSTER_");

};