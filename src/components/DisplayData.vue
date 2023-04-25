<template>
  <el-row class="lian">
    <Lian v-if="!datacontactconfig.isautoplay" :head="datacontact.head" :cname="datacontact.cname" :text="datacontact.text" :oldtext="datacontact.oldtext">
    </Lian>
    <Lian v-else :head="datacontactauto.head" :cname="datacontactauto.cname" :text="datacontactauto.text" :oldtext="datacontactauto.oldtext"></Lian>
    <div class="dialogmask" @click="dialognext"></div>
  </el-row>

  <el-row>
    <el-col>
      <el-row justify="center">
        <el-card>
          <div class="container2">
            <transition-group>
              <Circle :value="t.value" v-for="(t, ind) in data" :key="t.id" :radius="t.radius" :style="datastyle"
                :color="getBgColor(ind)"></Circle>
              <Circle :value="t.value" v-for="t in datasorted" :key="t.id" :radius="t.radius" :style="datastyle"
                :color="datasortedcolor"></Circle>
            </transition-group>
          </div>
        </el-card>
      </el-row>

      <el-row justify="center">
        <el-col>
          <div class="container" id="container" ref="container">
            <transition-group>
              <Circle class="connect-node" :value="t.value" v-for="t in data" :key="t.id" :position="t.position"
                :radius="t.radius"></Circle>
              <Circle :value="t.value" v-for="t in datasorted" :key="t.id" :radius="t.radius" :color="datasortedcolor"
                :position="t.position"></Circle>
              <Circle :value="t.value" v-for="t in pointNode" :key="t.id" :position="t.position" :radius="t.radius"
                :color="t.color" :bordercolor="t.bordercolor" v-show="t.isshow"></Circle>
              <rectangle key="rectangle233" :width="rectangleConfig.width" :height="rectangleConfig.height"
                :position="rectangleConfig.position" v-show="rectangleConfig.isshow"></rectangle>
            </transition-group>
          </div>
        </el-col>
        <el-col> </el-col>
      </el-row>
    </el-col>
  </el-row>

</template>

<script setup>
import {
  onMounted,
  nextTick,
  reactive,
  computed,
  onBeforeUnmount,
  watch
} from "vue";
import {
  updateLine,
  initLine,
} from "../utils/useHeapsortPath";
import Circle from "./elements/Circle.vue";
import Rectangle from "./elements/Rectangle.vue";
import Lian from "./Lian.vue";
import dialogue from "../utils/LianDialogue.js";



