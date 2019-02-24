const MORAL_WORDS = ['大方', '可爱', '漂亮', '活泼', '能闹']
const UNMORAL_WORDS = ['傻逼', '傻瓜', '活该']
class MoralTest {

    constructor() {
        this.banner = document.querySelector('.banner')
        this.moralBtn = document.querySelector('.moral-btn')
        this.unmoralBtn = document.querySelector('.unmoral-btn')
        this.restartBtn = document.querySelector('.restart')
        this.startBtn = document.querySelector('.start-btn')
        this.resultBanner = document.querySelector('.stastics')
        this.domrefs = {
            banner: document.querySelector('.banner'),
            moralBtn: document.querySelector('.moral-btn'),
            unmoralBtn: document.querySelector('.unmoral-btn'),
            restartBtn: document.querySelector('.restart'),
            startBtn: document.querySelector('.start-btn'),
            resultBanner: document.querySelector('.stastics')
        }
        this.allWords = [...MORAL_WORDS, ...UNMORAL_WORDS]
        this.result = {
            moral: [],
            unmoral: [],
            timeRecord: {}
        }
        Array('redBanner', 'greenBanner', 'blackBanner').forEach(item => {
            Reflect.defineProperty(this, item, {
                value: document.createElement('div')
            })
        })
        this.init()
    }
    initHtml() {
        let whichBanner = ''
        this.banner.innerHTML = ''
        const colors = ['red', 'green', 'black']
        colors.forEach(color => {
            whichBanner = this[color + 'Banner']
            this.addClass(whichBanner, color + '-banner')
            this.banner.appendChild(whichBanner)
        })
        return this
    }
    init() {
        this.banner.innerHTML = '<h1>点击开始按钮开始测试</h1>'
        this.startBtnClicked = e => {
            this.lastTime = (new Date()).getTime() / 1000
            this.startBtn.style.display = 'none'
            this.initHtml().fillWorld().bindEvent()
        }
        this.startBtn.addEventListener('click', this.startBtnClicked)

    }

    fillWorld() {
        let word = this.getWord()
        const banners = [this.redBanner, this.greenBanner, this.blackBanner]
        banners.forEach(item => {
            item.innerText = word
        })
        return this
    }
    bindEvent() {
        this.moralBtnClicked = e => {
            let text = this.redBanner.innerText

            if (this.allWords.length !== 0) {
                this.recordTime(text)
                this.result.moral.push(text)
                this.fillWorld()
            } else {
                this.showResult()
            }
        }

        this.unmoralBtnClicked = e => {
            let text = this.redBanner.innerText
            if (this.allWords.length !== 0) {
                this.recordTime(text)
                this.result.unmoral.push(text)
                this.fillWorld()
            } else {
                this.showResult()
            }
        }
        this.resetBtnClicked = e => {
            this.restartBtn.style.display = 'none'
            this.reset()
        }
        this.moralBtn.addEventListener('click', this.moralBtnClicked)
        this.unmoralBtn.addEventListener('click', this.unmoralBtnClicked)
        this.restartBtn.addEventListener('click', this.resetBtnClicked)
    }
    getWord() {
        let word = this.choice(this.allWords)
        return word
    }
    reset() {
        this.banner.innerHTML = ''
        this.moralBtn.removeEventListener('click', this.moralBtnClicked)
        this.unmoralBtn.removeEventListener('click', this.unmoralBtnClicked)
        this.restartBtn.removeEventListener('click', this.resetBtnClicked)
        this.startBtn.removeEventListener('click', this.startBtnClicked)
        this.allWords = [...MORAL_WORDS, ...UNMORAL_WORDS]
        this.result = {
            moral: [],
            unmoral: [],
            timeRecord: {}
        }
        this.resultBanner.innerHTML = ''
        this.startBtn.style.display = 'inline'
        this.init()
    }

    showResult() {
        this.banner.innerHTML = '<h1 style="font-size:3em;">测试完成，请选择重新开始按钮</h1>'
        this.restartBtn.style.display = 'inline'
        this.restartBtn.style.transform = 'translateX(10px)'
        let tmp = ''
        let resHeader = `
        <h1>统计结果</h1>
        <header class="result-header">
            <div class="moral-res">你选出的道德词汇:${this.result.moral.join('-')}</div>
            <div class="unmoral-res">你选出的不道德词汇:${this.result.unmoral.join('-')}</div>
        </header>`

        for (let k in this.result.timeRecord) {
            tmp += `<li><span>${k}:</span><span>判断用时:${this.result.timeRecord[k]}s</span></li>`
        }
        const ul = document.createElement('ul')
        ul.innerHTML = tmp
        this.resultBanner.innerHTML = resHeader
        this.resultBanner.appendChild(ul)
    }

    recordTime(word) {
        const cur = (new Date()).getTime() / 1000
        const seconds = cur - this.lastTime
        this.result.timeRecord[word] = seconds.toString().slice(0, 4)
        this.lastTime = cur
    }

    choice(array) {
        let index = parseInt(Math.random() * array.length, 10) //生成索引
        let word = array[index]
        array.splice(index, 1)
        return word
    }

    addClass(item, class_) {
        item.classList.add(class_)
    }
    removeClass(item, class_) {
        item.classList.remove(class_)
    }
    toggleClass(item, class_) {
        item.classList.toggle(class_)
    }
}