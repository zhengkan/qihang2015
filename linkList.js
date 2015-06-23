var LinkList=function(){
    var list=[];
    this.getLink=function(source,target){
        for(var i=0;i<list.length;i++){
            if((list[i].source==source && list[i].target==target)||(list[i].source==target && list[i].target==source)){
                return list[i];
            }
        }
        return null;
    };
    this.addLink=function(item){
        var link=this.getLink(item.source,item.target);
        if(!!link && link.name!=item.name){
            link.name+=" "+item.name;
            return;
        }
        list.push(item);
    };
    this.getList=function(){
        return list;
    };
};