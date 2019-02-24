/**
 *关键点1：保存上次评分的数据，鼠标移开时需要恢复上次的评分
 *关键点2：提示框不受干扰，只要鼠标经过就需要显示
 * @author (guo)
 * @date 2018-09-02
 * @class Rate
 */
class Rate {
    constructor() {
        this.stars = Array.from(document.querySelectorAll('#star li'))
        this.msgs = [
            "很不满意|差得太离谱，与卖家描述的严重不符，非常不满",
            "不满意|部分有破损，与卖家描述的不符，不满意",
            "一般|质量一般，没有卖家描述的那么好",
            "满意|质量不错，与卖家描述的基本一致，还是挺满意的",
            "非常满意|质量非常好，与卖家描述的完全一致，非常满意"
        ]
        this.prompt = document.getElementsByTagName('p')[0]
        this.oSpan = document.getElementsByTagName('span')[1]
        this.lastStarCount = null
        this.hasSet = false
    }
    setMousestyle() {
        let that = this
        this.stars.forEach((item, index) => {
            item.onmouseenter = e => {
                that.prompt.style.opacity="1"
                that.prompt.style.transition="opacity 1s"
                that.prompt.style.left=24*(index+1)+"px"
                that.prompt.innerHTML=`<em style="font-size:15px;">${index+1}星</em>`+that.msgs[index]
                if (!that.hasSet) {
                    that.setEverystar(index) //设置星星样式
                } else {
                    if(that.lastStarCount!==index){
                        that.setEverystar(index)
                    }
                }

            }
            item.onmouseleave = e => {
                that.prompt.style.opacity="0"
                that.prompt.style.transition="opacity 0.5s"
                // that.prompt.removeAttribute('style')
                if(that.lastStarCount===null){
                    that.clearAllstar()
                }else{
                that.setEverystar(that.lastStarCount)
                }
            }
        })
    }
    setClick() {
        let that = this
        this.stars.forEach((item, index) => {
            item.onclick = e => {
                that.hasSet = true
                that.prompt.removeAttribute('style')
                that.oSpan.innerHTML = `<em style="font-size:15px;">${index+1}星</em>`+that.msgs[index]
                that.lastStarCount = index
            }
        })
    }

    setEverystar(pos) {
        this.stars.forEach((item, index) => {
            if (index <= pos) {
                item.classList.add("on")
            }
            else{
                item.classList.remove("on")
            }
        })
    }
    
    clearAllstar() {
        this.stars.forEach((item) => {
            item.classList.remove("on")
        })
    }
    init() {
        this.setMousestyle()
        this.setClick()
    }

}
let obj = new Rate()
obj.init()