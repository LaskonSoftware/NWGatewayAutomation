(function($){

    var data = {
        name: {
            leadership: 'leadership',
            leatherworking: 'leatherworking',
            tailoring : 'tailoring',
            mailsmithig: 'mailsmithing',
            platesmithing: 'platesmithing',
            artificing: 'artificing',
            weaponsmithing: 'weaponsmithing',
        },
        selector: {
            overview: '.professions-overview:visible',
            leadership: '.professions-Leadership:visible',
            leatherworking: '.professions-Leatherworking:visible',
            tailoring: '.professions-Tailoring:visible',
            mailsmithing: '.professionss-Armorsmithing_Med:visible',
            platesmithing: '.professions-Armorsmithing_Heavy:visible',
            artificing: '.professions-Artificing:visible',
            alchemy: '.professions-Alchemy:visible',
            weaponsmithing: '.professions-Weaponsmithing'
        },
        text : {
            ok: 'OK',
            _continue: 'Continue',
            startTask:'Start Task',
            chooseTask:'Choose Task',
            collectResult: 'Collect Result',
            finishNow: 'Finish Now'
        }
    };
    var _character = {};
    var _assignments = {};
    var _self = {};
    var _changeCharacter = {};
    var Profession = function(character){
        /*var assignments = {
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
        };*/
        
        _character = character;
        //The site has an issue with professions and going to more than 3
        _assignments = _character.assignments;
        _assignments.todo = _assignments.todo.slice(0, 3);
        _changeCharacter = $.nwg.changeCharacter.create(_character);
        _self = this;
    };

    Profession.prototype.start = function(){

        var selfTask = this;

        if(!_changeCharacter.isActiveCharacter()){
            //console.log("PRF:start:isActiveCharacter");
            //Start the task by opening the character selector
            selfTask.then(_changeCharacter.openSelector, 1000);

            //Select the charcter
            selfTask.then(_changeCharacter.selectCharacter, 1000);
        }
        else if(!checks.isProfessionActiveTab()){
            //console.log("PRF:start:isProfessionActiveTab");

            //Switch to the professions tab
            selfTask.then(actions.makeProfessionActive, 1000);
            //ensure we're on the overview tab
            selfTask.then(actions.changeToOverview, 1000);
        }
        else if(checks.isModal()){
            //console.log("PRF:start:isModal");
            //collect the result
            selfTask.then(actions.collectResult, 1000)
        }
        else if(checks.isRewardAvailable()){
            //console.log("PRF:start:isRewardAvailable");
            //Open collect result modal
            selfTask.then(actions.openCollectModal, 1000);
        }
        else if(checks.isTaskAvailable()){
            //console.log("PRF:start:isTaskAvailable");

            //Switch to a profession
            selfTask.then(actions.changeToProfession, 1000);
        }
        else if(checks.isProfessionTaskList()){
            //console.log("PRF:start:isTaskAvailable");
            //Find an assignment
            selfTask.then(actions.findAssignment, 1000);
        }
        else if(checks.isOnTaskDetails()){
            //console.log("PRF:start:isOnTaskDetails");
            var assetsCount = $('.icon-block.large.any-crafting.Junk.empty').length;
            //console.log("[assetCount=" + assetsCount + "]");
            //load available assets
            if(assetsCount > 0){
                selfTask.then(actions.openAssetWindow, 1000);
                for(var i = 0; i < assetsCount - 1; i++){
                    selfTask.then(actions.selectAssetItem, 1000);
                    selfTask.then(actions.openAssetWindow, 1000);
                }
                selfTask.then(actions.selectAssetItem, 1000);
            }
            //Start the assignment
            selfTask.then(actions.startAssignment, 1000);
            return;//Starting assignment; don't coninue
        }
        else if(!checks.isOverview()){
            //console.log("PRF:start:!isOverview");
            selfTask.then(actions.changeToOverview, 1000);
        }
        else{
            //console.log("PRF:start:ELSE");
            //There's nothing to do; stop.
            this.finish();
            return;
        }

        //console.log("queueing up self.start");
        //Next up is this method!
        selfTask.then(_self.start, 1000);
    };

    Profession.prototype.stop = function(){
        //Find a way to stop this...
    };

    var actions = {
        makeProfessionActive: function(){
            //console.log("PRF:actions:makeProfessionActive");
            $('.nav-professions').trigger('click');
            return {
                error: false,
                delay: 3000
            };
        },
        changeToOverview: function(){
            //console.log("PRF:actions:changeToOverview");
            $(data.selector.overview).trigger('click');
            
            return {
                error: false,
                delay: 3000
            };
        },
        openCollectModal: function(){
            //console.log("PRF:actions:openCollectModal");
            $('button:contains(' + data.text.collectResult + ')').eq(0).trigger('click');
            return {
                error:false,
                delay:3000
            };
        },
        collectResult: function(){
            //console.log("PRF:actions:collectResult");
            var m = $('.modal-window');

            var collectBtn = m.find('button:contains(' + data.text.collectResult + ')')

            if(collectBtn.length == 1){
                //console.log("clicking modal 'collect result'");
                collectBtn.trigger('click');
            }

            return {
                error: false,
                delay: 3000
            };
        },
        changeToProfession: function(){
            //console.log("PRF:actions:changeToProfession");
            var pName = _assignments.todo[0];
            var selector = data.selector[pName];
            $(selector).trigger('click');

            return {
                error: false,
                delay: 3000
            };
        },
        findAssignment: function(){
            //console.log("PRF:actions:findAssignment");
            var titles = _assignments.tasks[_assignments.todo[0]];

            var shiftProfession = function(){
                var pName = _assignments.todo.shift();
                _assignments.todo.push(pName);
            };

            var findAssignmentOnPage = function(){
                var availableTasks = $('.task-list-entry:not(.unmet)');
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
                $(data.selector.overview).trigger('click');
            }
            else{

                //if couldn't find the assignment
                if(assignment === undefined){
                    advancePage();
                }
                else {//We have an assignment
                    //Move the current title to the end of the list
                    var prevTitle = titles.shift();
                    titles.push(prevTitle);
                    assignment.find('button:contains(' + data.text._continue + ')').trigger('click');
                }
            }

            return {
                error: false,
                delay: 2000
            };
        },
        openAssetWindow: function(){
            //console.log("PRF:actions:openAssetWindow");
            var delay = 500;
            var assets = $('.icon-block.large.any-crafting.Junk.empty');
            if(assets.length > 0){
                $(assets[0]).find('button').trigger('click');
                delay = 1000;
            }

            return {
                error: false,
                delay: delay
            };
        },
        selectAssetItem: function(){
            //console.log("PRF:actions:selectAssetItem");
            var delay = 1000;
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
                else{
                    delay = 0;
                }
            }
            

            return {
                error: false,
                delay: delay
            };
        },
        startAssignment: function(){
            //console.log("PRF:actions:startAssignment");
            var startBtn = [];
            startBtn = $('div:not(.disabled) > button:contains(' + data.text.startTask + ')');
            if(startBtn.length > 0){
                
                var newTask = $.task.create(_self.startTask, getDelay());
                newTask.progress();

                startBtn.trigger('click');

                //console.log("started Assignment");
            }else{

                //console.log("started Assi-overview");
                //Cycle the failed task to the back
                $(data.selector.overview).trigger('click');
            }
            return {error:false};
        },
        longDelay: function(){
            //console.log("PRF:actions:longDelay");
            return {
                error: false,
                delay: 1 * 60 * 60 * 1000//1 hour
            }
        }
    };

    var checks = {
        isOverview: function(){
            return $('.page-professions-overview').length === 1;
        },
        isModal: function(){
            return $('.professions-rewards-modal').is(':visible');
        },
        isProfessionActiveTab: function(){
            return $('#content_title:contains(Profession)').length === 1;
        },
        isProfessionTaskList: function(){
            return $('#tasklist_wrapper').is(':visible');
        },
        isRewardAvailable: function(){
            return $('button:contains(' + data.text.collectResult + ')').is(':visible') && !$('.modal-window').is(':visible');
        },
        isTaskAvailable: function(){
            return $('button:contains(' + data.text.chooseTask + ')').is(':visible') && !$('.modal-window').is(':visible');
        },
        isOnTaskDetails:function(){
            return $('.page-professions-taskdetails').length ===1 
        }
    }

    var applyFiltering = function(){
        var applyFilters = function(){
            //console.log("applying filters");
            var filterCheckBoxes = ['hide_abovelevel', 'hide_unmetreqs'];
            for (var i = 0; i < filterCheckBoxes.length; i++) {
                var checkbox = filterCheckBoxes[i];
                if(!$('[name=' + checkbox + ']').is(':checked') !== assignments.filter[checkbox]){
                    $('input[name=' + checkbox + ']').parent().trigger('click');
                }
            }
        };
        var applySort = function(){
            //console.log("applying Sort");
            var selector = $('[name=sort_level]');
            selector.val(assignments.filter.sort);
            selector.trigger('change');
        };

        applyFilters();
        applySort();


        return {
            error: false,
            delay: 500
        };
    };

    var getDelay = function(){
            
        var timeBarText = $('.task-duration-time').text();
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
        var milliseconds = (seconds * 1000) + Math.floor((Math.random()*1000)+1)

        var d = new Date();
        d.setMilliseconds(d.getMilliseconds() + milliseconds);
        ;console.log("[task=" + $('.taskdetails-header > h2').text() + "] for " + _character.name + " delayed for " 
            + milliseconds + " ms at " + new Date().toLocaleString()
            + " resuming at " + d.toLocaleString() + " [timeText=" + timeBarText + "]");


        return milliseconds;
    };
    //internal stuff


    $.extend(true, $.nwg, {
        profession: {
            create:function(character){
                return new Profession(character);
            }
        }
    });

}(jQuery));
