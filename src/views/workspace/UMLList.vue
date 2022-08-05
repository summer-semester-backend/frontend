<template>
  <ToolBar title="UML">
    <template #toolbar>
      <n-button text @click="create()">
        <n-icon size="26" class="icon">
          <AddCircleOutline />
        </n-icon>
      </n-button>
    </template>
  </ToolBar>
  <n-data-table :columns="columns" :data="files" :pagination="pagination" :bordered="false" />
</template>

<script setup lang="ts">
import { NButton, NIcon, NSpace } from 'naive-ui';
import { h, ref, computed, onMounted } from 'vue';
import { AddCircleOutline, Trash, ArrowRedo } from '@vicons/ionicons5';
import { readFile ,createFile ,editFile,deleteFile} from '@/api/file';
import { useRoute } from 'vue-router';
import { ToolBar } from './components';
import { useProjStore } from '@/store/proj';
import { useMessage } from 'naive-ui'
import drawioEmbed from "drawio-embed";

interface File {
  fileID: number;
  fileName: string;
  userName: string;
  lastEditTime: string;
}
const fileOnOpen =  ref<File | null>(null);
const route = useRoute();
const message = useMessage();
const { getProjID } = useProjStore();
const projID = ref<number | null>(null);
const pagination = ref({
  current: 1,
  pageSize: 10,
});
const columns = ref([
  {
    title: '项目名称',
    key: 'fileName',
    sorter: (row1: File, row2: File) => (row1.fileName > row2.fileName ? 1 : -1),
  },
  {
    title: '创建者',
    key: 'teamName',
    sorter: (row1: File, row2: File) => (row1.userName > row2.userName ? 1 : -1),
  },
  {
    title: '最近更新',
    key: 'abandonTime',
    sorter: (row1: File, row2: File) => (row1.lastEditTime > row2.lastEditTime ? 1 : -1),
  },
  {
    title: '操作',
    key: 'actions',
    render(row : File) {
      return h(NSpace, [
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            strong: true,
            secondary: true,
            onClick(e){
              console.log(row);
            }
          },
          {
            default: '删除',
            icon: h(NIcon, { component: Trash }),
          }
        ),
        h(
          NButton,
          {
            type: 'success',
            size: 'small',
            strong: true,
            secondary: true,
            onClick(e){
              getFileInfo(row,1);
          }
          },
          {
            default: '打开',
            icon: h(NIcon, { component: ArrowRedo }),
          }
        ),
      ]);
    },
  },
]);

const files = ref([
  {
    fileID: 1,
    fileName: '项目1',
    userName: '张三',
    lastEditTime: '2020-01-01',
  },
]);
const getFileList = (id: number | null) => {
  readFile({
    fileID: id,
    teamID: null,
  }).then((res) => {
    console.log(res.data);
    files.value = [];
    res.data.sonList.forEach((item: any) => {
      if (item.fileType === 12) {
        files.value.push({
          fileID: item.fileID,
          fileName: item.fileName,
          userName: item.userName,
          lastEditTime: item.lastEditTime,
        });
      }
    });
  });
};

const create = () =>{
    let fileName = new Date().getTime() + "";
    createFile({ teamID: null,fileName: fileName,fileType: 12, fileImage: "", fatherID: projID.value}).then((res) => {
      if (res.data.result == 0) {
        window.$message.success('创建成功');
        getFileList(getProjID());
      } else if (res.data.result == 1) {
        window.$message.warning(res.data.message);
      } else if (res.data.result == 2) {
        window.$message.error(res.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const getFileInfo = (file,needopen) => {

    readFile( { fileID:file.fileID, teamID:null}).then((res) => {
      if (res.data.result == 0) {
        window.$message.success('获取成功');
        fileOnOpen.value = file;
        if(needopen == 1)
        openDeskWithFile(res.data.fileImage);
        // console.log(res.data);
        // console.log(res.data.fileImage);
        return res.data.fileImage;
      } else if (res.data.result == 1) {
        window.$message.warning(res.data.message);
      } else if (res.data.result == 2) {
        window.$message.error(res.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const edit = (svgStream) => {//只修改了数据，其他名字等还不支持
    let file = fileOnOpen.value;
    editFile({  fileID: file.fileID, fileName: file.fileName, fileImage: svgStream, fatherID: projID.value, data:null}).then((res) => {
      if (res.data.result == 0) {
        window.$message.success('修改成功');
      } else if (res.data.result == 1) {
        window.$message.warning(res.data.message);
      } else if (res.data.result == 2) {
        window.$message.error(res.data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const deleFlie = () => {
    return 0;
}

onMounted(() => {
  projID.value = getProjID();
  getFileList(getProjID());
});



// let state = ref("Preparing……");
// 初始化
// const time = new Date().getTime();
// console.log("https://app.diagrams.net?ran=" + time);
const openDrawio = drawioEmbed("http://43.138.71.3:8070/");

//监听返回的图片数据
window.addEventListener("drawioImageCreated", evt => {
    const { imageType, imageContent } = evt;
    if (imageType == "svg")
    {
        edit(imageContent)
        // console.log(imageContent);
        // svgDom.innerHTML = imageContent;
        // str = imageContent;
    }
});

// 监听是否预加载完成
window.addEventListener("drawioLoaded", evt => {
    message.success("UML编辑器初始化完成！");
    // console.log("Drawio is Ready !");
    // state.value = "Ready!"
});

// 在需要时打开 drawio 开始编辑
const openDesk = () => {
    if(openDrawio == null ||  openDrawio == "" || openDrawio.isLoaded() == false)
    {
        message.loading("UML编辑器正在初始化……")
        return;
    }
    openDrawio();
}

// 携带参数的打开
const openDeskWithFile = (svgStream) => {
    if(openDrawio == null ||  openDrawio == "" || openDrawio.isLoaded() == false)
    {
        message.loading("UML编辑器正在初始化……")
        return;
    }
    openDrawio(svgStream);
}

</script>

<style scoped></style>
