<template>
    <el-card class="dialog">
        <el-row justify="center">
            <el-col :span="1">
                <div class="head">
                    <el-avatar :size="60" :src="data.head" />
                </div>
            </el-col>
            <el-col :span="12">
                <el-row>
                    <div class="name">{{ data.name }}</div>
                </el-row>
                <el-row>
                    <Typed class="text" :options="typeoption" :key="`Fdialog${k}`">
                        {{data.oldtext}}<div class="typing"></div>
                    </Typed>
                </el-row>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import LianHead from "../assets/正常.png"
import {Typed} from "@duskmoon/vue3-typed-js"
import { reactive, ref, watch } from "vue";

const props = defineProps({
    head: {
        default: LianHead
    },
    cname: {
        default: "莲",
        type: String,
    },
    text: {
        default: "你好，我是莲。",
        type: String,
    },
    oldtext:{
        default: "",
        type: String,
    },
    speed:{
        default: 10,
        type: Number,
    },
    lkey:{
        default: 0,
    }
});

const data=reactive({
    head:props.head,
    name:props.cname,
    oldtext:props.oldtext,
})

let k=ref(props.lkey);
const typeoption=reactive({
    strings: [props.text],
    typeSpeed: props.speed,
    loop: false,
    startDelay: 0,
    showCursor: false,
    cursorChar: "|",
    autoInsertCss: true,
    attr: null,
    bindInputFocusEvents: false,
    contentType: 'html',
})
watch(()=>props.head,(val)=>{
    data.head=val
})
watch(()=>props.cname,(val)=>{
    data.name=val
})
watch(()=>props.text,(val)=>{
    typeoption.strings[0]=val;
    updateContent();
})
watch(()=>props.oldtext,(val)=>{
    data.oldtext=val
})
watch(()=>props.speed,(val)=>{
    typeoption.typeSpeed=val;
    updateContent();
})

function updateContent(){
    k.value=k.value+1;
}
</script>

<style scoped>
.dialog {
    position: relative;
    width: 100%;
    margin: 10px 0;
    padding: 5px;
    /* border-radius: 10px;
    background: #fff;
    box-shadow: 0 0 10px #00000033; */
    /* overflow: hidden; */
}

.head {
    float: right;
    margin-right: 10px;
    /* cursor: pointer; */
}


.name {
    font-size: 20px;
    font-weight: bold;
    color: #4F0A59;
}

.text {
    font-size: 16px;
    color: #000;
    word-break: break-all;
    text-align: left;
}

.el-row {
    margin-bottom: 5px;
}
</style>