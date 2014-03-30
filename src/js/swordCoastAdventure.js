var swordCoastAdventure = function(tierClass){

    var _tierClass = !tierClass ? "tier-1" : tierClass;
    var _text = {
        chooseYourParty: 'Choose Your Party',
        ok: 'OK',
        d20: 'D20',
        criticalHit: 'Critical Hit!'
    };
    var _internalState = {
        delayUntil : 0
    };
    var setDelayUntil = function(){
        //console.log("disabled companions preventing party selection");
        var reqStam = $($('.chooseparty-stamina')[0]).find('.number').text();
        var stamDown = $($('.party-entry.full-sheet.disabled').find('.below:visible')[0]).text();
        //this can be optimized to wait min instead of based on the firt found
        var missing = reqStam - stamDown;
        var regenDelay = ((((missing-1)*8)+1) * 60 * 1000);//Check in minute if there's enough stamina
        _internalState.delayUntil = Date.now() + regenDelay;
        //console.log("SCA::delayUnti=" + _internalState.delayUntil);
       
    };
    var _methods = {
        isDelaying: function(){
            return _internalState.delayUntil > Date.now();
        },
        isActiveTab: function(){
            return $('.nav-dungeons.selected').length > 0;
        },
        makeActiveTab: function(){
            //console.log("SCA:_methods.makeActiveTab");
            $('.nav-dungeons').trigger('click');
            return {
                error: false,
                delay: 3000
            }
        },
        nextAction: function(callback){
            //console.log("SCA:_methods.nextAction");

            var task;
            if(_methods.isDelaying()){
                //console.log("Delaying: exiting");
                return {
                    error: false,
                    delay: 1000
                };
            }

            var state = _methods.state;
            var actions = _methods.actions;
            if(state.isOverWorld()){
                var overworld = actions.overworld;
                task = $.task.create(overworld.selectAdventure);
                task.then(overworld.confirmAdventure);
            } else if(state.isChooseParty()){
                var chooseParty = actions.chooseParty;
                var states = actions.chooseParty.states;

                if(states.isConfirmSelection()){
                    task = $.task.create(chooseParty.confirmParty);
                }
                else if(states.isSelectCompanions()){
                    task = $.task.create(chooseParty.selectCompanions, callback);
                }
                else{
                    //console.log("chooseParty-else");
                    setDelayUntil();//_methods.setDelayUntil();
                    //console.log("queuing up callback: " + callback);
                    if(callback){
                        task = $.task.create(callback);
                        task.progress();
                        this.finish();
                        return;
                    }
                    return {
                        error: false,
                        delay: 1000
                    };
                }
            } else if(state.isAdventure()){

                var adventure = actions.adventure;
                task = $.task.create(adventure.selectEncounter);

            } else if(state.isSelectCompanion()){
                var adventure = actions.chooseCompanion;
                task = $.task.create(adventure.chooseCompanion);
            } else if(state.isEncounter() || state.isCriticalHit()){
                //console.log("in Encounter");
                var encounter = actions.encounter;
                task = $.task.create(encounter.selectDie);
            } else if(state.isDiceRoller()){
                var diceRolling = actions.diceRolling;
                task = $.task.create(diceRolling.wait);
            } else if(state.isModal()){
                var modal = actions.modal;
                task = $.task.create(modal.clear);
            } else {
                //console.log("else");
                //console.log("else");
                setDelayUntil();//_methods.setDelayUntil();
                //console.log("queuing up callback: " + callback);
                if(callback){
                    task = $.task.create(callback);
                    task.progress();
                    this.finish();
                    return;
                }
                return {
                    error: false,
                    delay: 1000
                };
            }
            
            task.then(_methods.nextAction, callback);//Task up the next step
            task.progress();
            this.finish();
        },
        state: {
            isOverWorld: function(){
                //console.log("SCA:_methods.state.isOverWorld");
                var res = $('.overworld-locations').is(':visible');//.length > 0;
                return res;
            },
            isChooseParty: function(){
                //console.log("SCA:_methods.state.isChooseParty");
                var res = $('.page-dungeon-chooseparty').is(':visible');
                return res;
            },
            isAdventure: function(){
                //console.log("SCA:_methods.state.isAdventure");
                //We're not 'Adventure' if there's a modal
                return $('.dungeon-map-inner').is(':visible') && !$('.modal-window').is(':visible');
            },
            isSelectCompanion: function(){
                //console.log("SCA:_methods.state.isSelectCompanion");
                return $('.encounter-party-list').is(':visible');
            },
            isEncounter: function(){
                //console.log("SCA:_methods.state.isEncounter");
                return $('.page-dungeons').is(':visible') && !$('.modal-window').is(':visible');
            },
            isCriticalHit: function(){
                //console.log("SCA:_methods.state.isCriticalHit");
                return $('.modal-confirm.combat-wild > h3:contains(' + _text.criticalHit + ')').is(':visible');
            },
            isDiceRoller: function(){
                //console.log("SCA:_methods.state.isDiceRoller");
                return $('.combatDiceBox').is(':visible') && !$('.modal-window').is(':visible');
            },
            isModal: function(){
                //console.log("SCA:_methods.state.isModal");
                return $('.modal-window').is(':visible');
            }
        },
        actions: {
            overworld: {
                selectAdventure: function(){
                    //console.log("SCA:_overworldMethods.actions.selectAdventure");
                    $('a.' + _tierClass).trigger('click');
                    return {
                        error: false,
                        delay: 1000
                    };
                },
                confirmAdventure: function(){
                    //console.log("SCA:_overworldMethods.actions.confirmAdventure");
                    $('.choosePartyButton > button:contains(' + _text.chooseYourParty + ')').trigger('click');
                    return {
                        error: false,
                        delay: 1000
                    };
                }
            },
            chooseParty: {
                states: {
                    isSelectCompanions: function(){
                        //console.log("SCA:_methods.actions.chooseParty.state.isSelectCompanions");
                        return $('.page-dungeon-chooseparty').is(':visible') 
                            && ($('.party-entry.full-sheet.available:not(.promo)>a').length >= 4 
                            || $('.party-entry.full-sheet.disabled').length == 0);
                    },
                    isConfirmSelection: function(){
                        //console.log("SCA:_methods.actions.chooseParty.state.isConfirmSelection");
                        return $('.modal-confirm.sca-tavern').is(':visible') || $('.modal-confirm').find('button:contains('+_text.ok+')').is(':visible');
                    }
                },
                selectCompanions: function(callback){
                    //console.log("SCA:_choosePartyMethods.actions.selectCompanions");
                    var party = $('.party-entry.full-sheet.available:not(.promo)>a:not(.selected)');
                    var partySelected = $('.party-entry.full-sheet.available:not(.promo)>a.selected');
                    var disabled = $('.party-entry.full-sheet.disabled');
                    //console.log('[party=' + party.length + '] [disabled=' + disabled.length + ']');
                    //skip the first party; it's the 'get more'
                    if(party.length == 0 || ((party.length + partySelected.length) < 4 && disabled.length > 0)){
                        if(party.length == 0 && disabled.length == 0){
                            return {
                                error: false,
                                delay: 1000
                            };
                        }
                        setDelayUntil();
                       //console.log("Delay is: " + _internalState.delayUntil);
                       //console.log("is callback defined: ");
                        if(callback){
                           //console.log("Yes: "+ callback);
                            task = $.task.create(callback);
                            task.progress();
                            this.finish();

                            return;
                        }
                        return {
                            error: false,
                            delay: 1000
                        };
                    }
                    //console.log("Selecting Party");
                    //for(var i = 0; i < party.length && i < 4; i++){
                        $(party[0]).trigger('click');
                    //}

                    return {
                        error: false,
                        delay: 1000
                    };
                },
                confirmParty: function(){
                    //console.log("party confirmParty method");
                    var tempModal = $('.modal-confirm');
                    if(tempModal.length){
                        //console.log("Found the 'Temporary Companion' modal");
                        tempModal.find('button:contains('+_text.ok+')').trigger('click');
                    }
                    return {
                        error: false,
                        delay: 4000
                    };
                }
            },
            adventure: {
                selectEncounter: function(){
                    //console.log("selectEncounter");
                    if(!$('.dungeon-map-inner').length === 0){
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
                        $(encounters[0]).trigger('click');
                    }
                    else if(boss.length > 0){
                        $(boss[0]).trigger('click');
                    }

                    return {
                        error: false,
                        delay: 1000
                    };
                }
            },
            chooseCompanion: {
                chooseCompanion: function(){
                    //console.log("chooseCompanion");
                    var companions = $('a.selectable');
                    if(!companions.length){
                        //console.log("companions not found");
                        return {
                            error: false,
                            delay: 1000
                        };
                    };
                    $($('a.selectable')[0]).trigger('click');
                    return {
                        error: false,
                        delay: 1000
                    };
                }
            },
            encounter:{
                selectDie:function(){
                    
                    if(!dicePicker()){
                        $('.nav-dungeons').trigger('click');
                    }

                    return {
                        error: false,
                        delay: 1000
                    };
                }
            },
            diceRolling:{
                wait:function(){
                    return {
                        error:false,
                        delay: 3000
                    }
                }
            },
            modal:{
                clear:function(){
                    var m = $('.modal-window');

                    var okBtn = m.find('button:contains(' + _text.ok + ')')
                    var d20Btn = m.find('button:contains('+_text.d20+')');

                    if(okBtn.length === 1){
                        okBtn.trigger('click');
                    }
                    if(d20Btn.l === 1){
                        d20Btn.trigger('click');
                    }

                    return {
                        error:false,
                        delay: 3000
                    }
                }
            }
        }
    };

    return {
        isDelaying: function(){
            return _methods.isDelaying();
        },
        delayUntil: function(){
            return _internalState.delayUntil;
        },
        nextAction: function(callback){
            //console.log("SCA::_nextAction_");
            _internalState.delayUntil = 0;//assuming that if we're called, we want to run; remove delay.
            var task = $.task.create(_methods.makeActiveTab);
            task.then(_methods.nextAction, callback);
            task.progress();
            //console.log("finish_3");
            this.finish();
        }
    };
};
