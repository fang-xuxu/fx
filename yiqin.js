// 这是测试
//test23
var res=[];
var jishu = 0;
var num = 0;
var htmlStr = "";
var time = document.getElementById('time');
var info = document.getElementById('info');
var change = document.getElementById('change');
var Maptitle = document.getElementById('Maptitle');

var cityname = [];
var cityeconNum = [];
var cityeconNumaccount = []
Maptitle.innerHTML = "今日确诊";
window.onload=function(){
    $.ajax({
        url:"http://news.sina.com.cn/project/fymap/ncp2020_full_data.json"
        ,dataType:"jsonp",
        jsonpCallback:"jsoncallback",
        success:function(y){
            var jj=[];
            jj.push(y);
            console.log(jj)
            res=jj;
     console.log(res)
     //绘制各省市当日疫情境外输入的人数
     var jwsrname=[]
     var jwsrvalue=[]
     res[0].data.jwsrTop.forEach(element5=>{
         jwsrname.push(element5.name);
         jwsrvalue.push(element5.jwsrNum)
     });
     
     var myChartjwsr = echarts.init(document.getElementById('jwsr'));
     optionjwsr = {
         tooltip: {
             trigger: 'axis',
             axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                 type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
             }
         },
         title: {
             text: '当日境外输入疫情数据',
             left: 'center'
         },
         grid: {
             left: '3%',
             right: '4%',
             bottom: '3%',
             containLabel: true
         },
         xAxis: [
             {
                 type: 'category',
                 data: jwsrname,
                 axisTick: {
                     alignWithLabel: true
                 }
             }
         ],
         yAxis: [
             {
                 type: 'value'
             }
         ],
         series: [
             {
                 name: '境外输入',
                 type: 'bar',
                 barWidth: '60%',
                 data: jwsrvalue
             }
         ]
     };
     myChartjwsr.setOption(optionjwsr);  
     //(1)获取每个省市的当日现有确诊人数和累计人数
     var city_econNum = [];
     var city_econNum_account = [];
     var ccity_econNum = [];
     var ccity_econNum_account = [];
     res[0].data.list.forEach(element => {
         var city_econNum_c = {
             name: element.name,
             value: element.econNum
         };
         var city_econNum_a = {
             name: element.name,
             value: element.value
         };
         //将获取到的各个省和直辖区的当日确诊人数打包成对象放进数组中
         city_econNum.push(city_econNum_c);
         //将获取到的各个省和直辖区的累计确诊人数打包成对象放进数组中
         city_econNum_account.push(city_econNum_a)
 
     });
 
     //console.log(city_econNum_account)
 
 
     //1.获取数据
     // console.log(res[0].data.list[0].name);
     var allData = res[0].data;
     var historylist = allData.historylist;
     //2.设置时间
     //console.log(allData.cachetime);
     time.innerHTML = allData.cachetime + "疫情可视化展示";
 
 
 
     //3.设置详情信息
     (function () {
         var infoConfig = {
             "cn_econNum": {
                 "title": "现有确诊",
                 "color": "#ff5e49"
             },
             "cn_asymptomNum": {
                 "title": "无症状",
                 "color": "#fe653b"
             },
             "cn_susNum": {
                 "title": "现有疑似",
                 "color": "#fe8d00"
             },
             "cn_heconNum": {
                 "title": "现有重症",
                 "color": "#525498"
             },
             "cn_conNum": {
                 "title": "累计确诊",
                 "color": "#ff0910"
             },
             "cn_jwsrNum": {
                 "title": "境外输入",
                 "color": "#356ea0"
             },
             "cn_cureNum": {
                 "title": "累计治愈",
                 "color": "#00b1b7"
             },
             "cn_deathNum": {
                 "title": "累计死亡",
                 "color": "#356ea0"
             }
         };
         var ttitle=[];
         
         for (var k in infoConfig) {
             //console.log(k)
             var txt={
                 value:historylist[0][k],
                 name: infoConfig[k].title
                  };
                  ttitle.push(txt);
            
            console.log(historylist[0][k]);
             htmlStr +=
                 `
                 <li>
                     <h5>${infoConfig[k].title}</h5>
                     <p style="color:${infoConfig[k].color}">${historylist[0][k]}</p>
                     <span>
                         <em>昨日:</em>
                         <i style="color:${infoConfig[k].color}">
                             ${historylist[0][k] - historylist[1][k]}
                             </i>
                         </span>
                     </li>
             `
         };
         var myChartrange = echarts.init(document.getElementById('range'));
         //绘制饼图
         optionrange = {
             title: {
                 text: '当日疫情数据',
                 left: 'center'
             },
             tooltip: {
                 trigger: 'item'
             },
             legend: {
                 orient: 'vertical',
                 left: 'left',
             },
             series: [
                 {
                     name: '访问来源',
                     type: 'pie',
                     radius: '50%',
                     data:ttitle,
                     emphasis: {
                         itemStyle: {
                             shadowBlur: 10,
                             shadowOffsetX: 0,
                             shadowColor: 'rgba(0, 0, 0, 0.5)'
                         }
                     }
                 }
             ]
         };
 
         myChartrange.setOption(optionrange);
         info.innerHTML = htmlStr;
     })();
    // console.log(info)
 //
 
     var myChart = echarts.init(document.getElementById('MAP'));
     var optionMap = {
 
         geo: {
             map: "china",
             zoom: 1.2,
             itemStyle: {
                 areaColor: "#fff",
                 borderColor: "#666",
 
             },
             label: {
                 show: true,
                 fontsize: 8
             },
             emphasis: {
                 itemStyle: {
                     areaColor: "#b4ffff",
                 }
             },
 
 
         },
         series: [{
             type: "map",
             geoIndex: 0,
             data: city_econNum
         }],
         visualMap: {
             type: 'piecewise',
             pieces: [
                 { min: 0, max: 0, label: "0", color: "#fff" },
                 { min: 1, max: 99, label: "1-99", color: "#ffe4da" },
                 { min: 100, max: 199, label: "100-199", color: "#ff937f" },
                 { min: 200, max: 299, label: "200-299", color: "#ff6c5e" },
                 { min: 300, max: 399, label: "300-399", color: "#ff3335" },
                 { min: 400, label: "≥400", color: "#cd0000" },
             ],
             itemWidth: 10,
             itemHeight: 10,
             itemGap: 1,
             inverse: false
         },
         tooltip: {
             show: true,
             formatter: function (param) {
                 return `
                 <section style="display:flex;align-items:center;position:relative;z-index:1111">
                     <div style="padding:0px 10px;font-size:12px">地区:${param.name}</br>${font}:${param.value}</br>
                        
                         </div>
                     
                     </section>
                 
                 `
             },
             trigger: "item",
 
             padding: 3,
             enterable: true,
         },
 
 
 
     };
 
     //一. 使用刚指定的配置项和数据显示图表。
     var font = "今日确诊"
     myChart.setOption(optionMap);
     myChart.on('click', function (params) {//点击事件
         if (params.componentType === 'series') {
 
 
             // if(params.name==res[0].data.list[0].name){
             //     alert("dddd")
             // }
             //二.获取被点击的板块的省的各城市的当日疫情情况
             res[0].data.list.forEach((element, index) => {
                 // console.log(index)
                 if (params.name == res[0].data.list[index].name) {
                     console.log(element.city);
 
                     element.city.forEach((element2) => {
 
 
                         console.log(element2.econNum)
                         var city_econNum_c = {
                             name: element2.name,
                             value: element2.conNum
                         };
                         var city_econNum_a = {
                             name: element2.name,
                             value: element2.econNum
                         };
 
                         //将获取到的各个省的各个城市当日确诊人数打包成对象放进数组中
                         ccity_econNum.push(city_econNum_a);
                         //将获取到的各个省和的各个城市累计确诊人数打包成对象放进数组中
                         ccity_econNum_account.push(city_econNum_c)
 
                     })
                     //console.log(ccity_econNum_account)
                 }
             })
             // console.log(params);
             console.log(res[0].data.list)
             //绘制折线图
             ccity_econNum.forEach(element3 => {
                 cityname.push(element3.name);
                 cityeconNum.push(element3.value)
 
             });
             ccity_econNum_account.forEach(element4 => {
                 cityeconNumaccount.push(element4.value)
             })
             var mybar = echarts.init(document.getElementById('bar'));
             var optionbar = {
                 title: {
                     text: params.name + font + "柱状图",
                     left: 'center'
                 },
                 xAxis: {
                     type: 'category',
                     data: cityname
                 },
                 yAxis: {
                     type: 'value'
                 },
                 series: [{
                     data: cityeconNum,
                     type: 'bar'
                 }],
                 tooltip: {
                     show: true,
                     formatter: function (paramd) {
                         return `
                     <section style="display:flex;align-items:center;position:relative;z-index:1111">
                     <div style="padding:0px 10px;font-size:12px">地区:${paramd.name}</br>${font}:${paramd.value}</br>
                        
                         </div>
                     
                     </section>
                 
                 `
                     },
                     trigger: "item",
 
                     padding: 3,
                     enterable: true,
                 },
             };
             mybar.setOption(optionbar);
 
         };
         if (jishu == 1) {
             //alert(jishu)
             optionbar.series[0].data = cityeconNumaccount;
             mybar.setOption(optionbar);//实时更新数据绘图
         } else {
             // alert(jishu)
             optionbar.series[0].data = cityeconNum;
 
             mybar.setOption(optionbar);//实时更新数据绘图
         }
 
         ccity_econNum = [];
         ccity_econNum_account = [];
         cityname = [];
         cityeconNum = [];
         cityeconNumaccount = []
     })
     //btn事件,点击btn后将地图的数据切换成当日确诊或累计确诊
     change.onclick = function () {
 
         if (jishu == 0) {
             optionMap.series[0].data = city_econNum_account;
             jishu = 1;
             font = "累计确诊人数";
             Maptitle.innerHTML = "累计确诊人数";
 
         } else {
 
             optionMap.series[0].data = city_econNum;
             jishu = 0;
             font = "今日确诊人数";
             Maptitle.innerHTML = "今日确诊人数"
         }
        // console.log(jishu);
        // console.log(optionMap.series[0].data);
         myChart.setOption(optionMap);
     }
 //
 
     //获取日期及当日的疫情情况
    var myChartdate1 = echarts.init(document.getElementById('date1'));
 
 
     var cn_conNum=[]//对应的日期累计确诊人数
     var ymd=[]//对应的日期
     var cn_deathNum=[]//对应的日期的累计总死亡人数
     var cn_econNum=[]//对应的日期现有确诊人数
     var cn_cureNum=[]//对应日期的累计治愈人数
 
     //console.log(res[0].data.historylist[0].ymd);//对应的日期确诊人数
     //console.log(res[0].data.historylist[0])//今日确诊
 
 
     res[0].data.historylist.forEach(element6=>{
        // console.log(element6.ymd)
         cn_conNum.push(element6.cn_conNum);
        
         ymd.push(element6.ymd);
       
         cn_deathNum.push(element6.cn_deathNum);
         
         cn_econNum.push(element6.cn_econNum);
        
         cn_cureNum.push(element6.cn_cureNum);
         
     })
     cn_cureNum=cn_cureNum.reverse()
     cn_conNum=cn_conNum.reverse();
     cn_deathNum=cn_deathNum.reverse();
     cn_econNum=cn_econNum.reverse();
     ymd=ymd.reverse();
     //ymd.splice(0,0,"年月日");
     //console.log(ymd);
     // cn_conNum.splice(0,0,"累计确诊");
     // cn_deathNum.splice(0,0,"累计死亡");
     // cn_econNum.splice(0,0,"现有确诊");
     // cn_cureNum.splice(0,0,"累计治愈");
     
    var optiondata1 = {
         title: {
             text: ymd[0]+"—"+ymd[ymd.length-1]+"中国疫情数据统计"
         },
         tooltip: {
             trigger: 'axis'
         },
         legend: {
             data: ['累计确诊', '累计死亡', '现有确诊', '累计治愈']
         },
         grid: {
             left: '3%',
             right: '4%',
             bottom: '3%',
             containLabel: true
         },
         
         xAxis: {
             type: 'category',
             boundaryGap: false,
             data:ymd
         },
         yAxis: {
             type: 'value'
         },
         series: [
             {
                 name: '累计确诊',
                 type: 'line',
                 stack: '总量',
                 data: cn_conNum
             },
             {
                 name: '累计死亡',
                 type: 'line',
                 stack: '总量',
                 data:cn_deathNum
             },
             {
                 name: '现有确诊',
                 type: 'line',
                 stack: '总量',
                 data: cn_econNum
             },
             {
                 name: '累计治愈',
                 type: 'line',
                 stack: '总量',
                 data: cn_cureNum
             }
         ]
     };
     myChartdate1.setOption(optiondata1);
 


        }
    })
}
   


//console.log(jishu)






