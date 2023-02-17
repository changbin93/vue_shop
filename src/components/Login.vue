<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form ref="loginFormRef" :model="form" :rules="rules" class="login_form">
        <!-- username -->
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="Username">
            <template #prefix>
              <el-icon class="el-input__icon">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" placeholder="Password">
            <template #prefix>
              <el-icon class="el-input__icon">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- buttons -->
        <div class="btn_box">
          <el-form-item>
            <el-button type="primary" @click="login">Login</el-button>
            <el-button type="info">Register</el-button>
          </el-form-item>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script>
import { User, Lock } from '@element-plus/icons-vue'
import axios from 'axios'
// import { ElMessage } from 'element-plus';

export default {
  name: 'VueShopLogin',

  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          {
            required: true, message: 'Please enter the username', trigger: 'blur'
          },

          {
            min: 5, max: 20, message: 'username should be 5 to 20 characters', trigger: 'blur'
          }

        ],
        password: [
          { required: true, message: 'Please enter the password', trigger: 'blur' },
          { min: 6, max: 20, message: 'password should be 8 to 20 characters', trigger: 'blur' }
        ]
      }

    }
  },

  components: {
    User,
    Lock
  },

  mounted () {

  },

  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        const { data: res } = await axios.post('login', this.form)
        if (res.meta.status !== 200) {
          return this.$message({
            message: 'Username or password is invalid',
            type: 'error'
          })
        }
        this.$message({
          message: 'Login successfully',
          type: 'success'
        })

        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
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

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .btn_box {
    display: flex !important;
    justify-content: flex-end !important;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
