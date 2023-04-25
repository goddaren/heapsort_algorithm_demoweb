<template>
  <el-card>
    <el-row>
      <el-col :span="3" :offset="4">
        <el-button
          @click="onOpenEditDialog"
          class="edit"
          color="#626aef"
          plain
          :icon="Edit"
          >编辑数据</el-button
        >
      </el-col>
      <el-col :span="8">
        <el-button-group>
          <el-button
            color="#626aef"
            plain
            :icon="ArrowLeft"
            :disabled="config.nowIndex < 2 || config.msgdelay"
            @click="onBackward"
            >后退</el-button
          >
          <el-popover placement="top" :width="200" trigger="hover">
            <template #reference>
              <el-button
                color="#626aef"
                plain
                class="button-text"
                :disabled="!config.isStart || config.msgdelay"
                >{{ config.nowIndex }}/{{ config.sumIndex }}<br />
                {{
                  config.isEnd ? "已结束" : config.isStart ? "未结束" : "未开始"
                }}</el-button
              >
            </template>
            <template #default>
              <el-input type="number" style="width:110px" v-model="config.jumpNum" class="mt-4" placeholder="Please input">
              </el-input>
              <my-button class="jump-button" @click="onJump" :disabled="config.msgdelay||config.sumIndex<2">跳转</my-button>
            </template>
          </el-popover>

          <el-button
            color="#626aef"
            plain
            :disabled="
              (config.nowIndex == config.sumIndex && config.isEnd) ||
              config.msgdelay
            "
            @click="onForward"
            >{{ config.isStart ? "前进" : "开始" }}
            <el-icon class="el-icon--right" v-if="config.isStart"
              ><ArrowRight
            /></el-icon>
            <el-icon class="el-icon--right" v-if="!config.isStart"
              ><CaretRight
            /></el-icon>
          </el-button>
        </el-button-group>
      </el-col>
      <el-col :span="3">
        <el-button
          @click="onAutoPlay"
          class="edit"
          color="#626aef"
          plain
          :icon="config.autoplay?RemoveFilled:CaretRight"
          >{{config.autoplay?"停止自动":"自动运行"}}</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col>

          <display-data
            :data="data"
            :key="config.displaydatakey"
            :sendMessage="message"
            @sortFinish="sortFinish"
            @operation="recoverMsgdelay"
            @dialognext="(config.nowIndex == config.sumIndex && config.isEnd) ||
              config.msgdelay?false:onForward()"
          ></display-data>
      </el-col>
    </el-row>    
  </el-card>

  <set-data ref="setdatadialog" @onOK="onSetData"></set-data>
</template>

<script setup>
import {
  Edit,
  ArrowLeft,
  ArrowRight,
  CaretRight,
  RemoveFilled
} from "@element-plus/icons-vue";
import DisplayData from "./DisplayData.vue";
import { getCurrentInstance, reactive, ref } from "vue";
import SetData from "./SetData.vue";
import MyButton from "./elements/MyButton.vue"
const getDefaultConfig = () => {
  return {
    nowIndex: 0,
    sumIndex: 0,
    isStart: false,
    isEnd: false,
    displaydatakey: "0",
    msgdelay: false,
    jumpNum: 1,
    autoplay:false,
    autoplaytime:200,
    autoplaytimer:-1
  };
};

const getDefaultMessage = () => {
  return {
    key: null,
    operation: "", //jump,next
    value: -1,
  };
};

const config = reactive(getDefaultConfig());

const message = reactive(getDefaultMessage());

function setMessage(msg, value = -1) {
  if(msg=="startauto"){
    let t=new Date();
    message.key = config.nowIndex+t.valueOf();
    message.value = null;
    message.operation = msg;
  }
  else if(msg=="stopauto"){
    let t=new Date();
    message.key = config.nowIndex+t.valueOf();
    message.value = null;
    message.operation = msg;
  }
  else if (!config.msgdelay) {
    let t=new Date();
    config.msgdelay = true;
    message.key = config.nowIndex+t.valueOf();
    message.value = value;
    message.operation = msg;
  }
}

function recoverMsgdelay() {
  config.msgdelay = false;
  if(config.autoplay){
    if(config.isEnd&&config.nowIndex==config.sumIndex){
        stopAutoPlay();
    }
    else{
      doAutoPlay();
    }
  }
}

function onAutoPlay(){

  config.autoplay=!config.autoplay;
  if(config.autoplay&&!config.msgdelay&&(!config.isEnd||config.nowIndex!=config.sumIndex)){
    doAutoPlay();
  }
  else{
    stopAutoPlay();
  }
}

function doAutoPlay(){
  setMessage("startauto")
  config.autoplaytimer=setTimeout(
    onForward,config.autoplaytime
  )
}

function stopAutoPlay(){
  config.autoplay=false
  setMessage("stopauto")
  clearTimeout(config.autoplaytimer);
}

function onForward() {
  if (!config.msgdelay) {
    if (!config.isStart) {
      config.isStart = true;
    }
    if (config.nowIndex == config.sumIndex) {
      config.nowIndex += 1;
      config.sumIndex += 1;
      setMessage("next");
    } else {
      config.nowIndex += 1;
      setMessage("jump", config.nowIndex);
    }
  }
}

function onBackward() {
  stopAutoPlay();
  if (!config.msgdelay) {
    config.nowIndex -= 1;
    setMessage("jump", config.nowIndex);
  }
}

function toInt(number) {
    return number*1 | 0 || 0;
}


function onJump() {
  config.autoplay=false;
  let t=toInt(config.jumpNum);
  if(t<1){
    config.jumpNum=1;
  }
  else if(t>config.sumIndex){
    config.jumpNum=config.sumIndex;
  }
  else{
    config.jumpNum=t;
  }
  setMessage("jump", config.jumpNum);
  config.nowIndex = config.jumpNum;
}

function sortFinish() {
  config.isEnd = true;
}

const data = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);

const { proxy } = getCurrentInstance();
function onOpenEditDialog() {
  const dialog = proxy.$refs["setdatadialog"];
  dialog.openDialog();
}
function onSetData(d) {
  data.length = 0;
  for (let i = 0; i < d.length; i++) {
    data[i] = d[i];
  }
  let t = getDefaultMessage();
  for (let i in t) {
    message[i] = t[i];
  }
  t = getDefaultConfig();
  for (let i in t) {
    config[i] = t[i];
  }
  config.displaydatakey = "setdata" + new Date();
}
</script>

<style scoped>
.jump-button {
  width: 50px;
  height: 31px;
  float: right;
}
.button-text {
  width: 60px;
  font-size: 10px;
}
</style>