var NodeList=function() {
    var list=[];
    var map=[];
    this.getList=function(){
        return list;
    };  
    this.getNode=function(name){
        return map[name];
    };
    this.inList=function(name){
        return !!map[name];
    };
    this.addNode=function(item){
        if(!this.inList(item.name)){
            list.push(item);
            map[item.name]=item;
            item.index=list.length-1;
        }
        return map[item.name];
    };
};