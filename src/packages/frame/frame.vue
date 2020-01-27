<template>
	<el-container :class="[preCls + '-container']" @click.native="isShowDownList = false">
		<el-header :class="[preCls + '-header']">
			<div :class="[preCls + '-header-title']" :style="sideStyle"> 
				<i class="iconfont title-system">德 鑫</i>
				<span v-if="!isCollapse"></span>
			</div>
			<span :class="[preCls + '-header-icon']" :style="iconStyle">
				<!-- <i class="iconfont icon-liebiao" :title="isCollapse?'展开菜单':'收缩菜单'" @click="collapseMenu"></i> -->
			</span>
			<div :class="[preCls + '-header-tool']">
				<!-- <div :class="['header-item', preCls + '-header-tool-warning']">
					<i class="iconfont icon-lingdang"></i>
					<sup :class="['message-number', 'header-item-dot']">2</sup>
				</div> -->
				
				<!-- <div :class="['header-item', preCls + '-header-tool-message']">
					<i class="iconfont icon-xinfeng"></i>
					<sup :class="['message-number', 'header-item-dot', preCls + '-header-tool-message-sup']">2</sup>
				</div> -->
				<!-- <div class="choose-color">
					<el-dropdown @command="onChangeColor" trigger="click">
						<div class="bar" title="点击切换主题" ><i class="iconfont icon-zhuti" ref="curColor" :style="themaColor"></i></div>
						<el-dropdown-menu slot="dropdown" placement="bottom-end" >
							<el-dropdown-item command="blue"><i class="color-item"></i>蓝色风格</el-dropdown-item>
							<el-dropdown-item command="yellow"><i class="color-item"></i>黄色风格</el-dropdown-item>
							<el-dropdown-item command="gitlib"><i class="color-item"></i>紫色风格</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					
				</div> -->
				<!-- <div :class="['header-item']" style="width:50px;">
					<div :class="[preCls + '-header-tool-cutline']"></div>
				</div> -->
				<div :class="[preCls + '-header-tool-username']">
					{{UserName}}
				</div>
				<div :class="[preCls + '-header-tool-photo','header-item']" @click.stop="isShowDownList = !isShowDownList">
					<i class="iconfont icon-touxiang"></i>
					<transition name="el-zoom-in-top" mode="out-in">
						<div :class="[preCls + '-header-tool-downmenu']" v-show="isShowDownList" @click.stop>
							<li :class="[preCls + '-header-tool-downmenu-li']" @click="resetPasswordModal">重置密码</li>
							<!-- <li :class="[preCls + '-header-tool-downmenu-li']">
								<span style="cursor: default">网站风格</span>
								<div :class="[preCls + '-header-tool-color']">
									<div :class="[preCls + '-header-tool-color-blue']" @click="onChangeColor('blue')"></div>
									<div :class="[preCls + '-header-tool-color-yellow']" @click="onChangeColor('yellow')"></div>
									<div :class="[preCls + '-header-tool-color-gitlib']" @click="onChangeColor('gitlib')"></div>
								</div>
							</li> -->
							<li :class="[preCls + '-header-tool-downmenu-li']" @click="quit">退出</li>
						</div>
					</transition>
				</div>
			</div>
		</el-header>
		<el-container>
			<el-aside :class="[preCls + '-aside']" :style="sideStyle">
				<div :class="[preCls + '-aside-menu']">
					<el-menu
						:default-active="defaultOpenModule.toString()"
						:class="[preCls + '-aside-ul']"
						:unique-opened="true"
						:collapse="isCollapse"
						:collapse-transition="false"
						@open="onMenuOpened">
						<template v-for="(item, key) in menuList">
							<el-submenu :index="key.toString()" v-if="!!item.children && item.children.length > 0" @click.native="clickFatherMenu(item)">
								<template slot="title">
									<i class="icon iconfont" :class="item.meta.icon"></i>
									<span slot="title">{{item.meta.title}}</span>
								</template>
								<el-menu-item v-for="(sub,idx) in item.children" :key="idx" :index="sub.path" class="el-menu-sub-item-custom" @click.native.stop="changeUrlPrefix(sub.path)">
									<i class="icon iconfont" :class="sub.meta.icon"></i>
									<span slot="title">{{sub.meta.title}}</span>
								</el-menu-item>
							</el-submenu>
							<el-menu-item v-else :index="item.path" @click="changeUrlPrefix(item.path)" class="el-menu-item-custom">
								<i :class="item.meta.icon"></i>
								<span slot="title">{{item.meta.title}}</span>
							</el-menu-item>
						</template>
					</el-menu>
				</div>
				
				<div :class="[preCls + '-aside-collapse']" @click="collapseMenu">
					<i :class="['iconfont', isCollapse ? 'icon-xiayige':'icon-shangyige']" :title="isCollapse?'展开菜单':'收缩菜单'"></i>
				</div>
			</el-aside>
			<el-main :class="[preCls + '-main']">
				<!-- <vue-scroll :ops="ops" ref='globel-scroll' @handle-scroll="onScroll"> -->
					<!-- <aom-messagebox></aom-messagebox> -->
					<keep-alive :include="$root.isKeepAliveOrderEdit">
						<router-view/>
					</keep-alive>
				<!-- </vue-scroll> -->
                
				<!-- <iframe ref="iframe" :class="[preCls + '-main-iframe']" :path="currentIframeUrlPrefix" frameborder="0"></iframe> -->
			</el-main>
		</el-container>
		 <!-- 重置密码 -->
        <el-dialog
            title="重置用户密码"
            :visible.sync="resetPassword"
            width="500px">
            <div class="dialog-body">
				<el-form :model="resetPasswordForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-dynamic">
					<el-row>
						<el-col :span='20'> 
							<el-form-item label="旧密码" prop="oldPassword">
								<el-input :type="oldType" v-model="resetPasswordForm.oldPassword" autocomplete="off" autofocus="true" :ref="'oldPw'" @keyup.enter.native="funEnter('newPw')" placeholder="请输入旧密码"></el-input>	
							</el-form-item>
						</el-col>
						<el-col :span='4' class="icon-style"> 			
							<span @click="changeType('oldPassword')" v-if="this.oldType == 'password'"><i class="iconfont icon-icon-eye-close"></i></span>
							<span @click="changeType('oldPassword')" v-else><i class="iconfont icon-icon-eye-open"></i></span>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span='20'> 
							<el-form-item label="新密码" prop="newPassword">
								<el-input :type="newType" v-model="resetPasswordForm.newPassword" ref="newPw" @keyup.enter.native="funEnter('againPw')" placeholder="请输入新密码"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='4' class="icon-style"> 
							<span @click="changeType('newPassword')" v-if="this.newType == 'password'"><i class="iconfont icon-icon-eye-close"></i></span>
							<span @click="changeType('newPassword')" v-else><i class="iconfont icon-icon-eye-open"></i></span>
						 </el-col>
					</el-row>	
					<el-row>
						<el-col :span='20'> 	
							<el-form-item label="重输新密码" prop="againPassword">
								<el-input :type="againType" v-model.number="resetPasswordForm.againPassword" ref="againPw" @keyup.enter.native="submitResetPwForm"  placeholder="请重输新密码"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='4' class="icon-style"> 
							<span @click="changeType('againPassword')" v-if="this.againType == 'password'"><i class="iconfont icon-icon-eye-close"></i></span>
							<span @click="changeType('againPassword')" v-else><i class="iconfont icon-icon-eye-open"></i></span>
						 </el-col>
					</el-row>			
				</el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitResetPwForm">确 定</el-button>
                <el-button @click="resetPassword = false">取 消</el-button>
            </span>
        </el-dialog>
	</el-container>
