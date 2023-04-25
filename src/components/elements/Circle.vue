<template>
  <div class="node" :style="style">{{ props.value }}</div>
</template>

<script setup>
import {computed} from "vue"
const props = defineProps({
  value: String | Number,
  style: {
    default: {},
  },
  radius: { type: Number, default: 16 },
  position: {
    default: {},
  },
  color: { type: String, default: "#F1F1F1" },
  bordercolor: {type:String,default:"#93959b"},
  bordersize:{type:Number,default:1}
});

const style = computed(()=>{
  let m={}
  const radius=props.radius
  let {top,left,right,bottom}={...props.position}
  if(top){
    m={"top":top-radius+"px"}
  }
  if(left){
    m={"left":left-radius+"px",...m}
  }
  if(right){
    m={"right":right-radius+"px",...m}
  }
  if(bottom){
    m={"bottom":bottom-radius+"px",...m}
  }
  
  return {...props.style,...m,
    "width":`${radius*2}px`,
    "height":`${radius*2}px`,
    "border":`${props.bordersize}px solid ${props.bordercolor}`,
    "background":`${props.color}`,
    "line-height":`${radius*2}px`,
  }
  
});

</script>

<style scoped>
.node {
  position: absolute;
  text-align: center;
  vertical-align: middle;
  border-radius: 50%;
}
</style>