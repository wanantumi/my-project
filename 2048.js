	function setCookie(cname,val){
		var date=new Date();
		date.setDate(date.getDate()+14);
		document.cookie=cname+"="+val+
			";expires="+date.toGMTString();
	}
	function getCookie(cname){
		var str=document.cookie;
		//在str中查找cname的位置i
		var i=str.indexOf(cname);
		//如果i!=-1
		if(i!=-1){
			//i+cname的字符个数+1
			i+=cname.length+1;
			//查找str中i之后下一个;的位置endi
			var endi=str.indexOf(";",i);
			//返回：截取str中i到endi的字符串
			return str.slice(i,endi!=-1?endi:str.length);
		}
	}
var game={
	data:null,//保存r行*c列的二维数组
	RN:4,
	CN:4,
	score:0,//保存当前得分
	top:0,//保存最高分
	state:1,//保存游戏状态
	RUNNING:1,
	GAMEOVER:0,
	PLAYING:2,
	//强调
	//对象自己的方法，用到对象自己的属性，必须加this
	//每个属性和方法之间，都要用逗号分隔
	start:function(){//启动游戏
		//得到保存在cookie中的最高分
		this.top=getCookie("top")||0;	
		this.score=0;//重置分数为0
		this.state=this.RUNNING;//重置游戏状态为运行
		//创建空数组，保存到data属性中
		this.data=[];
		for(var r=0;r<this.RN;r++){//r从0开始，到<RN结束
			this.data.push([]);//向data中压入一个空数组
			for(var c=0;c<this.CN;c++){//c从0开始，到<CN结束
				this.data[r].push(0);//向data中r行的子数组压入一个0
				/*console.log(this.data);*/
			}
		}
		//调用randomNum随机生成一个数
		this.randomNum();
		//调用randomNum随机生成一个数
		this.randomNum();
		this.updateView();
		//为页面绑定键盘按下
		document.onkeydown=function(e/*事件对象*/){
			//this默认->document，被bind替换为game
			//判断按键编号
			switch(e.keyCode){
				//是37就moveLeft
				case 37:this.moveLeft();break;
				//是38，就moveUP
				case 38:this.moveUp();break;
				//是39，就moveRight
				case 39:this.moveRight();break;
				//是40，就moveDown
				case 40:this.moveDown();break;
			}
		}.bind(this);
		console.log(this.data.join("\n"));
	},
	//在data中一个随机空位置，生成2或4
	randomNum:function(){
		//反复
		while(true){
			//在0~RN-1之间生成一个随机整数，保存在r中
			var r=parseInt(Math.random()*this.RN);
			//在0~CN-1之间生成一个随机整数，保存在c中
			var c=parseInt(Math.random()*this.CN);
			//如果data中r行c列为0
			if(this.data[r][c]==0){
				//将data中r行c列赋值为：
				this.data[r][c]=(Math.random()<0.5?2:4);
					//0~1随机生成一个小数，如果<0.5?就赋值为2，否则赋值为4
				break;//退出循环
			}	
		}
	},
	updateView:function(){//将data的数据更新到页面
		//遍历data
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				//查找id为"c"+r+c的div，保存在变量div中
				var div=document.getElementById("c"+r+c);
				//如果data中r行c列不是0
				if(this.data[r][c]!=0){
					//设置div的内容为data中r行c列的值
					div.innerHTML=this.data[r][c];
					//设置div的className属性为：
					div.className="cell n"+this.data[r][c];
						//"cell n"+data中r行c列的值
				}
				//否则
				else{
					//设置div的内容为""
					div.innerHTML="";
					//设置div的className属性为"cell"
					div.className="cell";
				}
			}
		}
		//找到id为score的div，设置其内容为score
		document.getElementById("score").innerHTML=this.score;
		//找到id为top的div，设置其内容为top
		document.getElementById("top").innerHTML=this.top;
		//找到id为gameOver的div，保存在变量gameOver中
		var gameOver=document.getElementById("gameOver");
		//如果游戏状态为GAMEOVER
		if(this.state==this.GAMEOVER){
			//设置gameOver的style的display为"block"
			gameOver.style.display="block";
			//找到id为fScore的span，设置其内容为score
			document.getElementById("fScore").innerHTML=this.score;
		}
		//否则
		else{gameOver.style.display="none";}
			//设置gameOver的style的display为"none"

	},
	moveLeft:function(){//左移所有行
		this.move(function(){
			for(var r=0;r<this.RN;r++){ 
				//调用moveLeftInRow左移第r行
				this.moveLeftInRow(r);
			}//遍历后
		}.bind(this));
	},
	moveLeftInRow:function(r){//左移第r行
		//遍历data中r行每个元素，到<CN-1
		for(var c=0;c<this.CN-1;c++){
			//调用getNextInRow查找data中r行c位置右侧下一个不为0的位置，保存在nextc中
			var nextc=this.getNextInRow(r,c);
			//如果 nextc等于-1，就退出循环
			if(nextc==-1){break;}
			//否则
			else{
				//如果data中r行c列的值为0
				if(this.data[r][c]==0){
					//将nextc位置的值替换c位置的值
					this.data[r][c]=this.data[r][nextc];
					animation.addTask(r,c,r,nextc);
												//目标  //起始
						//将nextc位置的值置为0
					this.data[r][nextc]=0;
						//c留在原地
					c--;
				}
				//否则，如果c位置的值等于nextc位置的值
				else if(this.data[r][c]==this.data[r][nextc]){
					//将c位置的值*2,
					this.data[r][c]*=2;
					animation.addTask(r,c,r,nextc);
					this.score+=this.data[r][c];
						//将nextc位置的值置为0
					this.data[r][nextc]=0;
				}
			}	
		}
	},
	//查找r行c列右侧下一个不为0的位置
	getNextInRow:function(r,c){
		//nextc从c+1开始，遍历data中r行的每个元素，到<CN结束
		for(var nextc=c+1;nextc<this.CN;nextc++){
			//如果nextc位置的值不为0
			if(this.data[r][nextc]!=0){return nextc;}
				//返回nextc
		}//遍历结束
			//返回-1
		return -1;
	},
	move:function(fun){
		if(this.state==this.RUNNING){
			var before=String(this.data);
			fun();//调用函数
			var after=String(this.data);
			//如果before!=after
			if(before!=after){
				this.state=this.PLAYING;
				animation.play(//如果希望主程序函数在动画之后执行，将函数匿名作为参数放在动画中回调
					function(){
						//调用randomNmu随机生成一个数
						this.randomNum();
						//如果游戏结束
							//就修改游戏状态为GAMEOVER
						if(this.isGameOver()){
							this.state=this.GAMEOVER;
							if(this.score>this.top){//如果score>top
								//设置cookie中的top变量，值为score
								setCookie("top",this.score);
							}
						}
						//更新页面
						this.updateView();
						this.state=this.RUNNING;
					}.bind(this)
				);//启动动画
			}	
		}
	},
	isGameOver:function(){
		//遍历data
		//如果当前元素是0
				//返回false
			//如果c<CN-1&&当前元素等于右侧元素
				//返回false
			//如果r<RN-1&&当前元素等于下方元素
				//返回false
		//遍历结束
		//true
		for(r=0;r<this.RN;r++){
			for(c=0;c<this.CN;c++){
				if(this.data[r][c]==0){return false;}
				if(c<this.CN-1&&this.data[r][c]==this.data[r][c+1])
				{return false;}
				if(r<this.RN-1&&(this.data[r][c]==this.data[r+1][c])){
					return false;
				}
			}
		}
		return true;
	},
	moveRight:function(){//右移所有行
		this.move(function(){
			for(var r=this.RN-1;r>=0;r--){ 
				//调用moveRightInRow右移第r行
				this.moveRightInRow(r);
			}//遍历后
		}.bind(this));
	},
	moveRightInRow:function(r){//左移第r行
		//反向遍历data中r行每个元素，到>0
		for(var c=this.CN-1;c>0;c--){
			//调用getPreInRow查找data中r行c位置左侧下一个不为0的位置，保存在prec中
			var prec=this.getPreInRow(r,c);
			//如果 prec等于-1，就退出循环
			if(prec==-1){break;}
			//否则
			else{
				//如果data中r行c列的值为0
				if(this.data[r][c]==0){
					//将prec位置的值替换c位置的值
					animation.addTask(r,c,r,prec);
					this.data[r][c]=this.data[r][prec];
						//将nextc位置的值置为0
					this.data[r][prec]=0;
						//c留在原地
					c++;
				}
				//否则，如果c位置的值等于prec位置的值
				else if(this.data[r][c]==this.data[r][prec]){
					//将c位置的值*2,
					this.data[r][c]*=2;
					animation.addTask(r,c,r,prec);
					this.score+=this.data[r][c];
						//将prec位置的值置为0
					this.data[r][prec]=0;
				}
			}	
		}
	},
	getPreInRow:function(r,c){
		//prc从c-1开始，遍历data中r行的每个元素，到>=0结束
		for(var prec=c-1;prec>=0;prec--){
			//如果prec位置的值不为0
			if(this.data[r][prec]!=0){return prec;}
				//返回prec
		}//遍历结束
			//返回-1
		return -1;
	},
	moveUp:function(){//上移所有行
		this.move(function(){
			for(var c=0;c<this.CN;c++){ 
				//调用moveUpInRow左移第r行
				this.moveUpInCol(c);
			}//遍历后
		}.bind(this));
	},
	moveUpInCol:function(c){
		for(var r=0;r<this.RN-1;r++){
			var nextr=this.getNextInCol(r,c);
			if(nextr==-1){break;}
			else{
				if(this.data[r][c]==0){
					animation.addTask(r,c,nextr,c);
					this.data[r][c]=this.data[nextr][c];
					this.data[nextr][c]=0;
					r--;
				}
				else if(this.data[r][c]==this.data[nextr][c]){
					this.data[r][c]*=2;
					animation.addTask(r,c,nextr,c);
					this.score+=this.data[r][c];
					this.data[nextr][c]=0;
				}
			}	
		}
	},
	getNextInCol:function(r,c){
		for(var nextr=r+1;nextr<this.RN;nextr++){
			if(this.data[nextr][c]!=0){return nextr;}
		}
		return -1;
	},
	moveDown:function(){
		this.move(function(){
			for(var c=this.CN-1;c>=0;c--){
				this.moveDownInCol(c);
			}
		}.bind(this));
	},
	moveDownInCol:function(c){
		for(var r=this.RN-1;r>0;r--){
			var prer=this.getPreInCol(r,c);
			if(prer==-1){break;}
			else{
				if(this.data[r][c]==0){
					animation.addTask(r,c,prer,c);
					this.data[r][c]=this.data[prer][c];
					this.data[prer][c]=0;
					r++;
				}
				else if(this.data[r][c]==this.data[prer][c]){
					this.data[r][c]*=2;
					animation.addTask(r,c,prer,c);
					this.score+=this.data[r][c];
					this.data[prer][c]=0;
				}
			}
		}
	},
	getPreInCol:function(r,c){
		for(var prer=r-1;prer>=0;prer--){
			if(this.data[prer][c]!=0){return prer;}
		}
		return -1;
	},

};
//页面加载后，自动启动游戏
window.onload=function(){
	game.start();
	console.dir(animation.tasks);
}
