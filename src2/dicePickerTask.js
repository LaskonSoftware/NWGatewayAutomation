(function($){

    var DicePicker = function(character, brain){
        this.brain = brain;
        this.character = character;
    };

    DicePicker.prototype.pick_die = function(task) {
        //console.log("pick_die");
        if(this.is_rolling()){
            //console.log("is_rolling");

            //Add a check to not wait more than 10 times; instead end the task, start a new SCA task
            //This will prevent getting stuck on the dice rolling screen, as has happened.

            return {
                error: true,
                delay: 1000
            };
        }

        var die = this.brain.find_die();

        if(!die){
            //console.log("no die");

            return {
                error: false,
                delay: 1000
            }
        }

        die.trigger('click');

        task.insert(this.pick_die.bind(this));

        return {
            error: false,
            delay: 1000
        };
    };


    DicePicker.prototype.is_rolling = function() {
        return $('.combatDiceBox').is(':visible') && !$('.modal-window').is(':visible');
    };


    $.extend(true, $.nwg, {
        dicePicker: {
            create:function(character, brain){
                return new DicePicker(character, brain);
            }
        }
    });
}(jQuery));