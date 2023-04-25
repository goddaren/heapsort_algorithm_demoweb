<template>
    <el-dialog
    v-model="config.dialogVisible"
    title="编辑数据"
    width="40%"
  >
    <el-row :gutter="20">
      <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
        >输入数据</span
      >
      <el-input
        v-model="dataString"
        class="w-40 m-4"
        placeholder="输入一串数字，用空格分开"
        @keyup.enter="onOK"
      />
      
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <my-button plain @click="config.dialogVisible = false;dataString=lastData">取消</my-button>
        <my-button type="primary" @click="onOK">
          确定
        </my-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import MyButton from "./elements/MyButton.vue"
import {computed, ref, reactive} from 'vue'


const config=reactive({
    dialogVisible:false
})
const dataString=ref("");
let lastData="";
const data=computed(()=>{
    let t=[]
    dataString.value.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g).forEach(
        e=>{
            t.push(+(e))
        }
    )
    return t
}
)
const emits=defineEmits(['onOK'])
function onOK(){
    emits("onOK",data.value);
    lastData=dataString.value
    config.dialogVisible=false
}

function openDialog(){
    config.dialogVisible=true
}

function closeDialog(){
    config.dialogVisible=false
}



defineExpose({openDialog,closeDialog});

</script>

<style>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>