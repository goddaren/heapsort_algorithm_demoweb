<template>
  <div class="rectangle" :style="style"></div>
</template>

<script setup>
import {computed} from "vue"
const props = defineProps({
  style: {
    default: {},
  },
  width: { type: Number, default: 100 },
  height: { type: Number, default: 100 },
  position: {
    default: {},
  },
  color: { type: String, default: "#FFFFFF00" },
  bordercolor: {type:String,default:"#93959b"},
  bordersize:{type:Number,default:5}
});

const style = computed(()=>{
  let m={}
  let {top,left,right,bottom}={...props.position}
  if(top){
    m={"top":top+"px"}
  }
  if(left){
    m={"left":left+"px",...m}
  }
  if(right){
    m={"right":right+"px",...m}
  }
  if(bottom){
    m={"bottom":bottom+"px",...m}
  }
  console.log(props.width)
  return {...props.style,...m,
    "width":`${props.width}px`,
    "height":`${props.height}px`,
    "border":`${props.bordersize}px solid ${props.bordercolor}`,
    "background":`${props.color}`
  }
  
});

</script>

<style scoped>
.rectangle {
  position: absolute;
  text-align: center;
}
</style>