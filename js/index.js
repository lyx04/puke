$(function(){
	var dict={
		1:'A',
		2:2,
		3:3,
		4:4,
		5:5,
		6:6,
		7:7,
		8:8,
		9:9,
		10:'T',
		11:'J',
		12:'Q',
		13:'K'
	}
	function markpu(){
		var pu=[]
		//{color:,number:}
		var colors=['h','s','c','d']
		var biao={}
		
		while(pu.length!==52){
			var c = colors[Math.floor(Math.random()*4)]
			var n = Math.ceil(Math.random()*13)
				var v={
					color:c,
					number:n
				}
				if(!biao[c+n]){
					pu.push(v)
					biao[c+n]=true
				}
		}
		return pu
	}
	function setpu(pu){
		var index=0;
		for(var i=0;i<7;i++){
			for(var j=0;j<i+1;j++){
				var v=pu[index]
				index+=1
				$("<div>").attr("id",i+"_"+j).addClass("pai").attr("dom-num",v.number).attr('dd',i+"_"+j)
			.css(
				'background-image',"url(image/"+dict[v.number]+v.color+".png)"
				)
			.delay(index*30)
			//第一行距离左边6张扑克牌长度的一半
			//第二行距离左边5张扑克牌长度的一半
			.animate({
				top:i*40,//每行都多出40来
				// left:j*130,//每个扑克相对于左边多出j倍的130
				// left:j*130+65*(6-i),//每行扑克牌距离左边都是下一行第一个扑克牌距左边加被选择的下一行第一个扑克牌的一般
				left:j*130+65*(6-i)+65,
				opacity:1
			})
			.appendTo(".scene")
			}
		}
		for(;index<pu.length;index++){
			var v=pu[index]
			index+=1
			$("<div>").attr("dom-num",v.number).addClass("pai right").attr('dd',i+"_"+j)
			.css(
				'background-image',"url(image/"+dict[v.number]+v.color+".png)"
				)
			.delay(index*30)
			.animate({
				top:410,
				left:240,
				opacity:1
			})
			.appendTo(".scene")
		}
		}
	// setpu(markpu())
	var index=1;
	var number=0;
	var right=$(".btn .move-right")
	var left=$(".btn .move-left")
	$(".btn").on("mousedown",false)
		right.on("click",function(){
			index++
			$(".right").last()
			.css("zIndex",index)
			.animate({
				left:700,
			})
			.queue(function(){
				$(this).removeClass("right").addClass("left")
				.dequeue()
			})
		})

		left.on("click",function(){
			if($(".right").length){
				return
			}
			if(number>=3){
				return
			}
			number++
			//看arguments  2.this的指向
			//jQuery回调函数中的this大部分情况下是指向集合中一个(DOM)元素
			$(".left").each(function(i){
			$(this)
			.css("zIndex",0)
			.delay(i*50)
			.animate({
				left:240
			}).queue(function(){
				$(this).removeClass("left").addClass("right").dequeue()
			})
				})		
		})
		function getNumber(el){
			return parseInt($(el).attr("dom-num"))
		}
		function isCanClick(el){
			//
			var x = parseInt($(el).attr("id").split("_")[0])
			var y = parseInt($(el).attr("id").split("_")[1])
			if($("#"+(x+1)+"_"+y).length||$("#"+(x+1)+"_"+(y+1)).length){
				return false
			}else{
				return true
			}
		}
		var prev=null
	$(".scene").on("click",".pai",function(){
		if($(this).attr("dd")=="7_7"&&$(this).attr("class")=="pai right"){
			return
		}
		$(this).stop()
		//点击的这个有id这个属性，并且他的底下还有牌
		if($(this).attr("id")&&!isCanClick(this)){
			return
		}
		if($(prev).attr("dd")==$(this).attr("dd")){
			$(this).animate({
			top:"+=15"
			})
			prev=null
			return
		}else{
			$(this).animate({
			top:"-=15"
			})
		}
		//怎么判断prev的值
		//判断是否被压住，如果被压住直接返回
		//如果是13直接消除 函数返回
		//如果不是13 第一张 把这张存储
		//第二张 上次存储的和现在点的这张拿出来判断
		if(prev){
			if(getNumber(prev)+getNumber(this)==13){
				prev.add(this).animate({
					top:0,
					left:100,
				}).queue(function(){
					$(this).detach().dequeue()
					return
				})
				prev=null
			}else{
				prev.delay(400).animate({
					top:"+=15"
				})
				$(this).animate({
					top:"+=15"
				})
				prev=null
				return
			}	
		}else{
			prev=$(this)
		}

		if(getNumber(this)==13){
			$(this).animate({
					top:0,
					left:100,
			}).queue(function(){
				$(this).detach().dequeue()
				return
			})
		}	
	})
	$("ul").on("mousedown",false)
	$(".go .one").on("click",function(){
		clearInterval(t)
		t=setInterval(move,1000)
		$(".scene div").detach()
		setpu(markpu())
	})
	$(".go .two").on("click",function(){
		$(".scene div").animate({
			top:0,
			left:700,
			opacity:0
		}).delay(400).queue(function(){
			$(this).detach().dequeue()
		})
	})
	$(".go .three").on("click",function(){
		$(".scene div").animate({
			top:0,
			left:700,
			opacity:0
		}).delay(400).queue(function(){
			$(this).detach().dequeue()
		})
		setpu(markpu())
	})
	var time=$(".time")
	var s=60;
	var f=2;
	var t
	function move(){
		s-=1;
		if(f==0&&s==-1){
			alert("很失望，时间耗尽")
			clearInterval(t)
			$(".scene div").detach()
			return

		}
		if(s==-1){
			f-=1
			s=10
		}
		time.text(f+"分"+s+"秒")
	}
})