</template>

<script>
	import aomMessagebox from './aom-messagebox.vue'
	import mixin from '$mixin/mixin.js'
	import {routeUser, routerRole, routerOrganization} from '$router/user.js'
	import {routerOrder} from '$router/order.js'
	import {routerCompany} from '$router/company.js'
	import {routerStatistic} from '$router/statistic.js'

	const preCls = 'platform'
	const relationForm = [
		routerOrder,
		{	
			path:'company',	
			meta: {
				title: '企业管理',
				icon:'iconfont icon-pinpai',
			}
		},
		{
			path: 'user',
			meta: {
				title: '系统管理',
				icon:'iconfont icon-yonghu',
			},
			children:[routeUser, routerRole, routerOrganization]
		},
		{
			meta: {
				title: '统计信息',
				icon:'iconfont icon-shiduan',
			},
			path: 'statistic',
			children: [routerStatistic],
		},
	]

	export default {
		name: "platform",
		mixins: [ mixin ],
		components:{aomMessagebox},
		data() {
			var _ = this;
			var oldPw = (rule, value, callback) => {
				if (!value) {
					callback(new Error('旧密码不能为空'));
				}else{
					if(_.curUserPw !==  value){
						callback(new Error('旧密码错误，请重新输入！'));
					}
					callback();
				}
      		};
			var newPw = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入新密码'));
				} else {
					if(_.curUserPw ===  value){
						callback(new Error('旧密码与新密码不能一致！'));
					}
					callback();
				}
			};
			var againPw = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入新密码'));
				} else if (value != _.resetPasswordForm.newPassword) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				preCls,
				menuList: [],
				currentIframeUrlPrefix: '',
				defaultOpenModule: 1,
				account: '',
				UserName: '',
				isCollapse: false,
				thema:'default',
				isShowDownList: false,
				resetPassword:false,
				resetPasswordForm:{
					oldPassword:'',
					newPassword:'',
					againPassword:''
				},
				curUserPw:'',
				oldType:'password',
				newType:'password',
				againType:'password',
				rules: {
					oldPassword: [
						{ required: true, validator: oldPw, trigger: 'blur' }
					],
					newPassword: [
						{ required: true,validator: newPw, trigger: 'blur' }
					],
					againPassword: [
						{ required: true,validator: againPw, trigger: 'blur' }
					],
					
				},
			}
		},	
		computed:{
			sideStyle(){
				return this.isCollapse ? {width: "64px"} : { width: "160px"};
			},
			iconStyle(){
				return this.isCollapse ? {left: "84px"} : { left: "180px"};
			},
			themaColor(){
				switch(this.thema){
					case 'default':
					case 'blue':
						return {color:'#409EFF'};
					case 'gitlib':
						return {color:'#292961'};
					case 'yellow':
						return {color:'#da8100'};
					default:
						return {color:'#409EFF'};
				}
			}
		},
		created() {

			this.menuList = relationForm
			this.$root.account = this.account = this.getToken('UserAccount')
			this.UserName = localStorage.getItem('UserName')
			this.$root.token = this.getToken('Token')
			// this.$root.token = this.getToken()
			// this.http.get(`${this.preApiName}/Platform/LoginUser/Rights?token=${this.$root.token}`).then( res => {
			// 	let data = res.data.data
			// 	let rights = JSON.parse(data.Rights)
			// 	this.$root.rights = rights
			// 	this.getListFromRelationForm(rights)
			// 	this.currentIframeUrlPrefix = this.menuList[this.defaultOpenModule].path
				this.urlJudeg()
			// 	this.$root.account = this.account = data.Account
			// 	this.$root.$emit('UserOnload')
			// }).catch( err=> {
			// 	this.showMessage('登录过期，请退出重新登录', 'error', ()=>{
			// 		this.$router.push('/login')
			// 	});
			// })
		},
		beforeRouteUpdate (to, from, next) {
			next()
			
			this.urlJudeg()
			this.$nextTick(()=>{
				this.$refs['globel-scroll'] ? this.$refs['globel-scroll'].scrollTo({x:0, y:0}) : void 0
			})
		},
		methods: {
			collapseMenu(){
				this.isCollapse = !this.isCollapse;
			},
			onChangeColor(thema){
				this.thema = thema;
				this.$root.$emit('change-color',thema);
			},
			urlJudeg() {
				let routeArr = this.$route.path.split('/')
				if(routeArr.length > 2){
					let menuList = this.menuList
					let activeUrl = this.getActiveUrl(routeArr[2]) 

					if(activeUrl == ''){
						this.defaultOpen()
					}else{
						this.defaultOpenModule = activeUrl
					}
				}else{
					this.defaultOpen()
				}
			},
			getActiveUrl(url) {
				let activeUrl = ''
				let menuList = this.menuList
				for(let i = 0; i < menuList.length; i++)
				{
					let o = menuList[i]
					if(!!o.children){
						for(let j = 0; j < o.children.length; j++)
						{
							let r = o.children[j]
							if(r.path == url){
								activeUrl = r.path
								break
							}
						}
						if(activeUrl) break
					}else{
						if(o.path == url){
							activeUrl = o.path
							break
						}
					}
				}
				return activeUrl
			},
			defaultOpen(){
				if(this.menuList[0].children){
					this.$router.push(`${this.preName}/${this.menuList[0].children[0].path}`)
				}else{
					this.$router.push(`${this.preName}/${this.menuList[0].path}`)
				}
			},
			changeUrlPrefix(path) {
				if(!!path) this.$router.push(`${this.preName}/${path}`)
			},
			clickFatherMenu(item) {
				this.$router.push(`${this.preName}/${item.children[0].path}`)	
			},
			quit() {
				if(!!this.getToken('Token')){
					this.http.delete(`/financial/platform/login-user?Token=${this.$root.token}`).then( res=> {
						if(res.status == 204){
							this.$root.token = null
							this.$router.push(`/login`)
						}
					})
				}else{
					this.$router.push(`/login`)
				}
				
			},
			onMenuOpened(path, args){//changeUrlPrefix:当前模块名称
				this.$router.push(`${this.preName}/${path}`)
			},
			getListFromRelationForm(right) {
				let listArr = []
				right.forEach( item => {
					switch (item.UrlPrefix) {
						case '/Customer': 
							listArr.push(relationForm[0])
							break
						case '/BrandVersion': 
							listArr.push(relationForm[3])
							break
						case '/Contract': 
							listArr.push(relationForm[1])
							break
						case '/Platform': 
							listArr.push(relationForm[5])
							break
						case '/Order': 
							listArr.push(relationForm[2])
							break
						case '/ChannelCabs': 
							listArr.push(relationForm[6])
							break
						case '/EditAdvbill': 
							listArr.push(relationForm[4])
							listArr.push(relationForm[8])
							break				
					}
				})
				listArr.push(relationForm[7])
				
				this.menuList = listArr
			},
			resetPasswordModal(){			
				this.resetPassword = true;
				this.$nextTick(()=>{
					this.$refs['oldPw'].$refs.input.focus();
				})
				if (this.$refs['ruleForm']!==undefined) {
					this.$refs['ruleForm'].resetFields();
					this.oldType='password';
					this.newType='password';
					this.againType='password';
				}
				//查询用户信息的密码
				this.getUserData(this.account);
			},
			getUserData(account){
				this.http.get(`${this.preApiName}/financial/platform/users?Account=${account}`).then( (res) => {
					this.curUserPw = res.data.data.length > 0 ? res.data.data[0].Password : '';
            	})
			},
			async submitResetPwForm(){
				let data,status;
				if(!this.getValidateStatus())return;
				//获取数据
				data = this.getFormData();
				console.log(data);
				//发送修改请求
				status = await this.sendData(data);
				if(status){
					this.showMessage(
						'密码修改成功！',
						'success'
					);
					this.resetPassword = false;
				}else{
					this.showMessage('密码修改成功！','error');
				}
			},
			getValidateStatus(){
				let validStatus = false;
				this.$refs['ruleForm'].validate((valid) => {
					validStatus = valid;
				})
				return validStatus
			},
			getFormData(){
				let formData={
					Account:this.account,
					OldPassword:this.resetPasswordForm.oldPassword,
					NewPassword:this.resetPasswordForm.newPassword
				}
				return formData;
			},
			sendData(data){
				return new Promise(resolve => {
					this.http.put(`${this.preApiName}/financial/platform/user-password?Account=${this.account}`,data).then( (res) => {
						if(res.status == 201){
							resolve(true);
						}else{
							resolve(false)
						}
					})
				})
			},
			changeType(type){
				if(type=='oldPassword'){
					this.oldType= this.oldType == 'password' ? '' : 'password';
				}else if(type== 'newPassword' ){
					this.newType= this.newType == 'password' ? '' : 'password';
				}else if(type== 'againPassword' ){
					this.againType= this.againType == 'password' ? '' : 'password';
				}
			},
			funEnter(item){
				if(item == 'newPw'){
				this.$refs.newPw.focus()
				}else if(item == 'againPw'){
					this.$refs.againPw.focus()
				}
			},
			onScroll(info) {
				this.$root.$emit('frame-scroll', info)
			}
		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body{
  width: 100vw;
  height: 100vh;
  margin: 0px;
}
.message-box-globel{
	height: 30px;
	position: relative;
	background-color: #db3b21;
	color: #fff;
	line-height:30px;
	text-align: center;
	font-size: 18px;
	cursor: pointer;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
.icon-style{
	height: 40px;
    line-height: 40px;
    padding-right: 20px;
	text-align: center;
    cursor: pointer;
}
.icon-style:hover{
	color: #409EFF;
}
.el-dialog .el-dialog__body{
	padding: 30px 20px 0px 20px !important;
}
.dialog-footer .el-button{
	width: 100px!important;
}
</style>

