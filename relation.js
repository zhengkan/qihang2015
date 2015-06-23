var Relation=function(conf){
    var config=conf;
    var myChart=null;
    var self=this;
    var option=null;
    var dataCenter=new DataCenter();
    this.initOption=function(selectedLengend){
        var selected={};
        var legend=dataCenter.getLegend();
        var sel=selectedLengend || legend[0];
        for(var i=0;i<legend.length;i++){
            if(sel==legend[i]){
                selected[legend[i]]=true;
            }else{
                selected[legend[i]]=false;
            }
            
        }
        option={    
            title : {
                text: '人物关系：启航15年二期',
                subtext: '数据来自百度',
                x:'right',
                y:'bottom'
            },
            tooltip : {
                trigger: 'item',
                formatter: '{a} : {b}'
            },
            toolbox: {
                show : true,
                feature : {
                    restore : {show: true},
                    magicType: {show: true, type: ['force']},
                    saveAsImage : {show: true}
                }
            },
            legend: {
                x: 'left',
                data:dataCenter.getLegend(),
                selected:selected
            },
            series : []
        };
        var list=dataCenter.getCategoryList();
        for(var key in list){
            var ret=null;
            ret=dataCenter.getListByCategory(key);
            option.series.push(this.createSeries(ret));
        }
        var ret=dataCenter.getRelationList("高世钢");
        option.series.push(this.createSeries(ret));
    };
    this.createSeries=function(ret){
        return {
            type:ret.type,
            name : ret.seriesName,
            ribbonType: false,
            categories : ret.categories,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            color: '#333'
                        },
                        position:"bottom"
                    },
                    nodeStyle : {
                        brushType : 'both',
                        borderColor : 'rgba(255,215,0,0.4)',
                        borderWidth : 1
                    },
                    linkStyle: {
                        type: 'curve'
                    }
                },
                emphasis: {
                    label: {
                        show: false
                    },
                    nodeStyle : {
                    },
                    linkStyle : {}
                }
            },
            useWorker: true,
            minRadius : 15,
            maxRadius : 50,
            steps: 10,
            gravity: 1.1,
            scaling: 1.2,
            roam: 'move',
            large:true,
            nodes:ret.nodes,
            links : ret.links
        };
    };
    this.switchMainer=function(name){
        var ret=dataCenter.getRelationList(name);
        var series=this.createSeries(ret);
        for(var i=0;i<option.series.length;i++){
            if(option.series[i].name=="人物关系"){
                option.series[i]=series;
                break;
            }
        }
    };
    this.switchLegend=function(name){
        var selected={};
        var legend=dataCenter.getLegend();
        var sel=name || legend[0];
        for(var i=0;i<legend.length;i++){
            if(sel==legend[i]){
                selected[legend[i]]=true;
            }else{
                selected[legend[i]]=false;
            }
            
        }
        option.legend.selected=selected;
        myChart.clear();
        myChart.setOption(option);
    };
    var initialize=function(){
        self.initOption();
        require.config({
            paths: {
                echarts: 'http://echarts.baidu.com/build/dist'
            }
        });
        require(['echarts','echarts/config','echarts/chart/force'],function(ec,ecConfig) {
                myChart = ec.init(config.container);
                myChart.on(ecConfig.EVENT.LEGEND_SELECTED,function(param){
                    self.switchLegend(param.target);
                });
                myChart.on(ecConfig.EVENT.DBLCLICK, function(param){
                    self.switchMainer(param.name);
                    self.switchLegend("人物关系");
                });
                myChart.setOption(option); 
            }
        );
    };
    initialize();
};