var professions = function(professionsTodo, professionTasks, assignmentSort){


    var professionInfo = {
        names: {
            leadership: 'leadership',
            leatherworking: 'leatherworking',
            tailoring : 'tailoring',
            mailsmithig: 'mailsmithing',
            platesmithing: 'platesmithing',
            artificing: 'artificing',
            weaponsmithing: 'weaponsmithing',
        },
        select: {
            overview: '.professions-overview:visible',
            leadership: '.professions-Leadership:visible',
            leatherworking: '.professions-Leatherworking:visible',
            tailoring: '.professions-Tailoring:visible',
            mailsmithing: '.professions-Armorsmithing_Med:visible',
            platesmithing: '.professions-Armorsmithing_Heavy:visible',
            artificing: '.professions-Artificing:visible',
            alchemy: '.professions-Alchemy:visible',
            weaponsmithing: '.professions-Weaponsmithing'
        },
        tasks: {
            leadership: ['Explore Local Area','Feed the Needy'],
            leatherworking: ['Gather Simple Pelts'],
            tailoring : ['Gather Wool Scraps'],
            mailsmithing: ['Hire your first Prospector','Gather Iron Ore'],
            platesmithing: ['Gather Iron Ore'],
            artificing: ['Gather Ore and Wood'],
            weaponsmithing: ['Hire your first Smelter', 'Gather Iron Ore and Pine Wood'],
            alchemy:['Hire your first Apothecary', 'Gather Simple Components']
        },
        todo:[]//'leadership', 'leatherworking', 'tailoring', 'mailsmithing', 'platesmithing', 'artificing', 'weaponsmithing', 'alchemy']
    };
    var _text = {
        ok: 'OK',
        _continue: 'Continue',
        startTask:'Start Task',
        chooseTask:'Choose Task',
        collectResult: 'Collect Result',
        finishNow: 'Finish Now'
    };
    var _internalState = {
        delayUntil: 0,
        professionLoading: 0,
        assignmentMissing: 0
    };


    //Set up passed in professions - allows customization for characters
    if(professionsTodo){
        professionInfo.todo = professionsTodo;
    }
    if(professionTasks){
        professionInfo.tasks = professionTasks;
    }
    var _assignmentSort = !assignmentSort ? "asc" : assignmentSort;

    var _methods = {
        setDelayUntil: function(){
            
            var getBarTextTimeinMS = function(timeBar){
                var timeBarText = $(timeBar).text();
                //console.log("timebar=" + timeBarText);
                var times = timeBarText.split(" ");
                var hours = 0;
                var minutes = 0;
                var seconds = 0;
                for(var i = 0; i < times.length; i++){
                    var str = times[i];
                    if(str.indexOf('h') > 0){
                        hours = parseInt(str);
                    }
                    else if(str.indexOf('m') > 0){
                        minutes = parseInt(str);
                    }
                    else if(str.indexOf('s') > 0){
                        seconds = parseInt(str);
                    }
                }
                minutes = hours * 60 + minutes;
                seconds = minutes * 60 + seconds;
                var milliseconds = seconds * 1000;
                return milliseconds + 2000;//We wait an extra bit
            };
            var timeOutUntil = function(){
                var timeBarCSS = '.bar-text';
                var timeBars = $(timeBarCSS);
                var minTimeInMS = 48 * 60 * 60 * 1000;//48 hours in milliseconds
                for (var i = 0; i < timeBars.length; i++) {
                    var timeBar = timeBars[i];
                    var barTime = getBarTextTimeinMS(timeBar);
                    if(barTime < minTimeInMS){
                        minTimeInMS = barTime;
                    }
                }
                //console.log("settings timeout for [ms=" + minTimeInMS + "]ms");
                return Date.now() + minTimeInMS;
            };
            _internalState.delayUntil = timeOutUntil();
            //console.log("PRF::delayUnti=" + _internalState.delayUntil);
        },
        isDelaying: function(){
            return _internalState.delayUntil > Date.now();
        },
        isActiveTab: function(){
            return $('.nav-professions.selected').length > 0;
        },
        makeActiveTab: function(){
            //console.log("PRF:_methods.makeActiveTab");
            $('.nav-professions').trigger('click');
            return {
                error: false,
                delay: 3000
            };
        },
        nextAction: function(callback){
            //console.log("PRF:_methods.nextAction");
            //console.log("callback isnow : " + callback);
            if(window.kill){
                //console.log("killing");
                return {error:false};
            }

            if(_methods.isDelaying()){
                //console.log("Waiting on assignments. Delaying.");
                return {
                    error: false,
                    delay: 1000
                };
            }

            var state = _methods.state;
            var actions = _methods.actions;
            var task;

            if(state.isRewardWaiting()){

                var collectAssignment = actions.assignments;
                task = $.task.create(collectAssignment.collectAssignment);
                //When it comes back it'll find the modal and do the collecting
            }
            else if(state.isAssignmentAvailable()){
                if(_internalState.assignmentMissing++ > 10){
                    //bounce out because we're cycling through things too much
                    //It's likely there is an open slot, but no available task
                    //console.log("Searching for tasks has exceeded our limit. Stopping");
                    _methods.setDelayUntil();
                    return {error:false, delay:1000};
                }
                
                var profession = actions.profession;
                task = $.task.create(profession.switchToProfession);
                task.then(_methods.applyFiltering);
                task.then(profession.selectAssignment);

            }
            else if(state.isAssignmentActive()){
                
                var startAssignment = actions.profession;
                task = $.task.create(startAssignment.selectAssetTrigger);
                task.then(startAssignment.selectAssetItem);
                task.then(startAssignment.selectAssetTrigger);
                task.then(startAssignment.selectAssetItem);
                task.then(startAssignment.selectAssetTrigger);
                task.then(startAssignment.selectAssetItem);
                task.then(startAssignment.startAssignment);
            }
            else if(state.isModal()){
                var modal = actions.modal;
                task = $.task.create(modal.clear);
            }
            else if(state.isProfession() && !state.isProfessionLoaded()){
                if(_internalState.professionLoading++ > 10){
                    $(professionInfo.select.overview).trigger('click');
                }
                var assignments = actions.assignments;
                task = $.task.create(assignments.wait);
            }
            else if(state.isProfession()){
                var isProfession = actions.profession;
                task = $.task.create(isProfession.selectAssignment);
            }
            else {
                //console.log("else");
                _methods.setDelayUntil();
                //console.log("PRF:ELSE:: callback-" + callback);
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
            //console.log("finish_2");
            this.finish();
        },
        applyFiltering: function(){
            var applyFilters = function(){
                //console.log("applying filters");
                var filterCheckBoxes = ['hide_abovelevel', 'hide_unmetreqs'];
                for (var i = 0; i < filterCheckBoxes.length; i++) {
                    var checkbox = filterCheckBoxes[i];
                    if(!$('[name=' + checkbox + ']').is(':checked')){
                        //console.log("checking the box=" + checkbox);
                        $('input[name=' + checkbox + ']').parent().trigger('click');
                    }else{
                        //console.log("NOT checking the box=" + checkbox);
                    }
                }
            };
            var applySort = function(){
                //console.log("applying Sort");
                var selector = $('[name=sort_level]');
                selector.val(_assignmentSort);
                selector.trigger('change');
            };

            applyFilters();
            applySort();


            return {
                error: false,
                delay: 1000
            };
        },
        state: {
            isOverview:function(){
                //console.log("PRF:_methods.state.isOverview");
                return $('.professions-overview.selected').is(':visible') && !$('.modal-window').is(':visible'); 
            },
            isProfession:function(){
                //console.log("PRF:_methods.state.isProfession");
                return $('.page-professions-tasklist').is(':visible');
            },
            isProfessionLoaded:function(){
                //console.log("PRF:_methods.state.isProfessionLoaded");
                return $('input:text').is(':visible')
            },
            isRewardWaiting: function(){
                //console.log("PRF:_methods.state.isRewardWaiting");
                var res = $('button:contains(' + _text.collectResult + ')').is(':visible') && !$('.modal-window').is(':visible');
                return res;
            },
            isAssignmentAvailable: function(){
                //console.log("PRF:_methods.state.isAssignmentAvailable");
                var res = $('button:contains(' + _text.chooseTask + ')').is(':visible') && !$('.modal-window').is(':visible');
                return res;
            },
            isAssignmentActive: function(){
                //console.log("PRF:_methods.state.isAssignmentActive");
                return $('.page-professions-taskdetails').is(':visible') && !$('.modal-window').is(':visible');
            },
            isModal: function(){
                //console.log("PRF:_methods.state.isModal");
                return $('.modal-window').is(':visible');
            },
            isOverview: function(){
                //console.log("PRF:_methods.state.isOverview");
                return $('.page-professions-overview > h3:contains(Available Profession Slots)').is(':visible');
            },
            isAllRunning: function(){
                //console.log("PRF:_methods.state.isAllRunning");
                return $('button:contains(' + _text.chooseTask + ')').length == 0 && 
                        $('button:contains(' + _text.CollectResult + ')').length == 0 && 
                        !$('.modal-window').is(':visible');
            }
        },
        actions: {
            assignments:{
                wait:function(){
                    return {
                        error:false,
                        delay:3000
                    };
                },
                collectAssignment:function(){
                    //console.log("collectAssignment");
                    $($('button:contains(' + _text.collectResult + ')')[0]).trigger('click');
                    return {
                        error:false,
                        delay:3000
                    };
                },
                switchToOverview:function(){
                    $('.professions-overview').trigger('click');
                    return {
                        error:false,
                        delay:3000
                    };
                }
            },
            modal: {
                clear:function(){
                    //console.log("clear");

                    var m = $('.modal-window');

                    var okBtn = m.find('button:contains(' + _text.ok + ')');
                    var collectBtn = m.find('button:contains(' + _text.collectResult + ')')

                    if(okBtn.length === 1){
                        okBtn.trigger('click');
                    }
                    else if(collectBtn.length === 1){
                        //console.log("collected");
                        collectBtn.trigger('click');
                    }

                    return {
                        error: false,
                        delay: 3000
                    };
                }
            },
            profession:{
                switchToProfession:function(){
                    var pName = professionInfo.todo[0];
                    //console.error("Switching to profession=" + pName);
                    var selector = professionInfo.select[pName];
                    $(selector).trigger('click');
                    
                    return {
                        error: false,
                        delay: 3000
                    };
                },
                selectAssignment:function(){
                    //console.log("PRF:_methods.actions.profession.selectAssignment");
                    //console.error("profession:" + professionInfo.todo[0]);
                    //console.log("tasks:" + professionInfo.tasks[professionInfo.todo[0]]);
                    var titles = professionInfo.tasks[professionInfo.todo[0]];

                    var shiftProfession = function(){
                        var pName = professionInfo.todo.shift();
                        professionInfo.todo.push(pName);
                    };

                    var findAssignmentOnPage = function(){
                        var availableTasks = $('.task-list-entry');
                        var assignment = undefined;
                        
                        for (var i = 0; i < titles.length && assignment === undefined; i++) {
                            var title = titles[i].trim();
                            for (var j = 0; j < availableTasks.length && assignment === undefined; j++) {
                                var availableTask = $(availableTasks[j]);
                                var availableTitle = $(availableTask.find("h4")).text().trim();
                                //console.log("[title=" + title + "] vs [availableTitle=" + availableTitle + "]");
                                if(title == availableTitle){
                                    //console.log("matched");
                                    return availableTask;
                                }
                            }
                        }
                        return undefined;
                    };

                    var nextPageAvailable = function(){
                        return $('.paginate_enabled_next').is(':visible');
                    };

                    var advancePage = function(){
                        if(nextPageAvailable()){
                            var nextBtn = $('.paginate_enabled_next');
                            nextBtn.trigger('click');
                        }
                    };

                    var assignment = findAssignmentOnPage();

                    if(assignment === undefined && !nextPageAvailable()){
                        shiftProfession();//shift professions as we've run out of placed to check for current
                        //don't return, let the nextAction process
                        //console.log("TODO=" + professionInfo.todo);
                        $(professionInfo.select.overview).trigger('click');
                    }
                    else{

                        //if couldn't find the assignment
                        if(assignment === undefined){
                            advancePage();
                            //shiftProfession();
                            //$(professionInfo.select.overview).trigger('click');
                            //switch to overview; it'll search for the next task
                        }
                        else {//We have an assignment
                            //console.log("trigger task");

                            //Move the current title to the end of the list
                            var prevTitle = titles.shift();
                            titles.push(prevTitle);
                            assignment.find('button:contains(' + _text._continue + ')').trigger('click');
                            //We've found an assignment, reset the counter
                            _internalState.assignmentMissing = 0;
                            _internalState.professionLoading = 0;
                        }

                    }

                    return {
                        error: false,
                        delay: 2000
                    };
                },
                selectAssetTrigger: function(){
                    var assets = $('.icon-block.large.any-crafting.Junk.empty');
                    if(assets.length > 0){
                        $(assets[0]).find('button').trigger('click');
                    }

                    return {
                        error: false,
                        delay: 1000
                    };
                },
                selectAssetItem: function(){
                    
                    
                    var special = $('.modal-item-list').find('.icon-block.simple.Special');
                    var gold = $('.modal-item-list').find('.icon-block.simple.Gold');
                    var silver = $('.modal-item-list').find('.icon-block.simple.Silver');
                    var bronze = $('.modal-item-list').find('.icon-block.simple.Bronze');

                    if(special.length > 0){
                        $(special[0]).trigger('click');
                    }else if(gold.length > 0){
                        $(gold[0]).trigger('click');
                    }else if(silver.length > 0){
                        $(silver[0]).trigger('click');
                    }else if(bronze.length > 0){
                        $(bronze[0]).trigger('click');
                    }
                    else {
                        var close = $('.modal-content > .close-button');
                        if(close){
                            close.trigger('click');
                        }
                    }
                    

                    return {
                        error: false,
                        delay: 1000
                    };
                },
                startAssignment: function(){
                    var startBtn = [];
                    try{
                        startBtn = $('div :not(.disabled) >button:contains(' + _text.startTask + ')');
                    }catch(err){
                        //swallow
                    }
                    if(startBtn.length > 0){
                        startBtn.trigger('click');
                    }else{
                        $(professionInfo.select.overview).trigger('click');
                    }
                    return {
                        error: false,
                        delay: 3000
                    };
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
            //console.log("PRF::_nextAction_");
            //console.log("callback is: " + callback);
            _internalState.delayUntil = 0;//assuming that if we're called, we want to run; remove delay.
            var task = $.task.create(_methods.makeActiveTab);
            task.then(_methods.nextAction, callback);
            task.progress();
            //console.log("PRF:nextAction.e");
            this.finish();
        }
    };
};
