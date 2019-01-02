(function(){

    var EventUtil={
        //封装事件工具函数
        addHandler:function(element,type,handler){
            var handle;
            element.addEventListener?handle=element.addEventListener(type,handler,false):
            element.attachEvent?handle=element.attachEvent("on"+type,handler):
            element['on'+type]=handler
            return handle
        },
        removeHandler:function(element,type,handler){  //取消事件
            if(element.removeEventListener){
               element.removeEventListener(type,handler,false);
            }else if(element.detachEvent){
               element.detachEvent("on"+type,handler);
            }else{
               element["on"+type]=null;
            }
        },
        getEvent:function(event){
            return event?event:window.event
        },
        getTarget:function(e){
            return e.target||e.srcElement
        },
        preventDefault:function(e){
            e.preventDefault ? e.preventDefault():e.returnValue=false
            
        },
        stopPropagation:function(e){
            e.stopPropagation?e.stopPropagation():e.cancelBubble=true
        },
        getRalatedTarget:function(e){
            return e.relatedTarget? e.relatedTarget:
            e.toElement? e.toElement:
            e.fromElement?e.fromElement:null
        },
        getButton:function(event){    //获取mousedown或mouseup按下或释放的按钮是鼠标中的哪一个
            if(document.implementation.hasFeature("MouseEvents","2.0")){
               return event.button;
            }else{
               switch(event.button){   //将IE模型下的button属性映射为DOM模型下的button属性
                  case 0:
                  case 1:
                  case 3:
                  case 5:
                  case 7:
                     return 0;  //按下的是鼠标主按钮（一般是左键）
                  case 2:
                  case 6:
                     return 2;  //按下的是中间的鼠标按钮
                  case 4:
                     return 1;  //鼠标次按钮（一般是右键）
               }
            }
         },
              
         getWheelDelta:function(event){ //获取表示鼠标滚轮滚动方向的数值
            if(event.wheelDelta){
               return event.wheelDelta;
            }else{
               return -event.detail*40;
            }
         },
              
         getCharCode:function(event){   //以跨浏览器取得相同的字符编码，需在keypress事件中使用
            if(typeof event.charCode=="number"){
               return event.charCode;
            }else{
               return event.keyCode;
            }
         }
    }
    function clearElem(arr){
        var temp=arr.concat()
        temp.forEach(function(item,index){
            arr.splice(0,1)
        })
        return arr
    }

    function randRange(start,end){
        if(start>end) throw new Error('start cant smaller than end')
        var num=Math.floor(Math.random()*1000)
        while(!(num>=start&&num<=end)){
            num=Math.floor(Math.random()*1000)
        }
        return num
    }

    function randomEmoji(){
        //随机生成表情
        var emojis=['(❤ ω ❤)','O(∩_∩)O','😘','😝','(ง •_•)ง','(●ˇ∀ˇ●)','🧡']
        var index=randRange(0,emojis.length-1)
        return emojis[index]
    }
   
    function randomColor(){
        //随机生成颜色
        var colorString='#'
        for(var i=0;i<3;i++){
            colorString+=randRange(0,255).toString(16)
        }
        return colorString
    }


    function createHeart(posx,posy,interval){
        //制造💗
        var heart=document.createElement('div')
        var color=randomColor()
        if(interval===0){
            var emoji=randomEmoji()
        }else{
            var emoji='💖'
        }
        
        heart.classList.add('heart')
        heart.innerText=emoji
        heart.style.color=color  
        heart.style.left=posx+'px'
        heart.style.top=posy+'px'
        return heart
    }

    function move(elem,y){
        elem.style.top=y+'px'
    }
    function disappear(elem){
        document.body.removeChild(elem)
    }
    function changeStyle(elem,stylename,st){
        elem.style[stylename]=st
    }
    function getInterval(start,end){
        return end-start
    }

    function fade(elem,curHeight){
        var target=curHeight-100
        var opc=100
        var tid=setInterval(function(){
            move(elem,curHeight--)
            opc--
            changeStyle(elem,'opacity',opc*0.01)
            if(curHeight===target){
                disappear(elem)
                clearInterval(tid)
            }
        },10)
    }
    
    
    function bindEvent(){
        var start=parseInt((new Date).getTime()/1000)
        var trace=[]//存储运动轨迹坐标
        var movehandle;
        var clickhandle=function(e){
            var ev=e||window.event
            var interval=getInterval(start,parseInt((new Date).getTime()/1000))
            start=parseInt((new Date).getTime()/1000)//更新上一次时间
            var heart=createHeart(ev.clientX,ev.clientY,interval)
            document.body.appendChild(heart)  
            var curHeight = ev.clientY
            fade(heart,curHeight)
        }
        EventUtil.addHandler(document,'click',clickhandle)
        var downhandle=function(e){
            var e=EventUtil.getEvent(e)
            var button=EventUtil.getButton(e)
            //只有鼠标左键按下才执行动作
            if(button===0){
                movehandle=function(e){
                    trace.push({
                        'x':e.clientX,
                        'y':e.clientY
                    })
                }
                EventUtil.addHandler(document,'mousemove',movehandle)
            }
            
        }
        EventUtil.addHandler(document,'mousedown',downhandle)

        var uphandle=function(e){
            var ev=EventUtil.getEvent(e)
            trace.forEach(function(item,index){
                if(index%4===0){
                    var heart=createHeart(item.x,item.y,1)
                    document.body.appendChild(heart)  
                    var curHeight = item.y
                    fade(heart,curHeight)
                }
            })
            clearElem(trace)
            EventUtil.removeHandler(document,'mousemove',movehandle)
        }
        EventUtil.addHandler(document,'mouseup',uphandle)

    }
    bindEvent()
    EventUtil.addHandler(document,'selectstart',function(e){
        e.preventDefault()
    })
})()




