var dicePicker = function(){
    //console.log("encounter pickDie method");
    var criticalModal = $('.modal-confirm.combat-wild');
    //console.log(criticalModal);
    if(criticalModal.length > 0){
        //console.log("Selecting critical die");
        $(criticalModal.find('a.dice.usable')[0]).trigger('click');
    }else{
        var diceTray = $('.dice-tray-helper');
        var use = diceTray.find('.dice.usable');
        var disacard = diceTray.find('.dice.discardable');
        if(use.length > 0){
            var max = 0;
            var idx = -1;
            use.sort(function(a, b){
                return (parseInt($(a).find('.num').text()) || 0) < (parseInt($(b).find('.num').text()) || 0);
            });
            //console.log(use)

            //use 'special' dice first
            //console.log(use.eq(0));
            use.eq(0).trigger('click');
        } else if(disacard.length > 0){
            $(disacard[0]).trigger('click');
        } else{
            return false;
        }
    }

    return true;
};