class BaseClass{
    constructor(){
        const baseElem=document.getElementsByClassName('rectangle')[0]
        const allcss=window.getComputedStyle(baseElem,null)
        this.basewidth=allcss.width
        this.baseHeight=allcss.height
        this.baseColor=allcss.backgroundColor
        
    }
   withen(){
        let elem=document.getElementsByClassName('rectangle')
        elem.style.setProperty('width','500px')
    }
    
    heighten(){
        let elem=document.getElementsByClassName('rectangle')
        elem.style.setProperty('height','500px')
    }
    
    changecolor(){
        let elem=document.getElementsByClassName('rectangle')
        elem.style.setProperty('color','red')
    }
    
    hidden(){
        let elem=document.getElementsByClassName('rectangle')
        elem.hidden=true
    }
    
    reset(){
        let elem=document.getElementsByClassName('rectangle')
        elem.style.setProperty('width',this.basewidth)
        elem.style.height.setProperty('height',this.baseHeight)
        elem.style.setProperty('color',this.baseColor)
    }
}





function addEvents(){
    let widthen=document.getElementById('withen')
    let heighten=document.getElementById('heighten')
    let changgecolor=document.getElementById('changgecolor')
    let hidden=document.getElementById('hide')
    let reset=document.getElementById('reset')
    let base=new BaseClass()
    widthen.addEventListener('click',base.withen)
    heighten.addEventListener('click',base.heighten)
    changgecolor.addEventListener('click',base.changecolor)
    hidden.addEventListener('click',base.hidden)
    reset.addEventListener('click',base.reset)
}

window.onload=addEvents


