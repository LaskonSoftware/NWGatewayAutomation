(function($){
    $.getScript("https://raw.github.com/KanbanSolutions/Math.uuid.js/master/Math.uuid.js");
    var Task = function(start_method, call_args) {
        this.id = Math.uuidFast();// https://github.com/KanbanSolutions/Math.uuid.js
        this.steps = [];
        this.then(start_method, call_args);
    };

    Task.prototype.then = function(step_method, call_args) {
        //console.log("then: " + call_args);
        var defered = $.Deferred();
        defered.then(this.Step(step_method, call_args));
        this.steps.push(defered);

        return this;
    };

    Task.prototype.insert = function(step_method, call_args) {
        //console.log("then: " + call_args);
        var defered = $.Deferred();
        defered.then(this.Step(step_method, call_args));
        this.steps.splice(1, 0, defered);

        return this;
    };

    Task.prototype.Step = function(step_method, call_args) {
        var self = this;
        console.log("Step for " + self.id);
        var wrap = function() {
            console.log("wrap for " + self.id);
            var args = call_args || [].slice.call(arguments);
            if(!$.isArray(args)){
                args = $.makeArray(args);
            }
            //console.log("wrap: " + call_args);
            //console.log("wrap: " + args);
            /*
                results object for any task step method
                {
                    error: true||false,
                    delay:0, //int
                    args:[], //Args to pass to the next step (if any)
                }
            */
            //Moving from progress
            if(!($.task.executing === self.id || $.task.executing === null)) {
                requestAnimationFrame(function() {
                    self.progress.apply(self, args);
                });
                return;
            }
//I think something is borking here
            $.task.executing = self.id;
            //Move End
            var results = step_method.apply(self, args);
            var delay = results === undefined || results.delay === undefined ? 0 : results.delay;

            //console.log("[results=" + results + "] [steps.length=" + this.steps.length + "]");
            if(results === undefined && self.steps.length === 0){
                /*
                    I don't know why I need to bounce out here, it fails if I don't.
                */
                //console.log("exiting on thingy");
                return;
            }
            if(results !== undefined && results.error) {
                //console.log("retry needed");
                self.retry.call(self, delay, step_method, args);
            } else {
                //console.log("no retry needed");
                if(!results) results = {};
                //console.log('promise: ' + call_args);
                //console.log('promise: ' + args);
                args = results.args || [];
                args.unshift(delay);
                self.steps.shift();
                self.progress.apply(self, args);
            }
        };
        return wrap;
    };

    Task.prototype.retry = function(delay, step_method, args) {
       //console.log("retry");
       this.steps.shift();
       var defered = $.Deferred();
       defered.then(this.Step(step_method, args));
       this.steps.unshift(defered);

       this.progress(delay);

       return this;
   };

    Task.prototype.progress = function(delay) {
        if(!delay){
            delay = 0;
        }
        var args = [].slice.call(arguments);
        self = this;

        //moved to Step.wrap

        if(args.length > 1) {
            args.shift(); //remove the delay from the args
        }

        var execute = function() {
            //console.log("execute");
            if(!self.steps.length) {
                self.finish();
                return;
            }
            var defered = self.steps[0];
            args.push(self);
            defered.resolve.apply(this, args);
        }

        if(delay > 0) {
            setTimeout(execute, delay);
        } else {
            requestAnimationFrame(execute);
        }

        return this;
    };

    Task.prototype.finish = function() {
        //console.log("finish");
        var self = this;
        this.steps = [];
        $.task.executing = null;
        requestAnimationFrame(function(){
          delete self;
        });
    };


    $.extend(true, {
        task: {
            create: function(start_method, call_args) {
                return new Task(start_method, call_args);
            },
            executing: null
        }
    });

}(jQuery));
