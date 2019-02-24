class FireWorks {

    constructor() {
        //可视宽高
        this.type_ = 'manual'
        this.manualBtn = document.querySelector('.manual')
        this.autoBtn = document.querySelector('.auto')
        this.stopBtn = document.querySelector('.stop')
        this.clientWidth = document.documentElement.clientWidth
        this.clientHeight = document.documentElement.clientHeight
        this.emojis=['😀','😁','😂','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😗','😙','😚']
        this.timer = ''
        this.bindEvent()
    }

    bindEvent() {
        let clickListener = ''
        const actions = {
            'auto': (e) => {
                e.stopPropagation();
                this.clearClass([this.autoBtn, this.stopBtn, this.manualBtn], 'active')
                this.addClass(e.target, 'active')
                this.auto()
                clickListener && removeEventListener('click', clickListener)
            },
            'manual': (e) => {
                e.stopPropagation();
                this.clearClass([this.autoBtn, this.stopBtn, this.manualBtn], 'active')
                this.addClass(e.target, 'active')
                clearInterval(this.timer)
                clickListener = (e) => {
                    this.manual(e.clientX, e.clientY)
                }
                document.addEventListener('click',clickListener)
            },
            'stop': (e) => {
                e.stopPropagation();
                this.clearClass([this.autoBtn, this.stopBtn, this.manualBtn], 'active')
                this.addClass(e.target, 'active')
                clearInterval(this.timer)
                document.removeEventListener('click', clickListener)
            }
        }
        this.manualBtn.addEventListener('click', actions['manual'])
        this.autoBtn.addEventListener('click', actions['auto'])
        this.stopBtn.addEventListener('click', actions['stop'])
        document.onselect=function(e){return false}
        document.onselectstart=function(e){return false}
        
    }

    manual(x, y) {
        //手动
        this.__create(x, y)
    }
    auto() {
        //自动
        const move = () => {
            let x = this.randomRange(0, this.clientWidth)
            let y = this.randomRange(0, this.clientHeight)
            this.__create(x, y)
        }
        this.timer = setInterval(move, 300)
    }
    __create(originx, originy) {
        //传入的参数为终点坐标,运动时x不动，y运动
        let frag = document.createDocumentFragment()
        let firework = document.createElement('div')
        firework.style.width = '20px'
        firework.style.height = '20px'
        firework.style.backgroundColor = this.randomColor()
        firework.style.borderRadius = '50%'
        firework.style.position = 'absolute'
        firework.style.overflow = "hidden"
        this.setPos(firework, originx, this.clientHeight - 20)
        document.body.appendChild(firework)
        let temp = this.clientHeight - 20
        let timer = setInterval(() => {
            temp -= 20
            if (temp <= originy) {
                clearInterval(timer)
                document.body.removeChild(firework)
                //随机生成20-40粒子碎片，展示烟花效果
                let particles = []
                for (let i = 0; i < this.randomRange(40, 60); i++) {
                    let item = document.createElement('div')
                    item.innerHTML=this.emojis[this.randomRange(0,this.emojis.length-1)]
                    item.style.fontSize='2em'
                    item.style.borderRadius = '50%'
                    item.style.position = 'absolute'
                    item.style.overflow = "hidden"
                    item.speedx = this.randomRange(-20, 20)
                    item.speedy = this.randomRange(-20, 20)
                    this.setPos(item, originx, originy)
                    frag.appendChild(item)
                    particles.push(item)
                }
                document.body.appendChild(frag)
                let particaleTimer = setInterval(() => {
                    for (let i = 0; i < particles.length; i++) {
                        //直到每一个都消失之后才停止定时器
                        let obj = particles[i]
                        this.setPos(obj,
                            obj.offsetLeft + obj.speedx,
                            obj.offsetTop + obj.speedy)
                        obj.speedy++
                            (obj.offsetLeft <= 0 ||
                                obj.offsetTop <= 0 ||
                                obj.offsetLeft >= this.clientWidth ||
                                obj.offsetTop >= this.clientHeight) && (document.body.removeChild(obj), particles.splice(i, 1))
                    }!particles[0] && clearInterval(particaleTimer)
                }, 30)
            }
            this.setPos(firework, originx, temp)
        }, 30)
    }


    addClass(elem, class_) {
        elem.classList.add(class_)
    }
    removeClass(elem, class_) {
        elem.classList.remove(class_)
    }
    clearClass(elems, class_) {
        elems = Array.isArray(elems) ? elems : Array.from(elems)
        elems.map(item => item.classList.remove(class_))
    }

    setPos(element, x, y) {
        element.style.left = x + 'px'
        element.style.top = y + 'px'
    }
    randomRange(start = 0, end) {
        //随机范围,左闭右开
        return Math.floor(Math.random() * (end - start + 1) + start)
    }
    randomColor() {
        let color = '#' + this.randomRange(0, 16777215).toString(16).padEnd(6, '0')
        return color
    }
}