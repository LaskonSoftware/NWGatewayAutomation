(function($){

    var Trials = function(){
    };

    $.extend(true, $.nwg, {
        trials: {
            create:function(){
                return new Trials();
            }
        }
    });
}(jQuery));

(function($){

    var Trial = function(){
    };

    $.extend(true, $.nwg, {
        trial: {
            create:function(){
                return new Trial();
            }
        }
    });
}(jQuery));

(function($){

    var Rune = function(){

        this.count = 0;
        this.runType = 
    };

    $.extend(true, $.nwg, {
        rune: {
            create:function(){
                return new Rune();
            },
            type: {
                magic: 'magic',
                thievery: 'thievery',
                combat: 'combat',
                perception: 'perception',
                wild: 'wild'
            }
        }
    });
}(jQuery));


(function($){

    var Die = function(dieElement){
        if(!dieElement){
            //We'll be building the die, not parsing
            return;
        }

        //parse the die 

        var die = $.nwg.create_dragonling_bone();
        die.selected_face = 0;
    };

    Die.prototype.has = function(rune) {
        var has = false;
        for (var i = 0; i < this.sides.length; i++) {
            has |= this.sides[i].has(rune);
        };
        return has;
    };

    Die.prototype.index_of = function(dieSide) {
        for (var i = 0; i < this.sides.length; i++) {
            if(this.sides[i].rune == dieSide.rune && this.sides[i].num = dieSide.num){
                return i;
            }
        };
        return -1;
    };

    $.extend(true, $.nwg, {
        die: {
            parse: function(dieElement){
                return new Die(dieElement);
            },
            create_dragonling_bone: function(){
                var die = new Die();
                die.name = 'Dragonling Bone';
                die.css = 'base';
                die.sides = [
                    $.nwg.die_side.create([{rune:$.nwg.rune.type.magic, num:1}]),
                    $.nwg.die_side.create([{rune:$.nwg.rune.type.perception, num:1}]),
                    $.nwg.die_side.create([{rune:$.nwg.rune.type.thievery, num:1}]),
                    $.nwg.die_side.create([{rune:$.nwg.rune.type.combat, num:1}]),
                    $.nwg.die_side.create([{rune:$.nwg.rune.type.combat, num:2}]),
                    $.nwg.die_side.create([{rune:$.nwg.rune.type.combat, num:3}]),
                ];

                return die;
            },
            create_kossuth: function(sides){
                var sideOne =  $.nwg.die_side.create([{rune:$.nwg.rune.type.magic, num:1}]);
                var sideTwo =  $.nwg.die_side.create([{rune:$.nwg.rune.type.combat, num:3}]);
                var name = 'Kossuth';
                var css = 'sapphire';
                return $.nwg.die.create_power(sides, sideOne, sideTwo, name, css);
            },
            create_tempus: function(sides){
                var sideOne =  $.nwg.die_side.create([{rune:$.nwg.rune.type.perception, num:1}]);
                var sideTwo =  $.nwg.die_side.create([{rune:$.nwg.rune.type.combat, num:3}]);
                var name = 'Tempus';
                var css = 'ruby';
                return $.nwg.die.create_power(sides, sideOne, sideTwo, name, css);
            },
            create_tyr: function(sides){
                var sideOne =  $.nwg.die_side.create([{rune:$.nwg.rune.type.magic, num:1}]);
                var sideTwo =  $.nwg.die_side.create([{rune:$.nwg.rune.type.perception, num:1}]);
                var name = 'Tyr';
                var css = 'amethyst';
                return $.nwg.die.create_power(sides, sideOne, sideTwo, name, css);
            },
            create_shar: function(sides){ 
                var sideOne =  $.nwg.die_side.create([{rune:$.nwg.rune.type.thievery, num:1}]);
                var sideTwo =  $.nwg.die_side.create([{rune:$.nwg.rune.type.perception, num:1}]);
                var name = 'Shar';
                var css = 'topaz';
                return $.nwg.die.create_power(sides, sideOne, sideTwo, name, css);
            },
            create_oghma: function(sides){
                var sideOne =  $.nwg.die_side.create([{rune:$.nwg.rune.type.thievery, num:1}]);
                var sideTwo =  $.nwg.die_side.create([{rune:$.nwg.rune.type.magic, num:1}]);
                var name = 'Shar';
                var css = 'emerald';
                return $.nwg.die.create_power(sides, sideOne, sideTwo, name, css);
            },
            create_lloth: function(sides){
                var sideOne =  $.nwg.die_side.create([{rune:$.nwg.rune.type.thievery, num:1}]);
                var sideTwo =  $.nwg.die_side.create([{rune:$.nwg.rune.type.combat, num:3}]);
                var name = 'Lolth';
                var css = 'onyx';
                return $.nwg.die.create_power(sides, sideOne, sideTwo, name, css);
            },
            create_power: function(sides, sideOne, sideTwo, name, css){
                var die = new Die();
                die.name = name;
                die.css = css;//sapphire,onyx,topaz,amethyst,ruby,emerald
                die.sides = [
                    sideOne,
                    sideOne,
                    sideTwo,
                    sideTwo
                ];

                var sideThree = JSON.parse(JSON.stringify(sideOne));
                sideThree.runes[0].num *= 2;
                var sideFour = JSON.parse(JSON.stringify(sideTwo));
                sideFour.runes[0].num *= 2;
                var sideFive = $.nwg.die_side.create([{rune: sideOne.runes[0].rune, num:sideOne.runes[0].num},{rune: sideTwo.runes[0].rune, num:sideTwo.runes[0].num}]);
                var sideSix = $.nwg.die_side.create([{rune:$.nwg.rune.type.wild, num:1}]);

                if(sideCount >= 6){
                    die.push(sideThree);
                    die.push(sideFour);
                }
                if(sideCount >= 8){
                    die.push(sideThree);
                    die.push(sideFour);
                }
                if(sideCount >= 10){
                    die.push(sideFive);
                    die.push(sideFive);
                }
                if(sideCount === 12){
                    die.push(sideSix);
                    die.push(sideSix);
                }

                return die;
            }
        }
    });
}(jQuery));

(function($){
    //var dieSide = [{rune:'type',num:10}];
    var DieSide = function(runes){
        this.runes = []
    };

    DieSide.prototype.has = function(rune) {
        for (var i = 0; i < this.runes.length; i++) {
            if(this.runes[i].rune === rune){
                return true;
            }
        };
    };

    $.extend(true, $.nwg, {
        die_side: {
            create:function(runes){
                return new DieSide(runes);
            }
        }
    });
}(jQuery));
