(function($){

    var data = {
        state : {
            isOverWorld: function(){
                return $('.overworld-locations').is(':visible');
            },
            isChooseParty: function(){
                return $('.page-dungeon-chooseparty').is(':visible');
            },
            isAdventure: function(){
                return $('.dungeon-map-inner').is(':visible') && !$('.modal-window').is(':visible');
            },
            isSelectEncounterCompanion: function(){
                return $('.encounter-party-list').is(':visible');
            },
            isEncounter: function(){
                return $('.page-dungeon-combat').is(':visible') && 
                        (!$('.modal-window').is(':visible') || 
                          $('.modal-confirm.combat-wild > h3:contains(' + data.text.criticalHit + ')').is(':visible'));
            },
            isDiceRoller: function(){
                return $('.combatDiceBox').is(':visible') && !$('.modal-window').is(':visible');
            },
            isCombatVictory: function(){
                return $('.modal-confirm.combat-victory').is(':visible');
            },
            isModal: function(){
                return $('.modal-window').is(':visible');
            }
        },
        text:{
            chooseYourParty: 'Choose Your Party',
            ok: 'OK',
            d20: 'D20',
            criticalHit: 'Critical Hit!'
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
        this.adventures = this.character.adv;
        this.dicePicker = $.nwg.dicePicker.create(this.character, $.nwg.dicePickerBrain.create());
    };

    Adventure.prototype.make_adventure_active = function(task) {
        $('.nav-dungeons').trigger('click');
        return {
            error: false,
            delay: 3000
        };
    };

    Adventure.prototype.check_adventure_state = function(task) {
        console.log("check_adventure_state");
        //var task = self.crete_base_task();
        /*
            Should only be called from the crate_base_task method
        */

        if(data.state.isOverWorld()){
            console.log("isOverWorld");
            task.then(this.start_adventure.bind(this))
            task.then(this.confirm_adventure.bind(this));
            /*
            task.then(this.clear_adventure_party.bind(this));
            task.then(this.select_adventure_party.bind(this));
            task.then(this.select_encounter.bind(this));
            task.then(this.select_encounter_companion.bind(this));
            task.then(this.dicePicker.pick_die.bind(this.dicePicker));
            */
        }
        else if(data.state.isChooseParty()){
            console.log("isChooseParty");
            task.then(this.clear_adventure_party.bind(this));
            task.then(this.select_adventure_party.bind(this));
            task.then(this.comfirm_adventure_party.bind(this));
            /*
            task.then(this.select_encounter.bind(this));
            task.then(this.select_encounter_companion.bind(this));
            task.then(this.dicePicker.pick_die.bind(this.dicePicker));
            */
        }
        else if(data.state.isAdventure()){
            console.log("isAdventure");
            task.then(this.select_encounter.bind(this));
            task.then(this.select_encounter_companion.bind(this));
            /*
            task.then(this.dicePicker.pick_die.bind(this.dicePicker));
            */
        }
        else if(data.state.isEncounter()){
            console.log("isEncounter");
            task.then(this.dicePicker.pick_die.bind(this.dicePicker));
            task.then(this.clear_modal.bind(this));
        }
        else if(data.state.isSelectEncounterCompanion()){
            console.log("isSelectEncounterCompanion");
            task.then(this.select_encounter_companion.bind(this));
        }
        //isAdventure
            //select encounter
            //choose encounter companion
        //isSelectEncounterCompanion
        //isEncounter || isCritical
            //select die
        //isDiceRoller
            //wait
        //isModal
            //clear
        else if(data.state.isCombatVictory()){
            console.log("isCombatVictory");
            task.then(this.clear_modal.bind(this));
            task.then(this.clear_modal.bind(this));//clears the daily reward if it appears
            //We're done - set up a new one.
            var new_task = new $.nwg.adventure.create(this.character).create_base_task();
            new_task.start_in(1000);
            return {error:false, delay: 1000};
        }
        else if (data.state.isModal()){
            console.log("isModal");
            task.then(this.clear_modal.bind(this));
        }
        //else

        var new_task = new $.nwg.adventure.create(this.character).create_base_task();
        new_task.start_in(1000);
        //task.then($.nwg.adventure.create(this.character).check_adventure_state.bind(this));
        return {error:false, delay: 3000};
    };


    Adventure.prototype.start_adventure = function(task) {
        console.log("start_adventure");
        var curTier = this.adventures[0].tier;
        console.log("Running " + curTier);
        $('a.' + curTier).trigger('click');
        
        return {
            error: false,
            delay: 3000
        };
    };

    Adventure.prototype.confirm_adventure = function(task) {
        console.log("confirm_adventure");
        $('.choosePartyButton > button:contains(' + data.text.chooseYourParty + ')').trigger('click');

        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.select_adventure_party = function(task) {
        console.log("select_adventure_party");
        //select adventure party member (which attemps to cancel the confirm if up THEN clears THEN selects)
        var PARTY_SIZE = 4;
        var adventureCompanions = this.adventures[0].companions;
        var self = this;
        var companionsToSelect = [];

        var requiredCompanions = [];
        var optionalCompanions = [];
        var totalCompanionCount = $('.party-entry.full-sheet:not(.promo)').length;
        var disabledCount = $('.party-entry.full-sheet.disabled').length;
        var maxAvailableCount = totalCompanionCount - disabledCount;
        var availableCompanions = $('.party-entry.full-sheet.available:not(.promo)>a:not(.selected)');

        console.log("adv party");
        console.log(adventureCompanions);
        if(adventureCompanions && adventureCompanions.length > 0 && 
            totalCompanionCount > PARTY_SIZE && maxAvailableCount > PARTY_SIZE){

            $(availableCompanions).each(function(indx, aCmp){
                var aComp = $(aCmp);
                var matched = false;
                $(adventureCompanions).each(function(indx, cmp){
                    var companion = aComp.has(':contains(' + cmp.name + ')');
                    if(companion.length === 1){
                        matched = true;
                        if(cmp.required){
                            requiredCompanions.push(companion);
                        }
                        else if(!cmp.excluded){
                            optionalCompanions.push(companion);
                        }
                    }
                });
                if(!matched){
                    optionalCompanions.push(aComp);
                }
                //console.log("rC=" + requiredCompanions.length + " | oC=" + optionalCompanions.length);
            });


            if(requiredCompanions.length + optionalCompanions.length >= PARTY_SIZE){
                
                for(var i = 0; i < requiredCompanions.length && i < PARTY_SIZE; i++){
                    companionsToSelect.push($(requiredCompanions[i]));
                }

                for(var ii = 0; ii < optionalCompanions.length && ii < PARTY_SIZE && ii < PARTY_SIZE - requiredCompanions.length; ii++){
                    companionsToSelect.push($(optionalCompanions[ii]));
                }

            }
        }
        else if(totalCompanionCount <= PARTY_SIZE && disabledCount === 0){
            console.log("available compansions are all");
            companionsToSelect = availableCompanions;
        }

        if(companionsToSelect.length > 0){
            for(var i = 0; i < companionsToSelect.length && i < PARTY_SIZE; i++){
                $(companionsToSelect[i]).trigger('click');
            }
        }
        else{
            console.log("Not enough compansions available")
            var delay = this.get_delay();
            var character = this.character;
            character.adv.push(character.adv.shift());
            
            var new_task = new $.nwg.adventure.create(character).create_base_task();
            new_task.then(this.back_to_map.bind(this));
            new_task.start_in(delay);

            //Go to the next adventure group

            task.finish();
            return;
        }

        return {error:false, delay: 2000};
    };

    Adventure.prototype.back_to_map = function(task) {
        $('a.chooseparty-back').trigger('click');
        return {error:false, delay: 2000};
    };

    Adventure.prototype.clear_adventure_party = function(task){
        console.log("clear_adventure_party");
        var partyCloseButtons = $('.party-entry > button.close-button');
        partyCloseButtons.each(function(idx, btn) {
            $(btn).trigger('click');
        });

        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.comfirm_adventure_party = function(task) {
        console.log("comfirm_adventure_party");
        $('.modal-window  button:contains(' + data.text.ok + ')').trigger('click');

        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.select_encounter = function(task) {
        console.log("select_encounter");
        if($('.dungeon-map-inner').length === 0){
            //console.log("Dungeon not ready");
            return {
                error: false,
                delay: 1000
            };
        }
        var encounters = $('.overlay.button:not(.complete, .exit, .boss)');
        var boss = $('.overlay.button.boss');

        //console.log("[encounters=" + encounters.length + "]");
        if(encounters.length > 0){
            encounters.eq(0).trigger('click');
        }
        else if(boss.length > 0){
            boss.eq(0).trigger('click');
        }

        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.select_encounter_companion = function(task) {
        console.log("select_encounter_companion");
        var companions = $('a.selectable');
        if(!companions.length){
            //console.log("companions not found");
            return {
                error: false,
                delay: 1000
            };
        };
        $('a.selectable').eq(0).trigger('click');
        return {
            error: false,
            delay: 1000
        };
    };

    Adventure.prototype.clear_modal = function(task) {
        var m = $('.modal-window');

        var okBtn = m.find('button:contains(' + data.text.ok + ')')
        var d20Btn = m.find('button:contains('+ data.text.d20+')');

        if(okBtn.length === 1){
            okBtn.trigger('click');
        }
        if(d20Btn.l === 1){
            d20Btn.trigger('click');
        }

        return {
            error:false,
            delay: 1000
        }
    };

    Adventure.prototype.get_delay = function(task) {
        var reqStam = $('.chooseparty-stamina .number').eq(0).text();
        var belowStamComp = $('.party-entry.full-sheet.disabled .party-stamina')

        belowStamComp.sort(function(l, r){
            return (parseInt($(r).find('.below').text()) || 0) < (parseInt($(l).find('.below').text()) || 0);
        });//Sorts lowest first
        
        var stamDown = belowStamComp.eq(0).text();
        var missing = reqStam - stamDown;
        var regenDelay = ((((missing-1)*8)+1) * 60 * 1000);//Check in minutes if there's enough stamina

        var d = new Date();
        d.setMilliseconds(d.getMilliseconds() + milliseconds);
        console.log("[Sword Coast Adventure for " + this.character.name + " delayed for "
            + regenDelay + " ms at " + new Date().toLocaleString()
            + " resuming at " + d.toLocaleString());

        
    };

    Adventure.prototype.create_base_task = function create_base_task() {
        console.log("create_base_task");
        var self = this;
        var task = $.task.create(this.changeCharacter.activate.bind(this.changeCharacter));
        task.then(this.make_adventure_active.bind(this));
        task.then(this.check_adventure_state.bind(this));

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