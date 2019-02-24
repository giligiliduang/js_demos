/**
 * @author (guo)
 * @date 2018-11-24
 * @class Drag
 * @param ops 自定义设置
 * 拖拽总结：详细原理见思维导图
 * 细节1：鼠标按下需要计算鼠标位置和方块左边的x,y距离，
 * 以后每次移动需要剪掉这个距离,为的是鼠标与当前方块保持相对静止
 * 细节2：浏览器当前宽高(如果打开控制台，减去控制台高度) 
 * document.documentElement.clientWidth || window.innerWidth
 * document.documentElement.clientHeight || window.innerHeight
 * 细节3：滑块移动的最大最小距离,最小 0,0 最大 浏览器宽高-offset
 */
class Drag {

    constructor(ops = {}) {
        this.options = {
            'horizonLock': false,
            'verticalLock': false,
            'positionLock': false,
            'rangeLock': false
        }
        this.options = Object.assign({}, this.options, ops)
        this.trace = []
        this.toolbar = document.querySelector('.tool-bar')
        this.playbackbtn = this.toolbar.querySelector('button')
        this.container = document.querySelector('.draggable-container')
        this.rangeLockBtn=document.querySelector('.rangeLock')
        this.horizonLockBtn=document.querySelector('.horizonLock')
        this.verticalLockBtn=document.querySelector('.verticalLock')
        this.positionLockBtn=document.querySelector('.positionLock')
        this.status = document.querySelectorAll('.status span')
        this.isdragging = false
        this.isDraggingText = this.status[0]
        this.offsetTopText = this.status[1]
        this.offsetLeftText = this.status[2]
        this.editableP = document.querySelectorAll('.status p')[3]
        this.bindUi()
    }
    bindUi() {
        let that = this

        function onMouseDown(e) {
            let startpos = that.getPos(e)
            let beforOffset = that.getOffset(that.container)
            //计算距离方块左侧的偏移量
            that.disX = startpos.x - beforOffset.offsetLeft
            that.disY = startpos.y - beforOffset.offsetTop
            that.container.addEventListener('mousemove', onMouseMove)
        }

        let onMouseMove = function (e) {
            that.isdragging = true
            let movepos = that.getPos(e)
            let diffX = movepos.x - that.disX
            let diffY = movepos.y - that.disY
            let maxLeft = document.documentElement.clientWidth - that.container.offsetWidth
            let maxTop = document.documentElement.clientHeight - that.container.offsetHeight
            if (that.options.rangeLock) {
                diffX = diffX <= 0 ? 0 : diffX >= maxLeft ? maxLeft : diffX
                diffY = diffY <= 0 ? 0 : diffY >= maxTop ? maxTop : diffY
            }

            that.trace.push(movepos)
            that.setPos(that.container, diffX, diffY)
            let offset = that.getOffset(that.container)
            updateStatus(that.isdragging, offset.offsetLeft, offset.offsetTop)
        }

        function onMouseUp(e) {
            that.isdragging = false
            that.container.removeEventListener('mousemove', onMouseMove)
            that.isDraggingText.innerText = that.isdragging

        }

        function updateStatus(dragging, offsetTop, offsetLeft) {

            that.isDraggingText.innerText = dragging
            that.offsetLeftText.innerText = offsetTop
            that.offsetTopText.innerText = offsetLeft
        }

        this.toolbar.addEventListener('mousedown', onMouseDown)
        this.toolbar.addEventListener('mouseup', onMouseUp)
        this.onMouseClick()
        this.ondbClick()
        this.onConfigChange()

    }
    onMouseClick() {
        var that = this
        var timestamp = 2000
        function playTraceBack(e) {
            e.stopPropagation()
            let per = (that.trace.length / timestamp) * 1000
            //每隔一段时间调用一次
            let timer = setInterval(() => {
                let op = that.trace.pop()
                op ? that.setPos(that.container, op.x, op.y) : clearInterval(timer)
            }, per)

            // var i=0,length=that.trace.length
            // for(;i<length;i++){
            //     let op=that.trace.pop()
            //     let timer=requestAnimationFrame(function(){
            //         if(!op){
            //             console.log('斗舞')
            //             cancelAnimationFrame(timer)
            //         }
            //         that.setPos(that.container,op.x,op.y)
            //     },per)
            // }

        }
        this.playbackbtn.addEventListener('click', playTraceBack)
    }
    onConfigChange(){
        const keys=Object.keys(this.options)
        keys.forEach(item=>{
            this[item+'Btn'].addEventListener('click',e=>{
                const Btn=this[item+'Btn']
                const oldText=Btn.innerText
                this.options[item]=!this.options[item]
                Btn.innerText= this.options[item]?'取消'+oldText:oldText.replace('取消','')  
            })
        })
    }

    ondbClick() {
        let that = this
        this.editableP.addEventListener('click', e => {
            that.showElement(this.editableP.querySelector('span'))
        })
    }

    showElement(elem) {
        //创建可变编辑的input
        let oldConent = elem.innerHTML
        if (oldConent.indexOf('type="text"') > 0) {
            //已经双击过了直接返回
            return
        }
        //创建表单元素并且替换原来内容
        let newObj = document.createElement('input')
        newObj.type = 'text'
        newObj.value = oldConent
        elem.innerHTML = ''
        elem.appendChild(newObj)
        //设置选中范围并且自动全选
        newObj.setSelectionRange(0, oldConent.length)
        newObj.focus()
        //失去焦点事件
        newObj.onblur = function (e) {
            //如果表单数据为空保留原来数据，否则使用新数据
            console.log(this)
            if (this.value && this.value.trim() === '') {
                elem.innerHTML = oldConent ? oldConent : this.value
            } else {
                elem.innerHTML = this.value
            }
        }
        newObj.onkeydown = function (e) {
            if (e.keyCode === 13) {
                this.blur()
            }
        }
    }



    getPos(e) {
        return {
            x: e.clientX,
            y: e.clientY
        }
    }
    getOffset(elem) {
        return {
            offsetLeft: elem.offsetLeft,
            offsetTop: elem.offsetTop
        }
    }
    setPos(elem, x, y) {
        if ((this.options.horizonLock && this.options.verticalLock)||
        this.options.positionLock) {
            return
        } else if (this.options.horizonLock) {
            elem.style.top = y + 'px'
        } else if (this.options.verticalLock) {
            elem.style.left = x + 'px'
        } else {
            elem.style.left = x + 'px'
            elem.style.top = y + 'px'
        }
    }

}