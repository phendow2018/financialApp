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
        <div class="contract-login-img">
            <div class="img-notebook">
            </div>
             <div class="img-coffee">
                <div class="img-xuanwo">
                    <div class="img-xuanzhuan"></div>
                </div>
            </div>
             <div class="img-keyboard">

            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            username: '',
            password: '',
            error: null,
            isLogining: false
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
                    
                    localStorage.setItem('UserName', res.data.UserName)
                    localStorage.setItem('isLogin', 1)
                    _.$router.push('/platform')
                }
            }).catch(err => {
                _.isLogining = false
                _.error = err.response.data.Message
            })
            return;
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

