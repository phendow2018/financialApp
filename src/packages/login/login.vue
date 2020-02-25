<template>
    <div class="contract-login" @keyup.enter="funSubmit" @click="funOnBlur">
        <div class="contract-login-content">
            <div class="login-content-title">
                <div>
                    <span class="iconfont"></span>
                </div>
                <div class="title-right">
                    <span>
                        财务下单系统
                    </span>
                </div>
            </div>
            <div class="login-content-form">
                <div class="form-login">
                    <div class="login-number">
                        登录账号
                    </div>
                </div>
                <div class="content-user user-password-line">
                    <div class="user-password-div">
                        <span class="iconfont icon-yonghu content-span"></span>
                    </div>
                    <div class="content-user-password-title">
                        <span class="content-user-password">用户名</span>
                        <input class="content-input user-name" autofocus ref="name" @keyup.enter="funEnterPassword" @focus="funOnFocus('user')" v-model="username">
                    </div>
                </div>
                <div class="content-password user-password-line">
                    <div class="user-password-div">
                        <span class="iconfont icon-suo content-span"></span>
                    </div>
                    <div class="content-user-password-title">
                        <span class="content-user-password">密&nbsp;&nbsp;&nbsp;码</span>
                        <input class="content-input password" ref="password" @focus="funOnFocus('password')" v-model="password" type="password">
                    </div>
                </div>
                <div class="content-login">
                    <el-button type="primary" class="content-login-button" @click="funSubmit">立即登录</el-button>
                </div>
                <div class="content-prompt-message">
                    <label for="" class="prompt-message-label" v-show="error">{{error}}</label>
                </div>
            </div>
        </div>
        <!-- <div class="contract-login-img">
            <div class="img-notebook">
            </div>
             <div class="img-coffee">
                <div class="img-xuanwo">
                    <div class="img-xuanzhuan"></div>
                </div>
            </div>
             <div class="img-keyboard">

            </div>
        </div> -->
    </div>
</template>
<script>
import RightConvert from '@/common/right'
export default {
    data(){
        return{
            username: '',
            password: '',
            error: null,
            isLogining: false,
            RightConvert: new RightConvert()
        }
    },
    created() {
        this.username = this.password = '';
    },
    methods:{
        funEnterPassword(){
            let pw;
            pw = this.password;
            if(pw){
               this.funSubmit();
            }else{
                $(".content-user").removeClass('focus-input-border-class').addClass('normal-input-border-class');
                $(".content-password").removeClass('normal-input-border-class').addClass('focus-input-border-class');
                // $(".content-user").css('border','1px solid #eaeaea');
                // $('.content-password').css('border','1px solid #4b95ef');
                this.$refs.password.focus(); 
            }
            event.stopPropagation()
        },
        funSubmit(){
            if(this.isLogining) return
            $('.content-input').blur()
            $(".user-password-line").removeClass('focus-input-border-class').addClass('normal-input-border-class');
            // $('.user-password-line').css('border','1px solid #eaeaea')
            let _ = this
            this.isLogining = true
            this.http.post(`/financial/platform/login-user`, {
                Account: this.username,
                Password: this.password
            }).then( res => {
                _.isLogining = false
                if(res.status == 201){
                    let {rights, modules} = _.combineRightList(res.data.Roles)
                    localStorage.setItem('UserName', res.data.UserName)
                    localStorage.setItem('isLogin', 1)
                    localStorage.setItem('rights', rights)
                    localStorage.setItem('modules', modules)
                    _.$router.push('/platform')
                }
            }).catch(err => {
                _.$root.roles = []
                _.isLogining = false
                _.error = err.response.status === 504 ? '后台服务未开启，请联系管理员' : err.response.data.Message
            })
            return;
        },
        combineRightList(roles) { //合并各个角色的权限 roles[0].Rights参考 common/modules内各个模块的权限
            let rightsArr = [],modulesArr = [],_ = this
                
            roles.forEach(v => {
                let {rights, modules} = _.RightConvert.toString(v.Rights)

                rightsArr = [...rightsArr, ...rights]
                modulesArr = [...modules, ...modulesArr]
                // v.Rights.forEach(vv => {
                //     let mods = [...modules, vv.Flag]
                //     let rigs = _.decodeRight(vv.Flag, vv.Functions)

                //     rights = [...rights, ...(_.decodeRight(vv.Flag, vv.Functions))]
                //     modules = mods
                // })
            })

            return {rights: [...new Set(rightsArr)], modules: [...new Set(modulesArr)]}
        },
        decodeRight(flag, Functions) {
            if(typeof Functions == 'object') {
                let arr = []
                Functions.forEach(v => {
                    let prefix = `${flag}_${v.id}`

                    return v.functions.forEach((vv) => {
                        arr.push(`${prefix}_${vv.id}`)
                    })
                })

                return arr
            } else {
                return functions
            }
        },
        funFocus(userPassword, frameLine){
            // $('.user-password-line').css('border','1px solid #eaeaea');
            $(".user-password-line").removeClass('focus-input-border-class').addClass('normal-input-border-class');
            $(userPassword).focus();
            // $(frameLine).css('border','1px solid #4b95ef');
            $(frameLine).removeClass('normal-input-border-class').addClass('focus-input-border-class');
        },
        funOnBlur(e){
            var target = $(e.target);
             if(!target.is('.content-input')){
                 $(".user-password-line").removeClass('focus-input-border-class').addClass('normal-input-border-class');
                //  $('.user-password-line').css('border','1px solid #eaeaea');
                
            }
        },
        funOnFocus(e){
            if(e === 'user'){
                $(".content-user").removeClass('normal-input-border-class').addClass('focus-input-border-class');
                $(".content-password").removeClass('focus-input-border-class').addClass('normal-input-border-class');
                // $('.content-password').css('border','1px solid #eaeaea');
                // $(".content-user").css('border','1px solid #4b95ef');
                this.$refs.name.focus();
            }else if(e === 'password'){
            //    $(".content-user").css('border','1px solid #eaeaea');
            //    $('.content-password').css('border','1px solid #4b95ef');
                $(".content-user").removeClass('focus-input-border-class').addClass('normal-input-border-class');
                $(".content-password").removeClass('normal-input-border-class').addClass('focus-input-border-class');
               this.$refs.password.focus();
            }
        }
    },
    mounted(){
        this.funOnFocus('user')
    }
}
</script>

