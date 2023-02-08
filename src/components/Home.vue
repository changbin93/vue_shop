<template>
    <div>
        <el-button type="info" @click="logout">Logout</el-button>
    </div>
</template>

<script>
export default {
  name: 'VueShopHome',

  data () {
    return {

    }
  },

  mounted () {

  },

  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
