(function($){

    var DicePickerBrain = function(){
    };

    DicePickerBrain.prototype.find_die = function() {
        if(this.is_critical()){
            return this.find_critical_die();
        }

        return this.find_tray_die();
    };

    DicePickerBrain.prototype.find_tray_die = function() {
        var diceTray = $('.dice-tray-helper');
        var use = diceTray.find('.dice.usable');
        var disacard = diceTray.find('.dice.discardable');
        
        if(use.length > 0){
            var max = 0;
            var idx = -1;
            use.sort(function(a, b){
                return (parseInt($(a).find('.num').text()) || 0) < (parseInt($(b).find('.num').text()) || 0);
            });
            return use.eq(0)
        } else if(disacard.length > 0){
            return disacard.eq(0);
        }

        return undefined;
    };

    DicePickerBrain.prototype.find_critical_die = function() {
        return $('.modal-confirm.combat-wild a.dice.usable').eq(0);
    };


    DicePickerBrain.prototype.is_critical = function() {
        return $('.modal-confirm.combat-wild').is(':visible');
    };

    $.extend(true, $.nwg, {
        dicePickerBrain: {
            create:function(){
                return new DicePickerBrain();
            }
        }
    });
}(jQuery));