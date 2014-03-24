var character = function(chr){
    var prf, sca;
    var tasks = [];
    var _text = {
        changeChar: 'Change Character'
    };
    

    if(!chr) return;
    if(chr.professions){
        prf = professions(chr.professions.todo, chr.professions.tasks, chr.professions.assignmentSort);
        tasks.push(prf);
    }
    if(chr.swordCoastAdventure){
        sca = swordCoastAdventure(chr.tierClass);
        tasks.push(sca);
    }
    
    var taskCollection = collection(tasks, "_CHARACTER_");

    var _methods = {
        selectCharacterFromModal : function(){
            //console.log("CHR::selectCharacterFromModal for " + chr.name);
            //$('a:not(.current) > h4.char-list-name:contains(' + chr.name + ')').trigger('click');
            $('a > h4.char-list-name:contains(' + chr.name + ')').trigger('click');

            return{
                error:false,
                delay:3001
            };
        },
        popupModal: function(){
            //console.log("CHR::popupModal");
            $('a:contains(' + _text.changeChar + ')').trigger('click');

            return{
                error:false,
                delay:2000
            };
        }
    };

    return {
        isDelaying: function(){
            return taskCollection.isDelaying();
        },
        delayUntil: function(){
            return taskCollection.delayUntil();
        },
        nextAction: function(parentCallback){
            //console.log("CHR: nextAction");
            //console.log("CHR: ParentCallback: " + parentCallback);
            var task = $.task.create(_methods.popupModal);
            task.then(_methods.selectCharacterFromModal);
            task.then(taskCollection.nextAction, parentCallback);
            task.progress(0);
            this.finish();
        }
    };

};

