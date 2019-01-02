;(function (root, lazyload) {
    if(typeof module === 'object'){
        //支持nodejs
        module.exports=lazyload()
    }
    root.imgLazyLoad = lazyload()

})(typeof window !== 'undefined' ? window : this,
    function () {
        return function imgLazyLoad() {
            let imgsUl = document.querySelector('.imgs')
            const loadingpath = 'C:\Users\guo\Desktop\杂项\js\js小项目\第七课\图片懒加载\assets\imgs\loading.gif'
            const errorLoadingPath = 'C:/Users/guo/Desktop/杂项/js/js小项目/第七课/图片懒加载/assets/imgs/loadingerror.png'
            this.loadImg = function () {
                const promises = []
                for (let i = 1; i < 9; i++) {
                    let path = 'C:/Users/guo/Desktop/杂项/js/js小项目/第七课/图片懒加载/assets/imgs/四格 (' + i + ').jpg'
                    promises.push(this.getImg(path))
                }
                Promise.all(promises).then(res => {
                    res.forEach(img => {
                        let li = document.createElement('li')
                        li.appendChild(img)
                        imgsUl.appendChild(li)
                    })
                }).catch(res => {
                    res.src = errorLoadingPath
                    let li = document.createElement('li')
                    li.appendChild(res)
                    imgsUl.appendChild(li)
                })
            }

            this.getImg = function (path) {
                return new Promise(function (resolve, reject) {
                    let img = new Image()
                    img.width = '200'
                    img.height = '200'
                    img.onload = function (e) {
                        console.log(img)
                        resolve(img)
                    }
                    img.onerror = function (e) {
                        reject(img)
                    }
                    img.src = path
                })
            }
        }
    }
)