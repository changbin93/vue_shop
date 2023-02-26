<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Data Management</el-breadcrumb-item>
            <el-breadcrumb-item>Report Chart</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <div class="echarts-box">
                <div id="myEcharts" :style="{ width: '900px', height: '300px' }"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
    name: 'VueShopReport',

    data() {
        return {
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        };
    },

    async mounted() {
        var myChart = echarts.init(document.getElementById('myEcharts'));

        const { data: res } = await axios.get('reports/type/1');
        if (res.meta.status !== 200) return this.$message.error('fail to get reports');
        const result = { ...this.options, ...res.data }
        myChart.setOption(result)
    },

    methods: {

    },
};
</script>

<style lang="scss" scoped></style>