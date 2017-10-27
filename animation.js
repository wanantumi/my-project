function Task(div,stepL,stepT){
	this.div=div;
	this.stepL=stepL;
	this.stepT=stepT;
}
var animation={
	DURATION:800,//动画总时长
	STEPS:200,
	interval:0,
	timer:null,
	moved:0,
	CSIZE:100,
	OFFSET:16,
	tasks:[],
	init:function(){
		this.interval=this.DURATION/this.STEPS;
	},
	addTask:function(endr,endc,startr,startc){//将要移动的div和步长添加到数组
		var div=document.getElementById("c"+startr+startc);//找到id为c+startr+startc的div
		var stepL=
			(endc-startc)*(this.CSIZE+this.OFFSET)/this.STEPS;
		var stepT=
			(endr-startr)*(this.CSIZE+this.OFFSET)/this.STEPS;
		this.tasks.push(new Task(div,stepL,stepT));
	},
	play:function(callback){
		//启动周期性定时器，设置任务为playStep，时间间隔为interval，序号保存在timer中
		this.timer=setInterval(
			this.playStep.bind(this,callback),this.interval	
		);
	},
	playStep:function(callback){
		//遍历tasks中每项任务
			//获得当前任务的div的left为style的left转为浮点数+当前任务的stepL
			//设置当前任务的div的step为style的top转为浮点数+当前任务的stepT
		//遍历结束
		//将moved+1
		//如果moved等于STEPS
			//停止计时器，清除timer，moved归0
			//遍历tasks中每个task
				//清除当前task的div的left和top
			//重置tasks数组为空数组
			//调用callback	
		for(var i=0;i<this.tasks.length;i++){
			var div=this.tasks[i].div;
			var style=getComputedStyle(div);
			div.style.left=parseFloat(style.left)+this.tasks[i].stepL+"px";
			div.style.top=parseFloat(style.top)+this.tasks[i].stepT+"px";
		}
		this.moved++;
		if(this.moved==this.STEPS){
			clearInterval(this.timer);
			this.timer=null;
			this.moved=0;
			for(var n=0;n<this.tasks.length;n++){
				var div=this.tasks[n].div;
				div.style.left="";
				div.style.top="";
			}
			this.tasks=[];
			callback();
		}
	}
}
animation.init();