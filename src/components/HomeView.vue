<template>
    <el-container>
        <el-header class="header --el-box-shadow-dark">
            <el-row justify="center" class="title">
                堆排序算法演示 - 算法导论
            </el-row>
        </el-header>
        <el-main>
            <div class="mainview">
                <operate-data></operate-data>
            </div>
        </el-main>
    </el-container>
</template>

<script setup>
import OperateData from './OperateData.vue';

</script>

<style>
.mainview {
    margin: 0 auto;
    /* margin-top: 10px; */
    max-width: 1250px;

    justify-content: center;
    flex-direction: column;
    display: flex;
}
.header{
    height: 40px;
    width: 100%;
    background: rgba(193, 180, 250, 0.8);
    box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, .04), 0px 8px 20px rgba(0, 0, 0, .15);
}
.title{
    font-size: 20px;
    height: 100%;
    line-height: 40px;
    font-weight: bold;
}
</style>