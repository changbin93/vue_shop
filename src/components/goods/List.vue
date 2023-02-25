<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Goods management</el-breadcrumb-item>
            <el-breadcrumb-item>Goods List</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- card area -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="queryInfo.query" placeholder="Please input" clearable @clear="getGoodsList">
                        <template #append>
                            <el-button class="el-icon-search" @click="getGoodsList" />
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">Add Goods</el-button></el-col>
            </el-row>

            <!-- table area -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="S/N"></el-table-column>
                <el-table-column label="product name" prop="goods_name"></el-table-column>
                <el-table-column label="price( $ )" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="weight( kg )" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="create time" prop="add_time" width="140px">
                    <template v-slot="scope">
                        {{ dateTime(scope.row.add_time) }}
                    </template>
                </el-table-column>
                <el-table-column label="Actions" width="130px">
                    <template v-slot="scope">
                        <el-button type="primary" class="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" class="el-icon-delete" size="mini"
                            @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- page -->
            <el-pagination v-model:current-page="queryInfo.pagenum" v-model:page-size="queryInfo.pagesize"
                :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-card>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'VueShopList',

    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            goodsList: [],

        };
    },

    mounted() {
        this.getGoodsList()
    },

    methods: {
        async getGoodsList() {
            const { data: res } = await axios.get('goods', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('fail to get goods list')

            this.total = res.data.total;
            this.goodsList = res.data.goods
            // console.log(this.goodsList);

        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getGoodsList();
        },

        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getGoodsList()
        },
        removeById(id) {
            this.$messagebox.confirm('This will permanently delete product, are you sure?', 'Delete Product', {

                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'

            }).then(async () => {
                const { data: res } = await axios.delete('goods/' + id)
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.error('fail to delete')

                this.$message({
                    type: 'success',
                    message: 'Delete completed'
                })
                this.getGoodsList()
            })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    })
                })
        },

        goAddPage() {
            this.$router.push('/goods/add')
        }



    },
    computed: {
        dateTime() {
            return function (originVal) {

                const dt = new Date(originVal)
                const y = dt.getFullYear()
                const m = (dt.getMonth() + 1 + '').padStart(2, '0')
                const d = (dt.getDate() + '').padStart(2, '0')

                const hh = (dt.getHours() + '').padStart(2, '0');
                const mm = (dt.getMinutes() + '').padStart(2, '0');
                const ss = (dt.getSeconds() + '').padStart(2, '0');

                return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
            }
        }
    }

};
</script>

<style lang="less" scoped></style>