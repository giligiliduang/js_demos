(function () {
    function DateData(year, month) {
        this.totalLength = 6 * 7 //总li个数
        this.totalDays = [] //日历数组
        this.curWeek = this.getWeek(year, month) //当前是周几
        this.curDays = this.getDays(year, month) //当前月份的天数
        this.preRenderDays = this.curWeek === 0 ? 6 : this.curWeek - 1 //前一个月需要渲染的天数
        this.preYear=month===1?year-1:year//前一年
        this.preMonth=month===1?12:month-1//前一个月
        this.curYear=year //当前年
        this.curMonth=month
        this.nextYear=month===12?year+1:year//下一年
        this.nextMonth=month===12?1:month+1//下一个月
        this.preMonthDays=this.getDays(this.preYear,this.preMonth)//上个月天数
        this.preStartDay = this.preMonthDays - this.preRenderDays + 1 //前一个月从哪天开始渲染
        this.remainDays = this.totalLength - (this.preRenderDays + this.curDays) //下一个月需要渲染的天数
        this.lunardateurl = 'https://www.sojson.com/open/api/lunar/json.shtml?date='
        var self = this
        this.renderpremonth = function () {
            var preMonthDays = []
            for (var x = self.preStartDay; x <= self.preMonthDays; x++) {
                preMonthDays.push(x)

            }
            self.totalDays.push(preMonthDays)
        }
        this.rendercurmonth = function () {
            var curMonthDays = []
            for (var x = 1; x <= self.curDays; x++) {
                curMonthDays.push(x)
            }
            self.totalDays.push(curMonthDays)
        }
        this.rendernextmonth = function () {
            var nextMonthDays = []
            for (var x = 1; x <= self.remainDays; x++) {
                nextMonthDays.push(x)
            }
            self.totalDays.push(nextMonthDays)
        }
        this.init = function () {
            self.renderpremonth()
            self.rendercurmonth()
            self.rendernextmonth()
        }
        this.getResult = function () {
            this.init()
            return self.totalDays
        }
    }

    DateData.prototype = {
        constructor: DateData,
        getDays: function (year, month) {
            //根据年份和月份获得当月天数
            var bigMonths = [1, 3, 5, 7, 8, 10, 12]
            var smallMonths = [4, 6, 9, 11]
            var uniqueMonth = 2
            month = ~~month
            year = ~~year
            if (bigMonths.indexOf(month) !== -1) {
                return 31
            } else if (smallMonths.indexOf(month) !== -1) {
                return 30
            } else {
                if (month === uniqueMonth) {
                    if (this.isLeapYear(year)) {
                        return 29
                    } else {
                        return 28
                    }
                } else {
                    throw new Error('illegal argument month')
                }
            }

        },
        getYear:function(month,year,type){
            //获取前一年或者后一年的年份
            if(type==='pre'){
                var year=month===1?year-1:year//前一年
            }
            else{
                var year=month===12?year+1:year//下一年
            }
            return year

        },
        getMonth:function(month,type){
            //获取前一年或者后一年的月份
            if(type==='pre'){
                var m=month===1?12:month-1//前一个月
            }else{
                var m=month===12?1:month+1//下一个月
            }
            return m
        },
        isLeapYear: function (year) {
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                return true
            }
            return false
        },
        getWeek: function (year, month) {
            // 根据当前年和月获得本月第一天是星期几,0代表周日，6代表周六
            var dt = new Date()
            dt.setFullYear(year, month - 1, 1)
            var which = dt.getDay()
            return which
        },
        getLunarDate: function (year, month, day) {
            var data = ''
            var date = `${year}-${month}-${day}`
            $.get({
                url: this.lunardateurl + date,
                dataType: 'jsonP',
                success: function (res) {
                    data = res['data']
                },
                error: function (e) {
                    console.log(e)
                }
            })
            return data
        }
    }
    window.DateData = DateData
})()


