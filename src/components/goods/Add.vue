<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Goods management</el-breadcrumb-item>
            <el-breadcrumb-item>Add Product</el-breadcrumb-item>
        </el-breadcrumb>


        <el-card>
            <el-alert title="Add Product Infomation" type="info" center show-icon :closable="false" />
            <el-steps :space="300" :active="activeStep - 0" finish-status="success" align-center>
                <el-step title="Basic Info" />
                <el-step title="Product Params" />
                <el-step title="Product Attributes" />
                <el-step title="Product Images" />
                <el-step title="Product Desc" />
                <el-step title="Done" />
            </el-steps>

            <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px" status-icon
                label-position="top">
                <el-tabs tab-position="left" class="demo-tabs" v-model="activeStep" :before-leave="beforeTabLeave"
                    @tab-click="tabClicked">
                    <el-tab-pane label="Basic Info" name="0">
                        <el-form-item label="Product Name" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="Product Price" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="Product weight" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="Product Quantity" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps"
                            @change="handleChange" />
                    </el-tab-pane>
                    <el-tab-pane label="Product Params" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border />

                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="Product Attributes" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="Product Images" name="3">
                        <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                            list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button type="primary">Click to upload</el-button>
                            <template #tip>
                                <div class="el-upload__tip">
                                    jpg/png files with a size less than 500kb
                                </div>
                            </template>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="Product Desc" name="4">
                        <!-- markdown editor -->
                        <div style="border: 1px solid #ccc;">
                            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig"
                                :mode="mode" />
                            <Editor style="height: 500px; overflow-y: hidden;" v-model="addForm.goods_introduce"
                                :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated" />
                        </div>

                        <el-button type="primary" class="btn_add" @click="add">Add Product</el-button>
                    </el-tab-pane>

                </el-tabs>


            </el-form>
        </el-card>

        <el-dialog v-model="previewVisible" title="Photo Preview" width="50%">
            <img :src="previewPath" alt="" class="previewImg">

        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
    name: 'VueShopAdd',
    components: {
        Editor, Toolbar

    },

    data() {
        return {
            activeStep: '0',
            addForm: {
                goods_name: '',
                goods_price: 1,
                goods_weight: 1,
                goods_number: 1,
                goods_cat: [],
                pics: [
                ],
                goods_introduce: '',
                attrs: []
            },
            addRules: {
                goods_name: [
                    { required: true, message: 'Please enter product name', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: 'Please enter product price', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: 'Please enter product weight', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: 'Please enter product quantity', trigger: 'blur' }
                ]
            },
            cateList: [],
            cateProps: {
                expandTrigger: 'hover',
                children: 'children',
                label: 'cat_name',
                value: 'cat_id',
            },

            manyTableData: [],
            onlyTableData: [],
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            previewVisible: false,
            previewPath: '',
            editor: null,
            toolbarConfig: {},
            editorConfig: { placeholder: '请输入内容...' },
            mode: 'default', // or 'simple'

        };
    },

    mounted() {
        this.getCateList();
        // setTimeout(() => {
        //     this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
        // }, 1500)

    },

    methods: {
        //get all product cate
        async getCateList() {
            const { data: res } = await axios.get('categories')
            if (res.meta.status !== 200) return this.$message.error('fail to get cate list')
            this.cateList = res.data

        },
        handleChange() {
            // console.log(this.addForm.goods_cat);
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }
            // console.log(this.addForm.goods_cat);

        },
        beforeTabLeave(activeName, oldActiveName) {
            // console.log('activeName: ' + activeName);
            // console.log('oldActiveName: ' + oldActiveName);
            if (oldActiveName === '0' && this.addForm.goods_cat.length === 0) {
                this.$message.error('Please select a category')
                return false
            }
        },
        async tabClicked() {
            // console.log(this.activeStep);
            if (this.activeStep === '1') {
                const { data: res } = await axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
                if (res.meta.status !== 200) return this.$message.error('fail to get param')
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.legnth === 0 ? [] : item.attr_vals.split(' ')
                })
                this.manyTableData = res.data;
                // console.log(this.manyTableData);
            } else if (this.activeStep === '2') {
                const { data: res } = await axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
                if (res.meta.status !== 200) return this.$message.error('fail to get attributes')
                this.onlyTableData = res.data;
            }
        },
        handlePreview(file) {
            this.previewPath = file.response.data.url;
            this.previewVisible = true
        },
        handleRemove(file) {
            const filePath = file.response.data.tmp_path;
            const i = this.addForm.pics.findIndex(x => {
                x.pic === filePath
            })
            this.addForm.pics.splice(i, 1)

        },
        handleSuccess(response) {
            const picInfo = { pic: response.data.tmp_path }
            this.addForm.pics.push(picInfo);
            console.log(this.addForm);
        },
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        add() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return this.$message.error('please fill in the required fields')
                const newForm = JSON.parse(JSON.stringify(this.addForm))
                newForm.goods_cat = newForm.goods_cat.join(',')
                // console.log(newForm);
                this.manyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_values: item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                this.onlyTableData.forEach(item => {
                    const newInfo = { attr_id: item.attr_id, attr_values: item.attr_vals }
                    this.addForm.attrs.push(newInfo)
                })
                newForm.attrs = this.addForm.attrs
                // console.log(newForm);
                const { data: res } = await axios.post('goods', newForm)
                console.log(res);
                if (res.meta.status !== 201) return this.$message.error('fail to add product')
                this.$message.success('product added')

                this.$router.push('/goods')
            })

        }


    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2]
            }
            return null;
        }
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }

};
</script>

<style lang="less" scoped>
.el-checkbox {
    margin: 0 10px 0 0 !important;
}

.previewImg {
    width: 100%;
}

.btn_add {
    margin-top: 15px;
}
</style>