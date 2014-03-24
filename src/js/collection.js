var collection = function(arr, id){
    var _id = !id ?  Math.uuidFast() : id;
    
    var _isDelaying = function(){
        //console.log(_id + '_isDelaying');
        for(var i = 0; i < arr.length; i++){
           //console.log(_id + "--Collection:delayUntil[" + i + "]:: " + arr[i].delayUntil());
            if(!arr[i].isDelaying()){
                return false;
            }
        }
        return true;
    };
    var _delayUntil = function(){
        if(!_isDelaying()) return 0;

        var min = Date.now() + 24*60*60*1000;//24 hours
        for(var i = 0; i < arr.length; i++){
            var cur = arr[i].delayUntil();
            //console.log(_id + "--Collection:cur="+ cur);
            if(cur < min){ 
                min = cur;
            }
        }
        return min;
    };

    var _methods = {
        nextAction: function(callback, parentCallback){
            //console.log(_id + "--COL:_methods.nextAction");
            var task;
            if(!_isDelaying()){
                for(var i = 0; i < arr.length; i++){
                    if(!arr[i].isDelaying()){
                        var tab = arr.shift();
                        arr.push(tab);
                        //console.log("TAB.NEXT:: " + tab.nextAction);
                        task = $.task.create(tab.nextAction, callback);
                        //console.log('col_next_task ' + task);
                        break;
                    }
                }

                if(task){
                    //console.log("yep, task defined");
                    //console.log("callback: "+ callback);
                    task.progress();
                    this.finish();
                }

            } else {
                //console.log(_id + "--Collection:returning done - container");
                //console.log("collection-else ParentCallback: " + parentCallback);
                 if(parentCallback){
                    task = $.task.create(parentCallback);
                    task.progress(1000);
                    this.finish();
                    return;
                }

                var delay = _delayUntil()
                if(delay < 0){
                    delay = 1000;
                }
                //console.log(_id + "--Collection:delay: " + delay);
                task = $.task.create(_methods.nextAction);
                task.progress(delay, callback);
                this.finish();
            }
        }
    };
    return {
        isDelaying:function(){
            return _isDelaying();
        },
        delayUntil: function(){
            return _delayUntil();
        },
        nextAction: function(parentCallback){
            //console.log(_id + "COL_nextAction_");
            //console.log(_id + "COL_nextAction: ParentCallback: " + parentCallback);
            var callback = function cb(){
                //console.log(_id + "COL-cb");
                var task = $.task.create(_methods.nextAction, [cb, parentCallback]);
                task.progress();
                this.finish();
            };
            var task = $.task.create(_methods.nextAction, [callback, parentCallback]);
            task.progress();
            //console.log("callback is really : " + callback);
            this.finish();
        }
    };
};

