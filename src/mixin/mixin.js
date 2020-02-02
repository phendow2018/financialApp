export default {
  created() {

  },
  data() {
    return {
      ops: {
        scrollPanel: {
          // when component mounted.. it will automatically scrolls.
          initialScrollY: false,
          initialScrollX: false,
          // feat: #11
          scrollingX: false,
          scrollingY: true,
          speed: 300,
          easing: undefined,
          // 是否有一个padding样式，样式的大小应该和rail/bar的大小是一样。
          // padding: false,
          // Sometimes, the nativebar maybe on the left,
          // See https://github.com/YvesCoding/vuescroll/issues/64
          verticalNativeBarPos: 'right'
        },
        bar: {
          /** How long to hide bar after mouseleave, default -> 500 */
          showDelay: 500,
          /** Whether to show bar on scrolling, default -> true */
          onlyShowBarOnScroll: true,
          /** Whether to keep show or not, default -> false */
          keepShow: true,
          /** Bar's background , default -> #00a650 */
          background: '#acacac',
          /** Bar's opacity, default -> 1  */
          opacity: 1,
          /** Styles when you hover scrollbar, it will merge into the current style */
          hoverStyle: true
        },
      },
    }
  },
  methods: {
    writeLog: function () {
      console.log('writeLog')
    },
    sendMassage: function () {
      console.log('sendMassage')
    },
    dealRight: function () {
      console.log('dealRight')
    },
    deepCopy(data) {
      const t = this.typeOf(data);
      let o;

      if (t === 'array') {
        o = [];
      } else if (t === 'object') {
        o = {};
      } else {
        return data;
      }

      if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
          o.push(this.deepCopy(data[i]));
        }
      } else if (t === 'object') {
        for (let i in data) {
          o[i] = this.deepCopy(data[i]);
        }
      }
      return o;
    },
    typeOf(obj) {
      const toString = Object.prototype.toString;
      const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
      };
      return map[toString.call(obj)];
    },
    getToken(Name) {
      return this.getCookie(Name)
    },
    getLabel(Type) {
      let type = '未知'
      switch (Type) {
        case 1:
        case '1':
          type = '一季报';
          break;
        case 2:
        case '2':
          type = '中报';
          break;
        case 3:
        case '3':
          type = '三季报';
          break;
        case 4:
        case '4':
          type = '年报';
          break;
      }
      return `${type}`
    },
    addDays(date, days) {
      date.setDate(date.getDate() + days);
      return date;
    },
    addMonths(date, mon) {
      var d = date.getDate();
      date.setMonth(date.getMonth() + mon);
      if (date.getDate() < d)
        date.setDate(0);
      return date;
    },
    createColorRandomNumber() {
      return Math.floor(Math.random() * 7);
    },
    myTrim(x) {
      return (x !== null && x !== undefined && typeof x == 'string') ? x.replace(/^\s+|\s+$/gm, '') : x;
    },
    compareDate(d1, d2) {
      return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
    },
    formatNormalDate(year, month, day) {
      var y = year;
      var m = month;
      if (m < 10) m = "0" + m;
      var d = day;
      if (d < 10) d = "0" + d;
      return y + "-" + m + "-" + d
    },
    isObjectEmpty(obj) {
      if (typeof obj === 'object') {
        let arr = Object.keys(obj);
        if (arr.length === 0) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    showMessage(message, type, duration, callBack) {
      if (typeof duration == 'function') callBack = duration
      this.$notify({
        message: message,
        type: type,
        duration: duration
      });
    },
    closeMessage() {
      setTimeout(() => {
        this.$root.$emit('hideMessageBox');
      }, 1000);
    },
    backToMain() {
      this.$router.go(-1);
    },
    setCookie(name, value, time) {
      var exp = new Date();
      if (time == undefined) time = 24 * 60 * 60 * 1000
      exp.setTime(exp.getTime() + time);
      document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};path=/`;
    },
    getCookie(name) {
      var strcookie = document.cookie; //获取cookie字符串
      var arrcookie = strcookie.split("; "); //分割
      //遍历匹配
      for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) {
          return arr[1];
        }
      }
      return "";
    },
    delCookie(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = getCookie(name);
      if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
  }
}
