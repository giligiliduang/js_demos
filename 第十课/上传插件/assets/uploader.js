/**
 *
 *@description 仿layui 图片上传插件，采用es6语法
 * @author (guo)
 * @date 2018-12-16
 * @param {*} [ops={}]
 */

class Uploader {

    constructor() {
        this.options = {
            elem: '',
            url: '', //上传接口
            multi: false, //是否上传多个
            accept: '*', //可指定视频,音频，压缩文件
            exts: '*', //后缀名用 |分割
            size: '*', //文件大小限制 数字类型单位kb
            auto: true, //自动请求接口上传
            choose: '',
            before: '', //请求接口前回调
            done: '', //成功回调
            error: '', //失败回调
        }

        this.files = []
    }
    fileChangeEvent() {
        this.options.elem.addEventListener('change', function (e) {
            let files = e.target.files
            try {
                files.forEach(function (file, index) {
                    let ext = file.name.substring(file.name.lastIndexOf('.').toLowerCase() + 1)
                    this.options.before.call(this, file, index)
                    if (!checkIsAcceptedFile(ext)) {
                        throw new Error('禁止上传的文件类型')
                    }
                    if (!checkFileSize(file.size)) {
                        throw new Error('文件大小不超过' + this.options.size + 'kb')
                    }
                })
            } catch (e) {
                this.options.done.call(this,e)
            }

        })
    }

    checkFileSize(size) {
        if (this.options.size === '*') {
            return true
        }
        return this.options.size <= size ? true : false
    }
    checkIsAcceptedFile(ext) {

        function checkExt(ext) {
            let exts = this.options.exts.split('|')
            return exts.some(function (item) {
                return item === ext
            })
        }
        if (this.options.accept === '*' || this.options.exts === '*') {
            return true
        }
        if (this.options.accept === 'video' || this.options.accept === 'audio') {
            return checkExt(ext)
        }

    }

    render(ops = {}) {
        this.options = Object.assign({}, this.options, ops)
        this.options.exts = this.options.accept === 'video' ? 'mp4|avi|rmvb' :
            this.options.accept === 'audio' ? 'mp3|aac' : '*'
        this.options.multi?this.elem.setAttribute('multiple',true):
        elem.removeAttribute('multiple')
        this.fileChangeEvent()
    }


}