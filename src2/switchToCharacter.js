(function($){

    var ChangeToCharacter = function(character){
        this.characterName = character.name;
    };

    ChangeToCharacter.prototype.activate = function activate(task) {
        if(!this.isActiveCharacter()){
            task.insert(this.openSelector.bind(this));
            task.insert(this.selectCharacter.bind(this));
        }
        else{
            //console.log(this.characterName + " is currently active");
        }

        return{
            error: false,
            delay: 100
        };
    };

    ChangeToCharacter.prototype.openSelector = function openSelector() {
        var changeCharacterText = 'Change Character'
        $('a:contains(' + changeCharacterText + ')').trigger('click');

        return{
            error: false,
            delay: 1000
        };
    };

    ChangeToCharacter.prototype.selectCharacter = function selectCharacter() {
        var self = this;
        $('a > h4.char-list-name:contains(' + this.characterName + ')').trigger('click');

        return{
            error: false,
            delay: 1000
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
