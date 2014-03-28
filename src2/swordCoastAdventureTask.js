(function($){


    var advState: {
        isOverWorld: function(){
            return $('.overworld-locations').is(':visible');
        },
        isChooseParty: function(){
            return $('.page-dungeon-chooseparty').is(':visible');
        },
        isAdventure: function(){
            return $('.dungeon-map-inner').is(':visible') && !$('.modal-window').is(':visible');
        },
        isSelectCompanion: function(){
            return $('.encounter-party-list').is(':visible');
        },
        isEncounter: function(){
            return $('.page-dungeons').is(':visible') && !$('.modal-window').is(':visible');
        },
        isCriticalHit: function(){
            return $('.modal-confirm.combat-wild > h3:contains(' + _text.criticalHit + ')').is(':visible');
        },
        isDiceRoller: function(){
            return $('.combatDiceBox').is(':visible') && !$('.modal-window').is(':visible');
        },
        isModal: function(){
            return $('.modal-window').is(':visible');
        }
    };

    var Adventure = function(character){

        var _adv = [
            {
                tier: "tier-[1|2|3|4|5|6]",
                companions: [ 
                    {
                        "name":"cleric",
                        "required":true||false,
                    },
                    {
                        "name":"guy",
                        "required":true||false,
                    }
                ]
            },
            {
                tier: "tier-1",
                companions: [ 
                    {
                        "name":"lowbies",
                        "required":true||false,
                    }
                ]
            },

        ];

        this.character = character;
        this.changeCharacter = $.nwg.changeCharacter.create(this.character);
    };

    Adventure.prototype.make_adventure_active = function(task) {
        $('.nav-dungeons').trigger('click');
        return {
            error: false,
            delay: 3000
        }
    };

    Adventure.prototype.check_adventure_state = function(tasl) {
        var task = self.crete_base_task();
        /*
            Should only be called from the crate_base_task method
        */

        //isOverworld
            //start adventure
        //isChooseParty
            //select adventure party member (which attemps to cancel the confirm if up THEN clears THEN selects)
        //isAdventure
            //select encounter
        //isSelectCompanion
            //choose encounter companion
        //isEncounter || isCritical
            //select die
        //isDiceRoller
            //wait
        //isModal
            //clear
        //else
    };


    Adventure.prototype.start_adventure = function(task) {
        //Needs to have switch to determine where to start...

    };

    Adventure.prototype.confirm_adventure = function(task) {
        
    };

    Adventure.prototype.select_adventure_party_member = function(task) {

    };

    Adventure.prototype.clear_adventure_party = function(task){

    };

    Adventure.prototype.comfirm_adventure_party = function(task) {

    };

    Adventure.prototype.select_encounter = function(task) {
        
    };

    Adventure.prototype.select_encoutner_companion = function(task) {
        
    };

    Adventure.prototype.select_die = function(task) {
        // body...
    };

    Adventure.prototype.clear_modal = function(task) {
        // body...
    };

    Adventure.prototype.roll_d20 = function(task) {
        // body...
    };

    Adventure.prototype.accept_modal = function(task) {
        // body...
    };

    Adventure.prototype.create_base_task = function create_base_task() {
        var self = this;
        var task = $.task.create(this.changeCharacter.activate.bind(this.changeCharacter));
        task.then(this.make_adventure_active.bind(this));

        return task;
    };


    $.extend(true, $.nwg, {
        adventure: {
            create:function(character){
                return new Adventure(character);
            }
        }
    });

}(jQuery));