var DataCenter=function(){
    var attrList=ATTRS;
    var list=dataList;
    var itemList={};
    var attrNodeList={};
    var nodeList={};
    var self=this;
    this.getCategoryList=function(){
        return attrList;
    };
    this.getListByCategory=function(cate){
        var ret={type:"force",seriesName:cate,categories:[],links:[],nodes:[]};
        ret.categories=[{
            name:"0",
            itemStyle:{
                normal: {
                    color : '#ff7f50',
                    label:{
                        position:"inside"
                    }
                }
            }
        },{
            name:"1",
            itemStyle:{
                normal: {
                    color : '#ff7f50',
                    label:{
                        position:"inside"
                    }
                }
            }
        },{
            name:"2",
            itemStyle:{
                normal: {
                    color : '#ff7f50'
                }
            }
        }];
        var nodes=new NodeList();
        var links=new LinkList();
        var attrs=attrNodeList[cate];
        var rootNode=nodes.addNode({
            category:"0",
            name:cate,
            value:1
        });
        for(var key in attrs){
            var node=nodes.addNode({
                category:"1",
                name:key,
                value:1
            });
            links.addLink({
                source:node.index,
                target:rootNode.index,
                weight:1
            });
            for(var m in attrs[key]){
                var item=nodeList[attrs[key][m]];
                item.value=1;
                var mnode=nodes.addNode(item);
                links.addLink({
                    source:mnode.index,
                    target:node.index
                });
            }
        }
        /*for(var i=0;i<attrList[cate].length;i++){
            ret.nodes.push({
                category:"1",
                name:attrList[cate][i],
                value:1
            });
            ret.links.push({
                source:i+1,
                target:0,
                weight:1
            });
        }
        var index=ret.nodes.length;
        for(var i=0;i<list.length;i++){
            var item=list[i];
            if(typeof item.attrs[cate]!="undefined" && item.attrs[cate]!=null){
                ret.nodes.push({
                    category:"2",
                    name:item.name,
                    value:1
                });
                ret.links.push({
                    source:index,
                    target:item.attrs[cate]+1,
                    weight:2
                });
                index++;
            }
        }*/
        ret.nodes=nodes.getList();
        ret.links=links.getList();
        return ret;
    };
    this.getLegend=function(){
        var ret=[];
        for(var key in attrList){
            ret.push(key);
        }
        ret.push("人物关系");
        return ret;
    };
    this.getRelationList=function(mainer){
        var ret={type:"force",seriesName:"人物关系",categories:[],links:[],nodes:[]};
        var nodes=new NodeList();
        var links=new LinkList();
        for(var key in attrList){
            ret.categories.push({name:key});
        }
        ret.categories.push({name:"mainer"});
        var mainer=nodeList[mainer];
        mainer.category=ret.categories.length-1;
        var deepList=this.getListByTarget(mainer,nodes,links);
        for(var key in deepList){
            this.getListByTarget(deepList[key],nodes,links);
        }
        ret.nodes=nodes.getList();
        ret.links=links.getList();
        return ret;
    };
    this.getListByTarget=function(target,nodes,links){
        var tname=target.name;
        var tNode=nodes.addNode(target);
        var deepList={};
        for(var key in target.attrNodes){
            var attrnodes=target.attrNodes[key];
            var relation=attrList[key][target.attrs[key]];
            for(var m in attrnodes){
                var snode=nodeList[attrnodes[m]];
                if(!nodes.inList(snode.name)){
                    snode=nodes.addNode(snode);
                    snode.category=key;
                    deepList[snode.name]=snode;
                    links.addLink({source:snode.index,target:target.index,name:relation});
                }else{
                    snode=nodes.getNode(snode.name);
                }
                
            }
        }
        return deepList;
    };
    var initialize=function(){
        for(var i=0;i<list.length;i++){
            var item=list[i];
            for(var key in item.attrs){
                var v=item.attrs[key];
                var c=attrList[key][v];
                attrNodeList[key]=!!attrNodeList[key]?attrNodeList[key]:{};
                attrNodeList[key][c]=!!attrNodeList[key][c]?attrNodeList[key][c]:[];
                attrNodeList[key][c].push(item.name);
            }
            item.index=i;
            item.value=10;
            nodeList[item.name]=item;
        }
        for(var key in nodeList){
            var item=nodeList[key];
            item.attrNodes={};
            for(var key in item.attrs){
                var v=item.attrs[key];
                var c=attrList[key][v];
                var nodes=attrNodeList[key][c];
                item.attrNodes[key]=nodes;
            }
        }
    };
    initialize();
};