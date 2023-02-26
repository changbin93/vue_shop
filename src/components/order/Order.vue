<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Order management</el-breadcrumb-item>
            <el-breadcrumb-item>Order list</el-breadcrumb-item>
        </el-breadcrumb>
    </div>

    <el-card>
        <el-row>
            <el-col :span="8">
                <el-input v-model="input3" placeholder="Please input" class="input-with-select">
                    <template #append>
                        <el-button class="el-icon-search" />
                    </template>
                </el-input>
            </el-col>
        </el-row>
        <el-table :data="orderList" border stripe>
            <el-table-column type="index" label="S/N"></el-table-column>
            <el-table-column label="Order Number" prop="order_number"></el-table-column>
            <el-table-column label="Order Amount" prop="order_price"></el-table-column>
            <el-table-column label="Is Paid" prop="pay_status">
                <template v-slot="scope">
                    <el-tag type="success" v-if="scope.row.pay_status === '1'">Paid</el-tag>
                    <el-tag type="danger" v-else>Not Paid</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Is Shipped" prop="is_send"></el-table-column>
            <el-table-column label="Order Create Time">
                <template v-slot="scope">
                    {{ dateTime(scope.row.create_time) }}
                </template>
            </el-table-column>
            <el-table-column label="Actions">
                <template v-slot="scope">
                    <el-button class="el-icon-edit" type="primary" size="mini" @click="showAddressBox"></el-button>
                    <el-button class="el-icon-location" type="success" size="mini"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- page -->
        <el-pagination v-model:current-page="queryInfo.pagenum" v-model:page-size="queryInfo.pagesize"
            :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>

    <el-dialog v-model="addressBoxVisible" title="Tips" width="30%">
        <el-form ref="addressFormRef" :model="addressForm" :rules="addressRules" label-width="120px" status-icon>
            <el-form-item label="Province/City" prop="address1">
                <el-input v-model="addressForm.address1" />
            </el-form-item>
            <el-form-item label="Address Details" prop="address2">
                <el-input v-model="addressForm.address2" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addressBoxVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addressBoxVisible = false">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import axios from 'axios';


export default {
    name: 'VueShopOrder',

    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            orderList: [],
            total: 0,
            addressBoxVisible: false,
            addressForm: {
                address1: [],
                address2: ''
            },
            addressRules: {
                address1: [
                    { required: true, message: 'Please select a city/county', trigger: 'blur' }
                ],
                address2: [
                    { required: true, message: 'Please enter a detailed address', trigger: 'blur' }
                ]
            }

        };
    },

    mounted() {
        this.getOrderList();
    },

    methods: {
        async getOrderList() {
            const { data: res } = await axios.get('orders', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('fail to get order list')
            // console.log(res);
            this.orderList = res.data.goods;
            this.total = res.data.total;
            console.log(this.orderList);
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getOrderList();
        },
        handleCurrentChange(newNum) {
            this.queryInfo.pagenum = newNum
            this.getOrderList()
        },
        showAddressBox() {
            this.addressBoxVisible = true;
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
}
</script>

<style lang="less" scoped></style>