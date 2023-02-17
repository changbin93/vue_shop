<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Auth management</el-breadcrumb-item>
            <el-breadcrumb-item>Role list</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- card -->
        <el-card>
            <!-- add role button area -->
            <el-row>
                <el-col>
                    <el-button type="primary">Add Role</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" border stripe>
                <!-- for auths -->
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <pre>
                            {{ scope.row }}
                            </pre>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="S/N"></el-table-column>
                <el-table-column label="Role Name" prop="roleName"></el-table-column>
                <el-table-column label="Role Desc" prop="roleDesc"></el-table-column>
                <el-table-column label="Actions" width="300px">
                    <template v-slot="scope">
                        <span>{{ scope.row }}</span>
                        <el-button type="primary" size="mini" icon="el-icon-edit">Edit</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete">Delete</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-setting">Set Auth</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'VueShopRoles',

  data () {
    return {
      roleList: []
    }
  },

  mounted () {
    this.getRoleList()
  },

  methods: {
    async getRoleList () {
      const { data: res } = await axios.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('fail to get role list')
      }
      this.roleList = res.data
    }
  }
}
</script>

<style lang="less" scoped></style>
