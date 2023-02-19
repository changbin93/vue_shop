<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Goods management</el-breadcrumb-item>
            <el-breadcrumb-item>Category List</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCategoryDialog">Add Category</el-button>
                </el-col>
            </el-row>
            <el-row>
                <!-- table area -->
                <el-table :data="cateList" style="width: 100%; margin-bottom: 20px" row-key="id"
                    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" border>
                    <el-table-column prop="cat_name" label="Category Name" />
                    <el-table-column prop="cat_deleted" label="IsActive">
                        <template v-slot="scope">
                            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                            <i class="el-icon-error" v-else style="color:red"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cat_level" label="Sort">
                        <template v-slot="scope">
                            <el-tag v-if="scope.row.cat_level === 0">Level 1</el-tag>
                            <el-tag type="success" v-else-if="scope.row.cat_level === 1">Level 2</el-tag>
                            <el-tag type="warning" v-else>Level 3</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="Actions">
                        <template>
                            <el-button type="primary" class="el-icon-edit">Edit</el-button>
                            <el-button type="danger" class="el-icon-delete">Delete</el-button>
                        </template>
                    </el-table-column>

                </el-table>

                <!-- pagination area -->
            </el-row>
            <el-pagination v-model:current-page="queryInfo.pagenum" v-model:page-size="queryInfo.pagesize"
                :page-sizes="[1, 2, 5, 10]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-card>

        <!-- add category dialog -->
        <el-dialog v-model="addCatedialogVisible" title="Add Category" width="50%" @close="closeAddCateDialog">
            <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateRules" label-width="150px" status-icon>
                <el-form-item label="Category Name" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name" />
                </el-form-item>
                <el-form-item label="Parent Category: ">
                    <el-cascader v-model="selectedParentCatIds" :options="parentCateList" :props="cateProps"
                        @change="parentCateChange" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addCatedialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="addCate">
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
  name: 'VueShopCategory',

  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      addCatedialogVisible: false,
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: 'Please enter a category name', trigger: 'blur' }

        ]
      },
      parentCateList: [],
      cateProps: {
        expandTrigger: 'hover',
        children: 'children',
        label: 'cat_name',
        value: 'cat_id',
        checkStrictly: true

      },
      selectedParentCatIds: []

    }
  },

  created () {
    this.getCateList()
  },

  mounted () {

  },

  methods: {
    async getCateList () {
      const { data: res } = await axios.get('categories', { params: this.queryInfo })
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('fail to get cate list')
      this.cateList = res.data.result
      this.total = res.data.total
      // console.log(this.cateList);
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCategoryDialog () {
      this.addCatedialogVisible = true
      this.getParentCateList()
    },
    async getParentCateList () {
      const { data: res } = await axios.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('fail to get category list')
      }
      this.parentCateList = res.data
    },
    parentCateChange () {
      // console.log(this.selectedParentCatIds);
      if (this.selectedParentCatIds !== null && this.selectedParentCatIds.length > 0) {
        // choose parent cate id
        this.addCateForm.cat_pid = this.selectedParentCatIds[this.selectedParentCatIds.length - 1]
        this.addCateForm.cat_level = this.selectedParentCatIds.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    addCate () {
      // console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await axios.post('categories', this.addCateForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('fail to add category')
        }
        this.$message.success('category added')
        this.getCateList()
        this.addCatedialogVisible = false
      })
    },

    closeAddCateDialog () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedParentCatIds = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped></style>
