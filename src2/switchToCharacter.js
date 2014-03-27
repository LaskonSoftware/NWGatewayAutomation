(function($){
    
    var _characterName = {};
    var ChangeToCharacter = function(character){
        _characterName = character.name;
    };

    ChangeToCharacter.prototype.openSelector = function(){
        var changeCharacterText = 'Change Character'
        $('a:contains(' + changeCharacterText + ')').trigger('click');

        return{
            error: false,
            delay: 2000
        };
    };
    
    ChangeToCharacter.prototype.selectCharacter = function() {
        var self = this;
        $('a > h4.char-list-name:contains(' + _characterName + ')').trigger('click');

        return{
            error: false,
            delay: 2000
        };
    };

    ChangeToCharacter.prototype.isActiveCharacter = function() {
        var changeCharacterText = 'Change Character'
        return $('.name-char:contains(' + _characterName + ')').length  > 0
    };

    $.extend(true, $.nwg,  { 
        changeCharacter: {
            create:function(character){
                return new ChangeToCharacter(character);
            }
        } 
    });

}(jQuery));
