<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 图像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单 利用ref属性来重置表单-->
      <el-form :model="form" :rules="rules" class="login_form" ref="formRef">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="form.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button :plain="true" type="primary" @click="login"
            >登录</el-button
          >
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 18,
            message: '长度在 3 到 18 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3,
            max: 18,
            message: '长度在 3 到 18 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    reset() {
      //重置表单函数
      this.$refs.formRef.resetFields()
    },
    login() {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.form)
        if (res.meta.status !== 200) {
          this.$message.error('密码或账号错误')
        } else {
          this.$message({
            message: '恭喜您，登陆成功！',
            type: 'success',
          })
          //1，将登录成功的token保存到客户端的sessionStorage中
          //1.1项目中除登录外的其他API接口，必须在登陆之后才能访问
          //1.2 token只应在当前网页打开期间生效，所以将token保存在sessionStorage中
          window.sessionStorage.setItem('token', res.data.token)
          //2，通过编程式导航跳转到后台主页，路由地址是/home
          this.$router.push('/home')
        }
      })
    },
  },
}
</script>

<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>