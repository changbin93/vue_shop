<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Auth management</el-breadcrumb-item>
            <el-breadcrumb-item>Auth list</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- card -->
        <el-card>
            <el-table :data="authList" border stripe>
                <el-table-column type="index" label="S/N"></el-table-column>
                <el-table-column label="Auth Name" prop="authName"></el-table-column>
                <el-table-column label="Path" prop="path"></el-table-column>
                <el-table-column label="Auth Level" prop="level">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.level === '0'">Level 1</el-tag>
                        <el-tag type="success" v-if="scope.row.level === '1'">Level 2</el-tag>
                        <el-tag type="warning" v-if="scope.row.level === '2'">Level 3</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'VueShopAuth',

  data () {
    return {
      authList: []
    }
  },

  mounted () {
    this.getAuthList()
  },

  methods: {
    async getAuthList () {
      const { data: res } = await axios.get('rights/list')

      if (res.meta.status !== 200) return this.$message.error('fail to get auth list')
      this.authList = res.data
    }
  }
}
</script>

<style lang="less" scoped></style>