function newDatas(values) {
  let tmp = [];
  values.forEach((value) => {
    tmp.push({
      value,
      id: `N${tmp.length}`,
      position: {},
    });
  });
  return tmp;
}
const props = defineProps({
  data: {
    type: Array,
    default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  config: {
    default: {
      radius: 20,
      topspace: 10,
      rowspace: 30,
      colspace: 30,
    }
  },
  sendMessage: {
    default: {
      key: null,
      operation: "",
      value: -1,
    }
  }
})


function updateData(newdata) {
  data.splice(0, data.length);
  data.unshift(...newDatas(newdata));

  updatePosition();
}
const config = reactive(props.config);
const colspace = computed(() => config.colspace + 2 * config.radius);
const data = reactive([]);
const dataHistory = reactive([]);
const datasorted = reactive([]);
const datastyle = reactive({
  position: "relative",
  float: "left",
  "margin-left": "10px",
  "margin-bottom": "20px",
});

const datasortedcolor = "#76eb0842"
const rectangleConfig = reactive({
  width: config.rowspace,
  height: config.colspace,
  position: {},
  color: "#76eb0842",
  isshow: 0,
  isadjust:false
})

const pointNode = reactive(newPointNode(["", "", "", ""]));
const dataabstract = computed(() => reactive([...data, ...datasorted]))
function newPointNode(values) {
  let tmp = [];
  let nodecolor = ["#ffa8f52f", '#eb82dd50', '#eb82dd50', '#c050b375'];
  values.forEach((value) => {
    tmp.push({
      value,
      id: `P${tmp.length}`,
      position: {},
      color: nodecolor[tmp.length],
      bordercolor: nodecolor[tmp.length],
      isshow: 0,
      dependnode: -1
    });
  });
  return tmp;
}
function copyNode(nodeindex, dataindex) {
  pointNode[nodeindex].isshow = 1;
  pointNode[nodeindex].radius = data[dataindex].radius;
  pointNode[nodeindex].position = { ...data[dataindex].position };
  pointNode[nodeindex].dependnode = dataindex;
}

function updateNodePosition() {
  for (let i = 0; i < pointNode.length; i++) {
    if (pointNode[i].dependnode > -1 && pointNode[i].dependnode < data.length) {
      copyNode(i, pointNode[i].dependnode);
    }
  }
}

function getBgColor(index) {
  for (let i = pointNode.length - 1; i >= 0; i--) {
    if (index == pointNode[i].dependnode) {
      return pointNode[i].color;
    }
  }
  return "#F1F1F1";
}

function copyNodeAll(dataindex, first = 0) {
  for (let i = first; i < pointNode.length; i++) {
    copyNode(i, dataindex);
  }
}

function hiddenAllNode() {
  for (let i = 0; i < pointNode.length; i++) {
    pointNode[i].isshow = 0
    pointNode[i].dependnode = -1
  }
}

data.change = function (a, b) {
  [this[a], this[b]] = [this[b], this[a]];
  updatePosition();
};

onMounted(initLine);
onMounted(() => updateData(props.data))
function onResize() {
  updatePosition();
}

onMounted(() => {
  window.addEventListener("resize", onResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
});

function updatePosition() {
  const container = document.getElementById("container");
  const width = container.offsetWidth;
  applyAllDataReverse((info) => {
    const { index, layer, lineSum, lineIndex, sumLayer } = info;
    dataabstract.value[index].radius = config.radius;
    dataabstract.value[index].position.top =
      (layer - 1) *
      (config.rowspace + (layer - 1 > 0 ? config.radius * 2 : 0)) +
      config.topspace;
    if (sumLayer == layer) {
      dataabstract.value[index].position.left = getLeftPosition(width, lineSum, lineIndex);
    } else if (sumLayer - 1 == layer) {
      dataabstract.value[index].position.left = Math.floor(
        (getLeftPositionByIndex(width, (index + 1) * 2 - 1) +
          getLeftPositionByIndex(width, (index + 1) * 2)) /
        2
      );
    } else {
      dataabstract.value[index].position.left = Math.floor(
        (dataabstract.value[(index + 1) * 2 - 1].position.left +
          dataabstract.value[(index + 1) * 2].position.left) /
        2
      );
    }
  });
  updateNodePosition();
  updateRectanglePosition();
  nextTick(updateLine);
}

function getLeftPosition(width, lineSum, lineIndex) {
  return (
    Math.floor((width - (lineSum - 1) * colspace.value) / 2) +
    (lineIndex - 1) * colspace.value
  );
}
function getLeftPositionByIndex(width, index) {
  const { lineSum, lineIndex } = getLineByIndex(index);
  return (
    Math.floor((width - (lineSum - 1) * colspace.value) / 2) +
    (lineIndex - 1) * colspace.value
  );
}
function updateRectanglePosition() {
  if (pointNode[0].dependnode >= 0) {
    if(rectangleConfig.isadjust){
      rectangleConfig.isshow=0;
    }
    else{
      rectangleConfig.isshow=1;
    }
    const index = getLeftmostIndex(pointNode[0].dependnode);
    const left = dataabstract.value[index].position.left - config.radius;
    const top = pointNode[0].position.top - config.radius;
    const height = dataabstract.value[index].position.top - top + config.radius * 2;
    const width = 2 * (pointNode[0].position.left - left);
    const widthappend = 10;
    rectangleConfig.position.top = top - 15;
    rectangleConfig.position.left = left - widthappend;
    rectangleConfig.width = width + widthappend;
    rectangleConfig.height = height;
  }


}

function getLeftmostIndex(index) {
  let tmp = index + 1;
  while (tmp * 2 <= dataabstract.value.length) {
    tmp *= 2;
  }
  return tmp - 1;
}

function getLineByIndex(index) {
  index++;
  const info = {
    layer: Math.floor(Math.log2(index)) + 1,
  };
  info.lineSum = Math.pow(2, info.layer - 1);
  info.lineIndex = index - Math.pow(2, info.layer - 1) + 1;
  return info;
}

// function applyAllData(func) {
//   const info = {
//     index: 0,
//     layer: 1,
//     lineSum: 1,
//     lineIndex: 0,
//   };
//   for (let i = 0; i < data.length; i++) {
//     info.index = i;
//     info.lineIndex += 1;
//     func(info);
//     if (info.lineIndex == info.lineSum) {
//       info.layer++;
//       info.lineSum *= 2;
//       info.lineIndex = 0;
//     }
//   }
// }

function applyAllDataReverse(func) {
  const info = {
    index: 0,
    ...getLineByIndex(dataabstract.value.length - 1),
  };
  info.lineIndex++;
  info.sumLayer = info.layer;
  for (let i = dataabstract.value.length - 1; i >= 0; i--) {
    info.index = i;
    info.lineIndex--;
    func(info);
    if (info.lineIndex == 1) {
      info.layer--;
      info.lineSum /= 2;
      info.lineIndex = info.lineSum + 1;
    }
  }
}

const process = heapSort();
const emits = defineEmits(['sortFinish', 'operation','dialognext'])

function dialognext(){
  emits('dialognext');
}

function getProcessNext() {
  let m;
  do {
    m = process.next();
  }
  while (!m.value.msg)
  return m
}
function nextStep() {
  let m = getProcessNext();
  if (!m.value.msg) {
    m = process.next();
  }
  console.log(m.value);
  if (m.done) {
    emits('sortFinish');
  }
  applyPointNode(m.value);


  dataHistory.push({ data: deepCopy(data), datasorted: deepCopy(datasorted), pointNode: deepCopy(pointNode),datacontact:deepCopy(datacontact),rectangleConfig:deepCopy(rectangleConfig) })
  updatePosition();
  setTimeout(() => {
    emits('operation', m.value);
  }, 200);
}

function deepCopy(d) {
  return JSON.parse(JSON.stringify(d));
}

function jumpStep(t) {
  t--;
  rectangleConfig.isadjust=dataHistory[t].rectangleConfig.isadjust 
  if (t >= 0 && t < dataHistory.length) {
    data.length = 0;
    data.unshift(...dataHistory[t].data);
    datasorted.length = 0;
    datasorted.unshift(...dataHistory[t].datasorted)
    pointNode.length = 0;
    pointNode.unshift(...dataHistory[t].pointNode);
    updatePosition();
  }
  for(let i in datacontact){
    datacontact[i]=dataHistory[t].datacontact[i]
  }
setTimeout(() => {
    emits('operation');
  }, 200);
}

//监听操作
watch(props.sendMessage, (n, o) => {

  if (n.key) {
    if (n.operation == "next") {
      nextStep();
    }
    else if (n.operation == "jump") {
      jumpStep(n.value);
    }
    else if(n.operation=="startauto"){
      datacontactconfig.isautoplay=true;
    }
    else if(n.operation=="stopauto"){
      datacontactconfig.isautoplay=false;
    }
  }
})


function leftIndex(index) {
  return (index + 1) * 2 > data.length ? null : (index + 1) * 2 - 1;
}
function rightIndex(index) {
  return (index + 1) * 2 + 1 > data.length ? null : (index + 1) * 2;
}

function getTarget(msg, main, left = null, right = null) {
  return { msg, main, left, right }
}

function* maxHeapify(i) {
  //先锚定被操作对象
  let l = leftIndex(i);
  let r = rightIndex(i);
  if (!l) {
    return
  }
  yield getTarget("compare", i, l, r)
  //开始比较
  let largest = i;
  if (l != null && data[l].value > data[i].value) {
    largest = l;
  }
  if (r != null && data[r].value > data[largest].value) {
    largest = r;
  }
  yield getTarget("findmax", largest, i)
  //找到最大的元素，将锚点指向它
  if (largest != i) {
    data.change(i, largest);

    // if(!leftIndex(largest)){
    //   yield getTarget("endheapifychanged",largest)
    //   return
    // }
    yield getTarget("continueheapify", largest)
    yield* maxHeapify(largest)
  }
  else {
    // yield getTarget("endheapifyunchanged",largest)
  }
}

function* buildMaxHeap() {
  for (let i = Math.floor((data.length) / 2 - 1); i >= 0; i--) {
    yield getTarget("buildheap", i)
    yield* maxHeapify(i);
  }
  yield getTarget("buildheapfinish")
}

function* heapSort() {
  //开始构造堆
  yield* buildMaxHeap();
  for (let i = data.length - 1; i > 0; i--) {
    data.change(0, i);
    datasorted.unshift(data.pop());
    yield getTarget("adjustheapstart", i - 1)
    yield* maxHeapify(0);
    yield getTarget("adjustheapfinish", i - 1)
    //堆建好了，接下来准备交换两个的位置
  }
  datasorted.unshift(data.pop());
  return getTarget("heapsortfinish")
  //全部完成了
}

function applyPointNode(msg) {
  switch (msg.msg) {
    case "buildheap":
      copyNodeAll(msg.main);
      setDialogue(datacontact.listMsg[0])

      break;
    case "buildheapfinish":
      setDialogue("buildheapfinish")
      rectangleConfig.isadjust = true;
      copyNodeAll(0);
      break;
    case "compare":
      if (msg.left) {
        copyNode(1, msg.left);
      }
      setDialogue(datacontact.listMsg[0])
      if (msg.right) {
        copyNode(2, msg.right);
      }
      break;
    case "findmax":
      copyNodeAll(msg.main, 1);
      if(msg.main==msg.left){
        setDialogue(datacontact.listMsg[0])
      }
      else{
        setDialogue(datacontact.listMsg[1])
      }
      break;
    case "endheapifychanged":
      break;
    case "continueheapify":
      if(leftIndex(msg.main)){
        setDialogue(datacontact.listMsg[0])
      }
      else{
        setDialogue(datacontact.listMsg[1])
      }
      break;
    case "endheapifyunchanged":
      break;
    case "adjustheapstart":
      setDialogue(datacontact.listMsg[0])
      copyNodeAll(0)
      break;
    case "adjustheapfinish":
      if(data.length>1){
        setDialogue(datacontact.listMsg[0])
      }
      else{
        setDialogue("adjustheap11")
      }
      copyNodeAll(0)
      break;
    case "heapsortfinish":
      setDialogue("adjustheapfinish")
      hiddenAllNode();
      break;
  }
}

//下面开始写Lian对话框控制


const datacontact=reactive({
  text:dialogue.start.text,
  lasttext:"",
  oldtext:"",
  cname:"莲",
  head:dialogue.start.head,
  speed:10,
  listMsg:dialogue.start.next
})

const datacontactauto=reactive({
  text:dialogue.autoplay.text,
  lasttext:"",
  oldtext:"",
  cname:"莲",
  head:dialogue.autoplay.head,
  speed:10,
  listMsg:dialogue.autoplay.next
})

const datacontactconfig=reactive({
  isautoplay:false,
})

function setDialogue(key){
  datacontact.text=dialogue[key].text
  datacontact.head=dialogue[key].head
  datacontact.listMsg=dialogue[key].next
  datacontact.oldtext=datacontact.lasttext
  if(dialogue[key].keep){
    datacontact.lasttext+=datacontact.text
  }
  else{
    datacontact.lasttext=""
  }
}



</script>

<style>
.container {
  position: relative;
  height: 300px;
}

.sort-card-header {
  color: #f3310021;
}



.el-row {
  margin-bottom: 30px;
}

button {
  width: 50px;
  height: 30px;
}

.v-move {
  transition: transform 0.2s;
}
.lian{
  min-height: 160px;

}
.dialogmask{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000000;
  z-index: 100;
  cursor: pointer;
}
</style>