import fHappy from '../assets/高兴.png';
import fNormal from '../assets/正常.png';
import fSad from '../assets/生气.png';
import {reactive} from 'vue';

export default {
    start:{
        head:fNormal,
        text:"你好，我叫莲。我来为你演示堆排序的过程。这里演示用的是大顶堆,也就是说每个结点的值都大于或等于其左右子结点的值。<br>堆排序主要分为两步：<br>第一步是构建堆，将无序序列建为大顶堆；<br>第二步是调整堆，输出堆顶的元素,然后对剩余的元素重新建堆。<br>接下来我们来构建堆。",
        keep:false,
        next:["buildheap2"]

    },
    buildheap:{
        head:fNormal,
        text:"",
        keep:false,
        next:["buildheap2"]
    },
    buildheap2:{
        head:fNormal,
        text:"建堆从底部开始。",
        keep:true,
        next:["buildheap3"]
    },
    buildheap3:{
        head:fNormal,
        text:"看看被选中的节点与它的子节点的大小关系。",
        keep:false,
        //根节点最大不需要调整，需要调整
        next:["buildheap4","buildheap5"]
    },
    buildheap4:{
        head:fNormal,
        text:"被选中节点比它的子节点都大，所以不需要调整。",
        keep:false,
        next:["buildheap9"]
    },
    buildheap5:{
        head:fNormal,
        text:"这个子节点最大，所以需要调整。",
        keep:false,
        //需要继续调整，不需要调整
        next:["buildheap6","buildheap8"]
    },
    buildheap6:{
        head:fNormal,
        text:"我们把根节点和它交换。交换后，由于这个子节点被调整过，所以需要继续调整它的子节点。",
        keep:false,
        next:["buildheap3"]
    },
    // buildheap7:{
    //     head:fNormal,
    //     text:"这个节点比它的子节点都大，所以不需要调整。",
    //     keep:true,
    //     next:["buildheap9"]
    // },
    buildheap8:{
        head:fNormal,
        text:"我们把根节点和它交换。交换后，这个节点已经没有子节点了，所以不需要调整。",
        keep:false,
        next:["buildheap9"]
    },
    buildheap9:{
        head:fNormal,
        text:"我们看看下一个节点。",
        keep:true,
        next:["buildheap3"]
    },
    buildheapfinish:{
        head:fHappy,
        text:"建堆完成了！我们已经把所有的节点都调整过了，现在这棵树就是一个大顶堆了。<br>接下来我们来调整堆。调整堆的过程就是先把堆顶的元素输出，然后把最后一个元素放到堆顶，并对剩余的元素重新建堆。",
        keep:false,
        next:["adjustheap2"]
    },
    // adjustheap:{
    //     head:fNormal,
    //     text:"接下来我们来调整堆。调整堆的过程是把堆顶的元素输出，然后把最后一个元素放到堆顶，然后对剩余的元素重新建堆。",
    //     keep:false,
    //     next:["adjustheap2"]
    // },
    adjustheap2:{
        head:fNormal,
        text:"我们先把堆顶的元素输出。然后把最后一个元素放到堆顶。当然实际操作的话，我们是把堆顶的元素与最后一个元素的位置交换位置，被放到后面的元素就不参与堆排序了。<br>我们把最后一个元素放到堆顶后，需要对剩余的元素重新调整为堆。我们从堆顶开始调整。",
        keep:false,
        next:["adjustheap4"]
    },
    adjustheap3:{
        head:fNormal,
        text:"我们把最后一个元素放到堆顶后，需要对剩余的元素重新调整为堆。我们从堆顶开始调整。",
        keep:false,
        next:["adjustheap4"]
    },
    adjustheap4:{
        head:fNormal,
        text:"看看被选中的节点与它的子节点的大小关系。",
        keep:false,
        //根节点最大不需要调整，需要调整
        next:["adjustheap5","adjustheap8"]
    },
    adjustheap5:{
        head:fNormal,
        text:"被选中节点比它的子节点都大，所以不需要调整。",
        keep:false,
        next:["adjustheap6"]
        
    },
    adjustheap6:{
        head:fNormal,
        text:"堆调整完成，我们回到堆顶。",
        keep:true,
        next:["adjustheap7","adjustheapfinish"]
    },
    adjustheap7:{
        head:fNormal,
        text:"输出堆顶的元素，然后把树中最后一个元素放到堆顶。继续调整堆。",
        keep:false,
        next:["adjustheap4"]
    },
    adjustheap8:{
        head:fNormal,
        text:"这个子节点最大，所以需要调整。",
        keep:false,
        //需要继续调整，不需要调整
        next:["adjustheap9","adjustheap10"]
    },
    adjustheap9:{
        head:fNormal,
        text:"我们把根节点和它交换。交换后，由于这个子节点被调整过，所以需要继续调整它的子节点。",
        keep:false,
        next:["adjustheap4"]
    },
    adjustheap10:{
        head:fNormal,
        text:"我们把根节点和它交换。交换后，这个节点已经没有子节点了，所以不需要调整。",
        keep:false,
        next:["adjustheap6"]
    },
    adjustheap11:{
        head:fNormal,
        text:"现在只剩下最后一个节点了。",
        keep:false,
        next:[]
    },
    adjustheapfinish:{
        head:fHappy,
        text:"把最后一个元素输出，堆调整完成了！我们已经把所有的元素都输出了，排序完成！",
        keep:false,
        next:["end"]
    },
    autoplay:{
        head:fSad,
        text:"（莲正在全神贯注进行排序中）",
        keep:false,
        next:null
    }
}
