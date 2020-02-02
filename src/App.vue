<template>
  <div id="app" class="yellow">
    <router-view />
  </div>
</template>

<script>
import mixin from "$mixin/mixin.js";
export default {
  name: "App",
  mixins: [mixin],
  data() {
    return {
      timer: null
    };
  },
  created() {
    this.init();
	this.setCookie("Token", this.getToken("Token"), 120000);
    this.timer = setInterval(() => {
		console.log('start')
      this.setCookie("Token", this.getToken("Token"), 120000);
    }, 110000);
  },
  mounted() {
	this.changeColor("default");
	
	window.onbeforeunload =  (event) => { //刷新或关闭浏览器执行
		this.setCookie("Token", this.getToken("Token"), 5000);
	}
  },
  methods: {
    init() {
      this.$root.$on("change-color", val => {
        this.changeColor(val);
      });
    },
    changeColor(color) {
      document.getElementById("app").classList.remove("yellow", "default", "gitlib", "blue");
      document.getElementById("app").classList.add(color);
    }
  },
  destroyed() {
	  console.log('destroyed')
    clearInterval(this.timer);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body {
  width: 100vw;
  height: 100vh;
  margin: 0px;
}
#app {
  height: 100%;
  width: 100%;
}
.globel-title-class {
  font-size: 16px !important;
  font-family: "微软雅黑 Bold, 微软雅黑 Regular, 微软雅黑";
  border-bottom: solid 1px #ebeef5;
  height: 29px !important;
  position: relative;
}
.globel-warpper-class {
  padding: 20px 300px !important;
  box-sizing: border-box !important;
}
.el-tabs__header {
  margin: 0;
}
.span-msg-skip {
  height: 22px;
  line-height: 45px;
}
</style>