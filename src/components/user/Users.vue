<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">Homepage</el-breadcrumb-item>
      <el-breadcrumb-item>User management</el-breadcrumb-item>
      <el-breadcrumb-item>User list</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card -->
    <el-card>
      <!-- search area -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" placeholder="Please input" clearable @clear="getUserList">
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">Add User</el-button>
        </el-col>
      </el-row>
      <!-- display area -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="S/N"></el-table-column>
        <el-table-column label="Name" prop="username"></el-table-column>
        <el-table-column label="email" prop="email"></el-table-column>
        <el-table-column label="Mobile" prop="mobile"></el-table-column>
        <el-table-column label="Role" prop="role_name"></el-table-column>
        <el-table-column label="State">
          <template v-slot="scope">
            <div>
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
            </div>
          </template>

        </el-table-column>
        <el-table-column label="Actions" width="200px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="Setting roles" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"
                @click="showSetRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>

        </el-table-column>
      </el-table>

      <!-- page -->
      <el-pagination v-model:current-page="queryInfo.pagenum" v-model:page-size="queryInfo.pagesize"
        :page-sizes="[1, 2, 5, 10]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
    <!-- add user dialog -->
    <el-dialog v-model="addDialogVisible" title="Add User" width="50%" @close="addDialogClosed">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="120px" :size="formSize" status-icon>
        <el-form-item label="Username" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item label="Moblie" prop="mobile">
          <el-input v-model="addForm.mobile" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="triggerAddUser">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- edit user dialog -->
    <el-dialog v-model="editDialogVisible" title="Edit User" width="50%" @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="120px" status-icon>
        <el-form-item label="Username">
          <el-input v-model="editForm.username" disabled />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="Moblie" prop="mobile">
          <el-input v-model="editForm.mobile" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="triggerEditUser">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- set role dialog -->
    <el-dialog v-model="setRoleDialogVisible" title="Set Role" width="50%">
      <div>
        <p>Current User: {{ userInfo.username }}</p>
        <p>Current Role: {{ userInfo.role_name }}</p>
        <p>Set New Role:
          <el-select v-model="selectedRoleId" class="m-2" placeholder="Select" size="large">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id" />
          </el-select>
        </p>

      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="saveRoleInfo">
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
  name: 'VueShopUsers',

  data () {
    // email validator
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('Please enter a valid email address'))
    }

    // phone validator
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^(0065)?(9|8)[0-9]{7}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('Please enter a valid mobile number'))
    }

    return {
      // get user list params
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      // control add user dialog
      addDialogVisible: false,
      // add user data
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // validation
      addFormRules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' },
          { min: 6, max: 15, message: 'the username should be 6-15 characters', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          { min: 10, max: 20, message: 'the password should be 6-15 characters', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      editDialogVisible: false,
      editForm: {},

      editFormRules: {
        email: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      setRoleDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectedRoleId: ''

    }
  },

  created () {
    this.getUserList()
  },

  mounted () {

  },

  methods: {
    async getUserList () {
      const { data: res } = await axios.get('users', { params: this.queryInfo })

      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          type: 'error'
        })
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // pagesize change
    handleSizeChange (newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged (userInfo) {
      const { data: res } = await axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message({
          message: 'user update failed',
          type: 'error'
        })
      }
      this.$message({
        message: 'user updated successfully',
        type: 'success'
      })
    },
    // when addDialog is closed
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // click confirm button-> to add user
    triggerAddUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await axios.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.addDialogVisible = false
          return this.$message.error('add user failed')
        }
        this.$message.success('User added!')
        this.addDialogVisible = false
        this.getUserList()
      })
    },

    async showEditDialog (id) {
      const { data: res } = await axios.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('fail to get user info')
      this.editForm = res.data
      this.editDialogVisible = true
    },

    triggerEditUser (id) {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await axios.put('users/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) {
          this.addDialogVisible = false
          return this.$message.error('edit user failed')
        }
        this.$message.success('User edited!')
        this.editDialogVisible = false
        this.getUserList()
      })
    },

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    removeUserById (id) {
      this.$messagebox.confirm('This will permanently delete user, are you sure?', 'Delete User', {

        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'

      }).then(async () => {
        const { data: res } = await axios.delete('users/' + id)
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('fail to delete')

        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
        this.getUserList()
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          })
        })
    },
    async showSetRoleDialog (userInfo) {
      this.userInfo = userInfo
      // get all role list before open dialog
      const { data: res } = await axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error('fail to get role list')
      // console.log(res);
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },

    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('Please select a role')
      }
      const { data: res } = await axios.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error('fail to set role')
      }

      this.$message.success('role has been set')
      this.getUserList()
      this.selectedRoleId = ''
      this.setRoleDialogVisible = false
    }

  }

}
</script>

<style lang="scss" scoped></style>
