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

        this.character = character;
        //The site has an issue with professions and going to more than 3
        this.assignments = this.character.assignments;
        this.assignments.todo = this.assignments.todo.slice(0, 3);
        this.changeCharacter = $.nwg.changeCharacter.create(this.character);
    };

    Profession.prototype.make_profession_active = function(task) {
        //console.log("make_profession_active");
        var tab = $('.nav-professions');
        if(!tab.hasClass('selected')) {
            tab.trigger('click');
            return {
                error: false,
                delay: 3000
            };
        }

        return {
            error: false,
            delay: 1000
        };
    };

    Profession.prototype.change_to_overview = function(task) {
        //console.log("change_to_overview");
        if(!$('.page-professions-overview').is(':visible')){
            $(data.selector.overview).trigger('click');

            return {
                error: false,
                delay: 3000
            };
        }

        return {
            error: false,
            delay: 0
        };
    };

    Profession.prototype.check_job_progress = function(old_task) {
        //console.log("check_job_progress");
        var self = this;
        var slots = $('.task-slot-finished');//$('.task-slot-locked, .task-slot-progress, .task-slot-finished, .task-slot-open');
        slots = slots.add('.task-slot-open');
        slots = slots.add('.task-slot-progress');

        slots.each(function(idx, slot) {
            slot = $(slot);
            var time_left = slot.find('.bar-text').text();
            var button_msg = slot.find('.input-field button').text();
            var delay = 0,
                task;

            task = self.create_base_task();

            if(slot.hasClass('task-slot-finished')) {
                task.then(self.collect_reward.bind(self));
                task.then(self.accept_reward.bind(self));
            } else if(slot.hasClass('task-slot-open')) {
                task.then(self.start_job.bind(self));
            } else if(slot.hasClass('task-slot-progress')) {
                task.then(self.start_from_progress_bar.bind(self), [slot]);
            }

            task.start_in(1500);
        });

        old_task.finish();
    };

    Profession.prototype.start_from_progress_bar = function start_from_progress_bar(slot, task) {
        //console.log("start_from_progress_bar");
        /*
            This should only ever be called from check_job_progress
        */
        var delay = this.getSlotDelay(slot);

        var new_task = this.create_base_task();
        new_task.then(this.start_job.bind(this));
        new_task.start_in(delay);

        task.finish();
    };

    Profession.prototype.start_job = function start_job(task){
        //console.log("start_job");
        var job = this.assignments.todo[0];
        var selector = data.selector[job];
        $(selector).trigger('click');

        task.then(this.assignment_filter.bind(this));
        task.then(this.assignment_sort.bind(this));
        task.then(this.find_assignment.bind(this), job);
        task.then(this.select_assignment.bind(this));

        return {
            error: false,
            delay: 3000
        };
    };

    Profession.prototype.assignment_filter = function assignment_filter(task){
        //console.log("assignment_filter");
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

        return {
            error: false,
            delay: 700
        };
    };

    Profession.prototype.assignment_sort = function assignment_sort(task){
        //console.log("assignment_sort");
        var selector = $('[name=sort_level]');
        selector.val(this.assignments.filter.sort);
        selector.trigger('change');


        return {
            error: false,
            delay: 1500
        };
    };

    Profession.prototype.find_assignment = function find_assignment(job, task){
        //console.log("find_assignment");
        var titles = this.assignments.tasks[job];

        //console.log(titles);

        var assignment = undefined;

        while(!assignment) {
            var availableTasks = $('.task-list-entry');
            for (var i = 0; i < titles.length && assignment === undefined; i++) {
                var title = titles[i].trim();
                //console.log("title = " + title);
                var availableTask = availableTasks.find('h4:contains(' + title + ')').parents('.task-list-entry');
                //console.log("availableTaskLength=" + availableTask.length );
                if(availableTask.length > 0) {
                    //console.log("found");
                    assignment = availableTask.eq(0);
                }
            }

            if(!$('.paginate_enabled_next').is(':visible') && assignment === undefined) {
                //console.log("No next");
                break;
            } else if(assignment === undefined) {
                //console.log("next");
                $('.paginate_enabled_next').trigger('click');
            }
        }

        //console.log(assignment);

        var name = this.assignments.todo.shift();
        this.assignments.todo.push(name);

        if(!assignment) {
            //console.log("assignment still null");
            //console.log(assignment);
            var new_task = this.create_base_task();
            new_task.then(this.start_job.bind(this));
            new_task.start_in(1500);

            task.finish();
            return;
        }

        return {
            error: false,
            delay: 3000,
            args:[assignment]
        };
    };

    Profession.prototype.select_assignment = function select_assignment(assignment, task){
        //console.log("select_assignment");
        assignment.find('button:contains(' + data.text._continue + ')').trigger('click');

        task.then(this.select_assets.bind(this));

        return {
            error: false,
            delay: 3000
        };
    };

    Profession.prototype.select_assets = function select_assets(task){
        //console.log("select_assets");
        var assetsCount = $('.icon-block.large.any-crafting.Junk.empty').length;
        if(assetsCount > 0){
            task.then(this.open_asset_modal.bind(this));
            for(var i = 0; i < assetsCount - 1; i++){
                task.then(this.select_asset_item.bind(this));
                task.then(this.open_asset_modal.bind(this));
            }
            task.then(this.select_asset_item.bind(this));
        }
        task.then(this.start_task.bind(this));

        return {
            error: false,
            delay: 3000
        };
    };

    Profession.prototype.open_asset_modal = function open_asset_window(task) {
        //console.log("open_asset_modal");
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
    };

    Profession.prototype.select_asset_item = function select_asset_item(task) {
        //console.log("select_asset_item");
        
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
    };


    Profession.prototype.start_task = function start_task(task){
        //console.log("start_task");
        var delay = this.getDelay();
        var startBtn = [];
        try{
            startBtn = $('div :not(.disabled) >button:contains(' + data.text.startTask + ')');
        }catch(err){
            //swallow
        }
        if(startBtn.length > 0){
            startBtn.trigger('click');
        }
        else{
            //Tried to start new when no space is available
            console.log("we're trying again in 3s");
            delay = 3000;
        }

        //console.log(delay);
        var new_task = this.create_base_task();
        new_task.then(this.collect_reward.bind(this));
        new_task.then(this.accept_reward.bind(this));
        new_task.start_in(delay);

        task.finish();
    };

    Profession.prototype.collect_reward = function collect_reward(task){
        //console.log("collect_reward");
        var rewards = $('button:contains(' + data.text.collectResult + ')');
        if(!rewards.length) {

            //If we're not there, just restart
            var new_task = this.create_base_task();
            new_task.then(this.collect_reward.bind(this));
            new_task.then(this.accept_reward.bind(this));
            new_task.start_in(2000);

            task.finish();
            return;
        }
        rewards.eq(0).trigger('click');

        return {
            error:false,
            delay:2000
        };
    };

    Profession.prototype.accept_reward = function accept_reward(task){
        //console.log("accept_reward");
        $('.modal-window button:contains(' + data.text.collectResult + ')').trigger('click');

        var new_task = this.create_base_task();
        new_task.then(this.start_job.bind(this));
        new_task.start_in(1500);

        task.finish();
    };


    Profession.prototype.create_base_task = function create_base_task() {
        //console.log("create_base_task");
        var self = this;
        var task = $.task.create(this.changeCharacter.activate.bind(this.changeCharacter));
        task.then(this.make_profession_active.bind(this));
        task.then(this.change_to_overview.bind(this));

        return task;
    };


    Profession.prototype.getDelay = function getDelay() {
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
        console.log("[task=" + $('.taskdetails-header > h2').text() + "] for " + this.character.name + " delayed for "
            + milliseconds + " ms at " + new Date().toLocaleString()
            + " resuming at " + d.toLocaleString() + " [timeText=" + timeBarText + "]");


        return milliseconds;
    };


    Profession.prototype.getSlotDelay = function getSlotDelay(slot) {
        var timeBarText = slot.find('.bar-text').text();
        //console.log("timebar=" + timeBarText);
        var times = timeBarText.split(" ");
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        for(var i = 0; i < times.length; i++){
            var str = times[i];
            if(str.indexOf('h') > 0){
                hours = parseInt(str);
            } else if(str.indexOf('m') > 0){
                minutes = parseInt(str);
            } else if(str.indexOf('s') > 0){
                seconds = parseInt(str);
            }
        }
        minutes = hours * 60 + minutes;
        seconds = minutes * 60 + seconds;
        var milliseconds = seconds * 1000;

        var d = new Date();
        d.setMilliseconds(d.getMilliseconds() + milliseconds);
        console.log("[slot=" + slot.find('h4').text() + "] for " + this.character.name + " delayed for "
            + milliseconds + " ms at " + new Date().toLocaleString()
            + " resuming at " + d.toLocaleString() + " [slotText=" + timeBarText + "]");

        return milliseconds + 2000;//We wait an extra bit
    };


    $.extend(true, $.nwg, {
        profession: {
            create:function(character){
                return new Profession(character);
            }
        }
    });

}(jQuery));
