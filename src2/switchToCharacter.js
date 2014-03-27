(function($){
    "use strict";

    var ChangeToCharacter = function(character){
        this.characterName = character.name;
    };

    ChangeToCharacter.prototype.activate = function activate(task) {
        if(!this.isActiveCharacter.bind(this)) {
            task.insert(this.openSelector.bind(this));
            task.insert(this.selectCharacter.bind(this));
        }

        return{
            error: false,
            delay: 0
        };
    };

    ChangeToCharacter.prototype.openSelector = function openSelector() {
        var changeCharacterText = 'Change Character'
        $('a:contains(' + changeCharacterText + ')').trigger('click');

        return{
            error: false,
            delay: 2000
        };
    };

    ChangeToCharacter.prototype.selectCharacter = function selectCharacter() {
        var self = this;
        $('a > h4.char-list-name:contains(' + this.characterName + ')').trigger('click');

        return{
            error: false,
            delay: 2000
        };
    };

    ChangeToCharacter.prototype.isActiveCharacter = function isActiveCharacter() {
        return $('.name-char:contains(' + this.characterName + ')').length  > 0
    };

    $.extend(true, $.nwg,  {
        changeCharacter: {
            create:function(character){
                return new ChangeToCharacter(character);
            }
        }
    });

}(jQuery));
