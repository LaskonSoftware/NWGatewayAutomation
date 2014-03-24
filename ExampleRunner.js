
(function($){
    var rst = roster();
    var callback = function om(){
        var delay = rst.delayUntil() - Date.now();
        var task = $.task.create(rst.nextAction, om);
        task.progress(delay);
        this.finish();
        if(delay > 1000){
            console.log("Delay of:" + delay);
        }
    };
    var task = $.task.create(rst.nextAction, callback);
    task.progress();
}(jQuery));
