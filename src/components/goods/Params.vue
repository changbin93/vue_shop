<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Goods management</el-breadcrumb-item>
            <el-breadcrumb-item>Category Params</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert title="Only level 3 categories can be selected" type="warning" :closable="false" show-icon />
            <el-row class="cat_opt">
                <el-col>
                    <span>Choose Goods Category: </span>
                    <!-- cascader -->
                    <el-cascader v-model="selectedCatIds" :options="cateList" :props="cateProps" @change="handleChange" />

                </el-col>
            </el-row>

            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!-- dynamic -->
                <el-tab-pane label="Dynamic Params" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">Add
                        Params</el-button>
                    <!-- dynamic params table -->
                    <el-table :data="manyTableData" border stripe row-key="attr_id">
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                                    @close="handleClose(i, scope.row)">
                                    {{ item }}
                                </el-tag>
                                <el-input v-if="scope.row.inputVisible" ref="InputRef" v-model="scope.row.inputValue"
                                    class="input-new-tag" size="small" @keyup.enter="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)" />
                                <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="S/N"></el-table-column>
                        <el-table-column label="Param name" prop="attr_name"></el-table-column>
                        <el-table-column label="Actions">
                            <template v-slot="scope">
                                <el-button type="primary" class="el-icon-edit"
                                    @click="showEditDialog(scope.row.attr_id)">Edit</el-button>
                                <el-button type="danger" class="el-icon-delete"
                                    @click="removeParams(scope.row.attr_id)">Delete</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="Static Params" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">Add
                        Attributes</el-button>
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                                    @close="handleClose(i, scope.row)">
                                    {{ item }}
                                </el-tag>
                                <el-input v-if="scope.row.inputVisible" ref="InputRef" v-model="scope.row.inputValue"
                                    class="input-new-tag" size="small" @keyup.enter="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)" />
                                <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="S/N"></el-table-column>
                        <el-table-column label="Attributes name" prop="attr_name"></el-table-column>
                        <el-table-column label="Actions">
                            <template v-slot="scope">
                                <el-button type="primary" class="el-icon-edit"
                                    @click="showEditDialog(scope.row.attr_id)">Edit</el-button>
                                <el-button type="danger" class="el-icon-delete"
                                    @click="removeParams(scope.row.attr_id)">Delete</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

            </el-tabs>
        </el-card>

        <!-- add param/attributes dialog -->
        <el-dialog v-model="addDialogVisible" :title="'Add ' + titleText" width="50%" @close="addDialogClosed">
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="120px" status-icon>
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="addAttr">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- edit param/attributes dialog -->
        <el-dialog v-model="editDialogVisible" :title="'Edit ' + titleText" width="50%" @close="editDialogClosed">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="120px" status-icon>
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="editAttr">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'VueShopParams',

    data() {
        return {
            cateList: [],
            total: 0,
            cateProps: {
                expandTrigger: 'hover',
                children: 'children',
                label: 'cat_name',
                value: 'cat_id',
            },
            selectedCatIds: [],
            activeName: 'many',
            paramsList: [],
            manyTableData: [],
            onlyTableData: [],
            addDialogVisible: false,
            addForm: {
                attr_name: ''
            },
            // vilidation
            addFormRules: {
                attr_name: [
                    { required: true, message: 'Please enter an attribution name', trigger: 'blur' }
                ]
            },
            editDialogVisible: false,
            editForm: {

            },
            editFormRules: {
                attr_name: [
                    { required: true, message: 'Please enter an attribution name', trigger: 'blur' }
                ]
            },


        };
    },

    mounted() {
        this.getCateList()
    },

    methods: {
        async getCateList() {
            const { data: res } = await axios.get('categories')

            if (res.meta.status !== 200) return this.$message.error('fail to get cate list')
            this.cateList = res.data;
            this.total = res.data.total

        },
        handleChange() {
            // console.log(this.selectedCatIds);
            this.getPramsList();
        },
        handleClick() {
            this.getPramsList()
        },


        async getPramsList() {
            if (this.selectedCatIds !== null && this.selectedCatIds.length !== 3) {
                this.selectedCatIds = [];
                this.manyTableData = [];
                this.onlyTableData = [];
                return
            }
            const { data: res } = await axios.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
            if (res.meta.status !== 200) {
                return this.$message.error('fail to get params')
            }
            // this.paramsList = res.data;


            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                item.inputVisible = false;
                item.inputValue = '';

            })
            console.log(res.data);
            if (this.activeName === 'many') {
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }
        },
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        addAttr() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await axios.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })

                if (res.meta.status !== 201) return this.$message.error('fail to add attributes')
                // console.log(res);
                this.$message.success('Attribute Added!!!')
                this.addDialogVisible = false
                this.getPramsList()
            })
        },
        async showEditDialog(attr_id) {
            const { data: res } = await axios.get(`categories/${this.cateId}/attributes/${attr_id}`)
            if (res.meta.status !== 200) return this.$message.error('fail to get atrributes by Id')
            // console.log(res);
            this.editForm = res.data
            this.editDialogVisible = true;
        },
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        editAttr() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await axios.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.activeName
                })

                if (res.meta.status !== 200) return this.$message.error('fail to edit attributes')
                // console.log(res);
                this.$message.success('Attribute Updated!!!')
                this.editDialogVisible = false
                this.getPramsList()
            })

        },
        removeParams(attr_id) {
            this.$messagebox.confirm(
                'This will permanently remove the param. Continue?',
                'Warning',
                {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                }
            )
                .then(async () => {
                    const { data: res } = await axios.delete(`categories/${this.cateId}/attributes/${attr_id}`)
                    if (res.meta.status !== 200) return this.$message.error('fail to delete,please try again');
                    this.getPramsList()
                    this.$message({
                        type: 'success',
                        message: 'Delete completed',
                    })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled',
                    })
                })
        },

        async handleInputConfirm(row) {
            if (row.inputValue.trim().length !== 0) {
                // 后续处理
                row.attr_vals.push(row.inputValue.trim())
                this.saveAttrVals(row)

            }

            row.inputValue = '';
            row.inputVisible = false;
            return

        },
        showInput(row) {
            row.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.InputRef.$refs.input.focus()
            })
        },

        async saveAttrVals(row) {
            const { data: res } = await axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' '),
            })
            if (res.meta.status !== 200) {
                return this.$message.error('fail to update')
            }
            this.$message.success('success')
        },

        handleClose(i, row) {
            row.attr_vals.splice(i, 1)
            this.saveAttrVals(row)
        }

    },
    computed: {
        // return true if button is disabled
        isBtnDisabled() {
            if (this.selectedCatIds !== null && this.selectedCatIds.length !== 3) {
                return true;
            }
            return false
        },

        cateId() {
            if (this.selectedCatIds !== null && this.selectedCatIds.length === 3) {
                return this.selectedCatIds[2];
            }
            return null;
        },
        titleText() {
            return this.activeName === 'many' ? 'Dynamic param' : 'Static Attributes'
        }
    }
};
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}

.el-tag {
    margin: 10px
}

.input-new-tag {
    width: 100px;
}
</style>