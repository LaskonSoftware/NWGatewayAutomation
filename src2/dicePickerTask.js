(function($){

    var DicePicker = function(character, brain){
        this.brain = brain;
        this.character = character;
    };

    DicePicker.prototype.pick_die = function(task) {
            console.log("pick_die");
        if(this.is_rolling()){
            console.log("is_rolling");
            return {
                error: true,
                delay: 2000
            };
        }

        var die = this.brain.find_die();

        if(!die){
            console.log("no die");
            var new_task = $.nwg.adventure.create(this.character);
            console.log(new_task);
            new_task.start_in(1500);
            task.finish();
            return;
        }

        die.trigger('click');

        task.then(this.pick_die.bind(this));

        return {
            error: false,
            delay: 1000
        }
    };


    DicePicker.prototype.is_rolling = function() {
        return $('.combatDiceBox').is(':visible') && !$('.modal-window').is(':visible');
    };

    DicePicker.prototype.dice_avai = function(first_argument) {
        // body...
    };

    $.extend(true, $.nwg, {
        dicePicker: {
            create:function(character, brain){
                return new DicePicker(character, brain);
            }
        }
    });
}(jQuery));