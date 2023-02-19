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
      <el-table :data="roleList" border stripe row-key="id">
        <!-- for auths -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children"
              :key="item1.id">
              <!-- first level auth -->
              <el-col :span="5">
                <el-tag closable @close="removeAuthById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- second level -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children"
                  :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeAuthById(scope.row, item2.id)">{{ item2.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable
                      @close="removeAuthById(scope.row, item3.id)">{{ item3.authName
                      }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="S/N"></el-table-column>
        <el-table-column label="Role Name" prop="roleName"></el-table-column>
        <el-table-column label="Role Desc" prop="roleDesc"></el-table-column>
        <el-table-column label="Actions" width="300px">
          <template v-slot="scope">

            <el-button type="primary" size="mini" icon="el-icon-edit">Edit</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">Delete</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetAuthDialog(scope.row)">Set
              Auth</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- set auth dialog -->
    <el-dialog v-model="setAuthDialogVisible" title="Set Auth" width="50%" @close="setAuthDialogColsed">
      <el-tree :data="authList" :props="authProps" show-checkbox node-key="id" default-expand-all
        :default-checked-keys="defKeys" ref="treeRef" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setAuthDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="allotAuth">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'VueShopRoles',

  data () {
    return {
      roleList: [],
      setAuthDialogVisible: false,
      authList: [],
      authProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
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
    },
    removeAuthById (roleInfo, authId) {
      // alert
      this.$messagebox.confirm('This will permanently delete the auth, are you sure?', 'Delete User', {

        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'

      }).then(async () => {
        const { data: res } = await axios.delete(`roles/${roleInfo.id}/rights/${authId}`)
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('fail to delete')
        roleInfo.children = res.data
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          })
        })
    },
    async showSetAuthDialog (role) {
      this.roleId = role.id
      const { data: res } = await axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('fail to get auth list')
      }

      this.authList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setAuthDialogVisible = true
    },
    getLeafKeys (node, arr) {
      // get all level 3 auth under a role recursively
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },

    setAuthDialogColsed () {
      this.defKeys = []
    },
    async allotAuth () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys);
      const idStr = keys.join(',')
      const { data: res } = await axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('fail to set auths')
      this.$message.success('set auths success')
      this.getRoleList()
      this.setAuthDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
