function Task(div,stepL,stepT){
this.div=div; this.stepL=stepL; this.stepT=stepT;
}
var animation={
  DURATION:1000, STEPS:200,moved:0,
  interval:0, timer:null, 
  CSIZE:100, OFFSET:16,
  tasks:[],
  init:function(){
    this.interval=this.DURATION/this.STEPS;
  },
  //将要移动的div和步长添加到数组
  addTask:function(endr,endc,startr,startc){
    var div=//找到id为c+startr+startc的div;
      document.getElementById("c"+startr+startc);
    var stepL=//计算起始到目标的总距离再/步数
      (endc-startc)*(this.CSIZE+this.OFFSET)
      /this.STEPS;
    var stepT=//计算起始到目标的总距离再/步数
      (endr-startr)*(this.CSIZE+this.OFFSET)
      /this.STEPS;
    this.tasks.push(new Task(div,stepL,stepT));
  },
  play:function(callback){
    //启动周期型定时器，设置任务为playStep,同时绑定this，同时绑定参数callback，时间间隔为interval, 序号保存在timer中
    this.timer=setInterval(
      this.playStep.bind(this,callback),
      this.interval
    );
  },
  playStep:function(callback){
    //遍历tasks中每项task
    for(var i=0;i<this.tasks.length;i++){
      var div=this.tasks[i].div;
      //获得当前task的div计算后的样式，保存在style中
      var style=getComputedStyle(div);
      //设置当前task的div的left为style的left转为浮点数+当前task的stepL
      div.style.left=parseFloat(style.left)+this.tasks[i].stepL+"px";
      //设置当前task的div的top为style的top转为浮点数+当前task的stepT
      div.style.top=parseFloat(style.top)+this.tasks[i].stepT+"px";
    }//(遍历结束)
    this.moved++;//将moved+1
    //如果moved等于STEPS
    if(this.moved==this.STEPS){
      //停止定时器，清除timer，moved归0
      clearInterval(this.timer);
      this.timer=null;
      this.moved=0;
      //遍历tasks中每个task
      for(var i=0;i<this.tasks.length;i++){
        var div=this.tasks[i].div;
        //清除当前task的div的left
        div.style.left="";
        //清除当前task的div的top
        div.style.top="";
      }
      this.tasks=[];//重置tasks为空数组
      callback();//调用callback
    }
  }
}
animation.init();