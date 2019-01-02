/*
在蓝色理想看到的网友提问, 闲来无事做了一下
 要求：
 1) 任意输入行数或列数, 生成对应表格;
 2) 行数, 列数必须为正整数类型, 否则提示非法;(这里我用正则限制1-100, 避免网友测试输入过大值造成浏览器假死)
 3) 在生成表格的单元格中随机填入1到15之间的随机数, 并给每个单元格设置随机背景颜色;
 4) 点击任意单元格, 将其数和背景颜色输出显示;
 5) 效率要求：100*100生成表格时间小于3秒;
 6) 代码中要用到事件代理机制;
 7) 设计一种简单机制, 使单元格数小于255*255*255时, 颜色不重复
 8) 要求符合w3c验证, 兼容IE, Firefox, chrome等浏览器 
 思路：面向对象版本
 todo 去重复，兼容
*/

(function () {
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

    function Table() {
        var self=this
        this.rowInput=document.querySelectorAll('.tool input')[0]
        this.colInput=document.querySelectorAll('.tool input')[1]
        this.generateTableBtn=document.querySelector('.tool button')
        this.msg=document.querySelector('.msg')
        this.main=document.querySelector('.main')
        this.generateNumberAndColor=function(row,col){
            var nums=[]
            var colors=[]
            var num,color=''
            var totalColor={}//用于记录已经生成的颜色
            var s=[]
            var m=[]
            for(var i=0;i<row;i++){
                for(var j=0;j<col;j++){
                    num=self.randomNumber()
                    color=self.randomColor()
                    while(true){
                        if(!(color in totalColor)){
                            totalColor[color]=''
                            break
                        }
                        else{
                            color=self.randomColor()
                        }
                    }//保证颜色不重复
                    s.push(num)
                    m.push(color)
                }
                nums.push(s)
                colors.push(m)
                s=s.filter(function(){return false})
                m=m.filter(function(){return false})
            }
            return [colors,nums]
        }
        this.getTbody = function (row, col) {
            var tbody=''
            var tr = ''
            var td = ''
            var res=this.generateNumberAndColor(row,col)
            var numbers=res[1]
            var colors=res[0]
            for (var i = 0; i < row; i++) {
                for (var j = 0; j < col; j++) {
                    td += `<td style="background:${colors[i][j]};">${numbers[i][j]}</td>`
                }
                tr += '<tr>' + td + '</tr>'
                td=''//每次换行把列清除
            }
            tbody += '<tbody>' + tr + '</tbody>'
            return tbody
        }
        this.renderMsg=function(num,color){
            var text=`<div>您选择区域的数字是${num}，颜色为:<span style="display:inline-block;width:40px;background-color:${color};">&nbsp&nbsp</span>${color}</div>`
            this.msg.innerHTML=text
        }
        this.bindUI=function(){
            
            
            function show(e){
                var ev=EventUtil.getEvent(e)
                var target=EventUtil.getTarget(ev)
                var cur=ev.currentTarget
                var tds=Array.prototype.slice.call(cur.querySelectorAll('td'),0)
                if(tds.indexOf(target)!==-1){
                    self.renderMsg(target.innerText,target.style.background)
                }
                
            }
            function renderTable(e){
                var ev=EventUtil.getEvent(e)
                var left=EventUtil.getButton(ev)
                if(!(left===0||e.keyCode===13)){
                    return
                }
                self.clearTable()
                try{
                    var row=self.getInputVal(self.rowInput)
                    var col=self.getInputVal(self.colInput)
                }
                catch(e){
                    setTimeout(self.clearInputAfterError,0) && alert(e.message)
                    return
                }
                var tbody=self.getTbody(row,col)
                var table=document.createElement('table')
                
                table.innerHTML=tbody
                self.main.appendChild(table)
                EventUtil.addHandler(table,'click',show)
                
            }
            
            EventUtil.addHandler(this.generateTableBtn,'click',renderTable)
            EventUtil.addHandler(document,'keydown',renderTable)
            EventUtil.addHandler(document,'selectstart',function(e){
                e.returnValue=false
                return false
            })
        }
        this.clearTable=function(){
            var table=document.querySelector('.main table')
            if(table){
                this.main.removeChild(table)
            }
            
        }
        this.clearInputAfterError=function(){
            self.rowInput.value=''
            self.colInput.value=''
        }

        this.init=function(){
            this.bindUI()
        }

    }
    Table.prototype = {
        constructor: Table,
        randRange:function(Max,Min){
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.round(Rand * Range); //四舍五入
            return num;
        },
        randomColor: function () {
            var color='';
            var num=''
            for(var i=0;i<3;i++){
                num=this.randRange(0,255).toString(16)
                num=num.length===2?num:'0'+num
                color+=num
            }
            color='#'+color
            return color

        },
        randomNumber: function () {
            var num=this.randRange(0,15)
            return num
        },
        getInputVal:function(input){
            var val=input.value
            return this.validate(val)
        },
        validate:function(val){
            var ptn=/\d+/
            if(!val){
                throw new Error('不能为空')
            }
            val=parseFloat(val.trim())
            if(!ptn.test(val)){
                throw new TypeError('必须是数字')
            }
            if(!(val>=1&&val<=100)){
                throw new Error('输入的数字必须在1到100之间')
            }
            return val
        },

    }
    window.Table=Table
})()