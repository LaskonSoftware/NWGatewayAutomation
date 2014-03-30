(function($){

    var DicePicker = function(character, brain){
        this.brain = brain;
        this.character = character;
    };

    DicePicker.prototype.pick_die = function(task) {
        if(this.is_rolling()){
            return {
                error: true,
                delay: 2000
            };
        }

        var die = this.brain.find_die();

        if(!die){
            var new_task = $.nwg.adventure.create(character);
            new_task.start_in(1500);
            task.finish();
            return;
        }

        die.trigger('click');

        return {error:false, delay:1000};

    };


    DicePicker.prototype.is_rolling = function() {
        return $('.combatDiceBox').is(':visible') && !$('.modal-window').is(':visible');
    };

    $.extend(true, $.nwg, {
        dicePicker: {
            create:function(brain){
                return new DicePicker(brain);
            }
        }
    });
}(jQuery));