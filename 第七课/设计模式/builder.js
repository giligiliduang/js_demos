//es6
class Computer{

    constructor(main,cpu,gpu){
        this.main=main
        this.cpu=cpu
        this.gpu=gpu
    }
}

class ComputerBuilder{
    constructor(main,cpu,gpu){
        this.com=new Computer(main,cpu,gpu)
    }
    addMouse(mouse){
        this.com.mouse=mouse
        return this
    }
    addKeyboard(board){
        this.com.keyboard=board
        return this
    }
    addMonitor(monitor){
        this.com.monitor=monitor
        return this
    }
    build(){
        return this.com
    }
}
const compbuilder=new ComputerBuilder('hello','intel','navida')
const com=compbuilder.addMonitor('sumsung').addMouse('razer').build()
console.log(com)
