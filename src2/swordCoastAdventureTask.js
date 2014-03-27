(function($){

    var Adventure = function(character){

        var _adv = [
            {
                tier: "tier-[1|2|3|4|5|6]",
                companions: [ 
                    {
                        "name":"cleric",
                        "required":true||false,
                    },
                    {
                        "name":"guy",
                        "required":true||false,
                    }
                ]
            },
            {
                tier: "tier-1",
                companions: [ 
                    {
                        "name":"lowbies",
                        "required":true||false,
                    }
                ]
            },

        ];

        this.character = character;
        this.changeCharacter = $.nwg.changeCharacter.create(this.character);
    };

    Adventure.prototype.start_adventure = function(task) {
        // body...
    };

    Adventure.prototype.make_adventure_active = function(task) {
        $('.nav-dungeons').trigger('click');
        return {
            error: false,
            delay: 3000
        }
    };

    Adventure.prototype.select_adventure = function(task){

    };

    Adventure.prototype.confirm_adventure = function(task) {
        // body...
    };

    Adventure.prototype.select_adventure_party_member = function(task) {

    };

    Adventure.prototype.clear_adventure_party = function(task){

    };

    Adventure.prototype.comfirm_adventure_party = function(task) {

    };

    Adventure.prototype.select_encounter = function(task) {
        
    };

    Adventure.prototype.select_encoutner_companion = function(task) {
        
    };

    Adventure.prototype.select_die = function(task) {
        // body...
    };

    Adventure.prototype.clear_modal = function(task) {
        // body...
    };

    Adventure.prototype.roll_d20 = function(task) {
        // body...
    };

    Adventure.prototype.accept_modal = function(task) {
        // body...
    };

    Adventure.prototype.create_base_task = function create_base_task() {
        var self = this;
        var task = $.task.create(this.changeCharacter.activate.bind(this.changeCharacter));
        task.then(this.make_profession_active.bind(this));
        task.then(this.change_to_overview.bind(this));

        return task;
    };


    $.extend(true, $.nwg, {
        adventure: {
            create:function(character){
                return new Adventure(character);
            }
        }
    });

}(jQuery));