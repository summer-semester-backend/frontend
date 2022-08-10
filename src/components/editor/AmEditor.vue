<template>
  <div style="background-color: #f5f5f5">
    <AmToolbar v-if="engine" :engine="engine" :items="toolbarItems" />
    <n-scrollbar style="max-height: calc(100vh - 105px); width: 100%">
      <div style="height: auto; background-color: white; margin: 40px 200px">
        <div style="padding: 40px 40px; min-height: 150vh" ref="container"></div>
      </div>
    </n-scrollbar>
  </div>
</template>
<script setup lang="ts">
import Engine from '@aomao/engine';
import type { EngineInterface } from '@aomao/engine';
import AmToolbar from '@aomao/toolbar-vue';
import type { GroupItemProps } from '@aomao/toolbar-vue';
import { onMounted, ref, onUnmounted, watch } from 'vue';
import { OTClient } from './ot';
import { cards, plugins, pluginConfig } from './config';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { html2md } from '../../plugins/html2md';
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { getUserInfo } from '@/api/user';
import { createTeamModule, editFile, readFile } from '@/api/file';
const container = ref<HTMLDivElement | null>(null);
const engine = ref<EngineInterface | null>(null);
const ot = ref<any>();
const toolbarItems = ref<GroupItemProps[]>([
  ['collapse'],
  ['undo', 'redo', 'paintformat', 'removeformat'],
  ['heading', 'fontfamily', 'fontsize'],
  ['bold', 'italic', 'strikethrough', 'underline', 'moremark'],
  ['fontcolor', 'backcolor'],
  ['alignment'],
  ['unorderedlist', 'orderedlist', 'tasklist', 'indent', 'line-height'],
  ['link', 'quote', 'hr'],
]);
const fileID = ref<string | null>(null);
var route = useRoute();
const isView = ref<boolean>(false);
const currentMember = ref({
  nickname: '',
  userID: '',
});
const fileInfo = ref<{
  fileID: number | null;
  fileName: string | null;
  fileImage: string | null;
  fatherID: number | null;
  data: string | null;
}>({
  fileID: null,
  fileName: null,
  fileImage: null,
  fatherID: null,
  data: null,
});
//初始化编辑器
const initEditor = () => {
  if (container.value && fileID.value) {
    // 实例化引擎
    const engineInstance = new Engine(container.value, {
      // 启用的插件
      plugins,
      // 启用的卡片
      cards,
      // 所有的卡片配置
      config: pluginConfig,
    });

    // 协同编辑
    ot.value = new OTClient(engineInstance);
    ot.value.connect(
      `ws://43.138.77.8:8088${'?uid=' + currentMember.value.userID + '&uname=' + currentMember.value.nickname}`,
      fileID.value,
      ''
    );
    ot.value.on('ready', (member: any) => {
      console.log('ready', member);
    });

    //设置值
    engineInstance.setHtml(fileInfo.value.data || '');

    engine.value = engineInstance;
  } else {
    window.$message.error('文件打开失败，请退出重试');
  }
};
//导出md文件
const exportMd = (title: string) => {
  const html = engine.value?.getHtml();
  const markdown = html2md(html || '');
  const blob = new Blob([markdown], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = title + '.md';
  a.click();
};

//导出pdf文件
const exportPdf = (title: string) => {
  const html = engine.value?.getHtml();
  html2pdf(html, {
    margin: 1,
    filename: title,
    image: { type: 'jpeg', quality: 0.98 },
    enableLinks: true,
    html2canvas: { dpi: 192, letterRendering: true, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  });
};

//导出html文件
const exportHtml = (title: string) => {
  const html = engine.value?.getHtml();
  const blob = new Blob([html || ''], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = title + '.html';
  a.click();
};

//导出word文件
const exportWord = async (title: string) => {
  const html = engine.value?.getHtml();
  //console.log(html);
  let htmlStr = `
          <!DOCTYPE html>
          	<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
              xmlns="http://www.w3.org/TR/REC-html40">
          	<head>
          	<meta charset="UTF-8">
          <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:TrackMoves>false</w:TrackMoves><w:TrackFormatting/><w:ValidateAgainstSchemas/><w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid><w:IgnoreMixedContent>false</w:IgnoreMixedContent><w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText><w:DoNotPromoteQF/><w:LidThemeOther>EN-US</w:LidThemeOther><w:LidThemeAsian>ZH-CN</w:LidThemeAsian><w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript><w:Compatibility><w:BreakWrappedTables/><w:SnapToGridInCell/><w:WrapTextWithPunct/><w:UseAsianBreakRules/><w:DontGrowAutofit/><w:SplitPgBreakAndParaMark/><w:DontVertAlignCellWithSp/><w:DontBreakConstrainedForcedTables/><w:DontVertAlignInTxbx/><w:Word11KerningPairs/><w:CachedColBalance/><w:UseFELayout/></w:Compatibility><w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="off"/><m:dispDef/><m:lMargin m:val="0"/> <m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr></w:WordDocument></xml><![endif]-->
          </head>
            <body style="font-family:方正仿宋_GBK;mso-ascii-font-family:'Times New Roman'">
              ${html}
            </body>
          </html>
`;
  const fileData = asBlob(htmlStr || '').then((data) => {
    saveAs(data, title + '.docx');
  });
};

//保存为模板
const saveModule = (fileID: number | null, fileName: string) => {
  createTeamModule({ fileID: fileID, fileName: fileName, data: engine.value?.getHtml() || '' }).then((res) => {
    if (res.data.result == 0) window.$message.success('保存成功');
  });
};

//保存到服务器
const save = async () => {
  return editFile({
    fileID: fileInfo.value.fileID || -1,
    fileName: fileInfo.value.fileName,
    data: engine.value?.getHtml() || '',
    fatherID: fileInfo.value.fatherID,
    fileImage: fileInfo.value.fileImage,
  }).then((res) => {
    if (res.data.result == 0) console.log('保存成功');
  });
};

//在离开前保存
const saveBeforeLeave = (e: Event | null) => {
  if (engine.value) {
    save().then(() => {
      console.log('save', engine.value);
      engine.value?.destroy();
      engine.value = null;
      ot.value.exit();
    });
  }
};

defineExpose({
  exportMd,
  exportPdf,
  exportHtml,
  exportWord,
  saveModule,
});

const reload = () => {
  let useid = localStorage.getItem('userID') || '';
  getUserInfo({ userID: useid })
    .then((res) => {
      if (res.data.result == 0) {
        currentMember.value.nickname = res.data.data.nickname;
        currentMember.value.userID = useid;
      }
    })
    .then(() => {
      fileID.value = route.params.id.toString();
      readFile({ fileID: parseInt(fileID.value), teamID: -1 })
        .then((res) => {
          fileInfo.value.fileID = res.data.fileID;
          fileInfo.value.fileName = res.data.fileName;
          fileInfo.value.fileImage = res.data.fileImage;
          fileInfo.value.fatherID = res.data.fatherID;
          fileInfo.value.data = res.data.data;
        })
        .then(() => {
          initEditor();
          console.log('reload', engine.value);
        });
    });
};

watch(route, () => {
  console.log('watchRtoueChange');
  if (route.params.id) reload();
});

onMounted(() => {
  reload();
  console.log('onMounted');
  window.addEventListener('beforeunload', saveBeforeLeave);
});

onBeforeRouteLeave(() => {
  console.log('onBeforeRouteLeave');
  saveBeforeLeave(null);
});

onBeforeRouteUpdate(() => {
  console.log('onBeforeRouteUpdate');
  saveBeforeLeave(null);
});
onUnmounted(() => {
  window.removeEventListener('beforeunload', saveBeforeLeave);
});
</script>
