<template>
  <div class="flex h-full">
    <div v-if="editable" class="min-w-60 h-full bg-[#494949]">
      <div class="m-2">
        <n-config-provider :theme="darkTheme" :theme-overrides="prototypeWorkspaceConfig">
          <PageBox
            @page-create="handleCreatePage"
            @page-selected="handleSelectPage"
            :pages="pages"
            :selected-page="currentPage?.id as string"
          />
          <ToolBox @tool-selected="handleToolBoxSelect" @icon-selected="handleIconSelected" />
        </n-config-provider>
      </div>
    </div>
    <div class="w-full h-full">
      <div class="editor-container">
        <!-- Rulers -->
        <Guides
          v-show="guidesVisible"
          class="ruler ruler-horizontal"
          className="custom-color"
          :showGuides="showGuides"
          @changeGuides="hGuideValues = $event.guides"
          type="horizontal"
          ref="hGuides"
          :zoom="zoomFactor"
          :snapThreshold="5"
          :unit="zoomFactor >= 1 ? 50 : Math.floor(50 / zoomFactor)"
          :rulerStyle="{ left: '30px', width: 'calc(100% - 30px)', height: '30px' }"
          :style="{ width: '100%', height: '30px' }"
        />
        <Guides
          v-show="guidesVisible"
          class="ruler ruler-vertical"
          :showGuides="showGuides"
          @changeGuides="vGuideValues = $event.guides"
          type="vertical"
          ref="vGuides"
          :zoom="zoomFactor"
          :snapThreshold="5"
          :unit="zoomFactor >= 1 ? 50 : Math.floor(50 / zoomFactor)"
          :rulerStyle="{ top: '30px', height: 'calc(100% - 30px)', width: '30px' }"
          :style="{ height: '100%', width: '30px', top: '-30px' }"
        />
        <div v-show="guidesVisible" class="rulers-left-top-box"></div>

        <!-- Editor Canvas -->
        <VueInfiniteViewer
          ref="viewer"
          class="viewer"
          :class="{
            'bg-dark-700': !editable,
            'bg-[#ededed]': editable,
            'top-30px': editable,
            'left-30px': editable,
            'w-[calc(100%-30px)]': editable,
            'h-[calc(100%-30px)]': editable,
            'w-[calc(100%)]': !editable,
            'h-[calc(100%)]': !editable,
          }"
          id="tryText"
          :useMouseDrag="shiftPressed"
          :useWheelScroll="true"
          :zoom="zoomFactor"
          :zoomOffsetX="mouseCoords.x"
          :zoomOffsetY="mouseCoords.y"
          :style="{ cursor: currentTool == EditorTool.SELECT ? 'auto' : 'crosshair' }"
          @wheel="onScroll"
          @scroll="onScroll"
          @dragover.stop="onDragOver($event)"
          @click.stop="editable && !shiftPressed && onCanvasClick($event)"
          @drop.stop="onCanvasClick($event)"
        >
          <div
            ref="viewport"
            id="tryText2"
            :class="{ viewport: true, 'viewport-area': viewportSize }"
            :style="{
              width: viewportSize ? viewportSize[0] + 'px' : '100%',
              height: viewportSize ? viewportSize[1] + 'px' : '100%',
            }"
          >
            <!-- Render Connections (default component='Connection') -->
            <component
              v-for="(c, i) in connections"
              :is="c.component"
              :key="c.id"
              :from="getItemById(items, c.from.item)!"
              :to="getItemById(items, c.to.item)!"
              :connection="c"
              :style="{ zIndex: c.z }"
              :selected="c.id === selectedItem?.id"
              @selected.stop="selectItem(c)"
            />

            <!-- Use to render a connection line during a new connection creation -->
            <RawConnection
              v-if="creatingConnection && connectionInfo.startItem"
              :x1="getHandlePosition(connectionInfo.startItem, connectionInfo.startPoint).x"
              :y1="getHandlePosition(connectionInfo.startItem, connectionInfo.startPoint).y"
              :x2="mouseCoords.x"
              :y2="mouseCoords.y"
              :type="ConnectionType.LINE"
              style="z-index: -100000"
              selected
            />
            <!-- Render Items -->
            <div
              v-for="(item, i) in items"
              class="item"
              id="tryText3"
              :key="item.id"
              :data-item-id="item.id"
              :class="{ target: item.id === selectedItem?.id, locked: item.locked === true }"
              :style="getItemStyle(item)"
              @click.stop="!creatingConnection && editable && selectItem(item)"
              @dblclick.stop="!creatingConnection && editable && inlineEdit(item)"
              @mousedown.stop="!creatingConnection && editable && selectItem(item, $event)"
              @mouseover.stop="creatingConnection && onMouseOver(item, $event)"
              @mouseleave.stop="creatingConnection && onMouseLeave(item, $event)"
            >
              <component :is="item.component" :item="item" class="screenshot" />

              <!-- Item decorators (delete, locked, size info) -->
              <div
                class="decorator decorator-delete"
                v-if="!creatingConnection && editable && item.id === selectedItem?.id && (selectedItem as Item)?.locked !== true"
                :style="{ zoom: 1 / zoomFactor }"
                @click.stop="deleteItem"
                title="delete item"
              >
                &times;
              </div>
              <div
                class="decorator decorator-locked"
                v-if="!creatingConnection && editable && item.id === selectedItem?.id"
                :style="{ zoom: 1 / zoomFactor }"
                v-show="item.locked === true"
                title="locked"
              >
                &#x1F512;
              </div>
              <div
                class="decorator decorator-size"
                v-if="!creatingConnection && editable && item.id === selectedItem?.id"
                :style="{ zoom: 1 / zoomFactor }"
              >
                X: {{ item.x }} &nbsp; Y: {{ item.y }} &nbsp; W: {{ item.w }} &nbsp; H: {{ item.h }} &nbsp;{{
                  item.r !== 0 ? ' R: ' + item.r + '°' : ''
                }}
              </div>

              <!-- Connection Handles - When the item is rotated, only the center handle is active -->
              <div
                class="connection-handle connection-handle-left"
                v-if="item.r === 0 && editable && creatingConnection && item.hover === true"
                :style="{ zoom: 1 / zoomFactor }"
                @click="connectionHandleClick(item, ConnectionHandle.LEFT)"
              ></div>
              <div
                class="connection-handle connection-handle-right"
                v-if="item.r === 0 && editable && creatingConnection && item.hover === true"
                :style="{ zoom: 1 / zoomFactor }"
                @click="connectionHandleClick(item, ConnectionHandle.RIGHT)"
              ></div>
              <div
                class="connection-handle connection-handle-top"
                v-if="item.r === 0 && editable && creatingConnection && item.hover === true"
                :style="{ zoom: 1 / zoomFactor }"
                @click="connectionHandleClick(item, ConnectionHandle.TOP)"
              ></div>
              <div
                class="connection-handle connection-handle-bottom"
                v-if="item.r === 0 && editable && creatingConnection && item.hover === true"
                :style="{ zoom: 1 / zoomFactor }"
                @click="connectionHandleClick(item, ConnectionHandle.BOTTOM)"
              ></div>
              <div
                class="connection-handle connection-handle-center"
                v-if="editable && creatingConnection && item.hover === true"
                :style="{ zoom: 1 / zoomFactor }"
                @click="connectionHandleClick(item, ConnectionHandle.CENTER)"
              ></div>
            </div>
            <!-- item -->

            <!-- Manage drag / resize / rotate / rounding of selected item -->
            <Moveable
              ref="moveable"
              :target="
                isItem(selectedItem)
                  ? isPage(selectedItem)
                    ? currentPageTargets
                    : [`[data-item-id='${(selectedItem as DiagramElement).id}']`]
                  : []
              "
              :zoom="1 / zoomFactor"
              :origin="false"
              :stopPropagation="true"
              :throttleDrag="1"
              :throttleResize="1"
              :throttleRotate="shiftPressed ? 45 : 1"
              :keepRatio="shiftPressed"
              :snappable="showGuides"
              :snapGap="true"
              :snapThreshold="5"
              :snapDirections="{ top: true, bottom: true, left: true, right: true, center: true, middle: true }"
              :elementSnapDirections="{ top: true, bottom: true, left: true, right: true, center: true, middle: true }"
              :isDisplayInnerSnapDigit="true"
              :horizontalGuidelines="
                showGuides
                  ? viewportSize
                    ? [0, viewportSize[1] / 2, viewportSize[1], ...hGuideValues]
                    : hGuideValues
                  : []
              "
              :verticalGuidelines="
                showGuides
                  ? viewportSize
                    ? [0, viewportSize[0] / 2, viewportSize[0], ...vGuideValues]
                    : vGuideValues
                  : []
              "
              :elementGuidelines="showGuides ? elementGuidelines() : []"
              :clippable="isItem(selectedItem) && selectedItem.clipType !== ClipType.NONE"
              :clipArea="false"
              :clipRelative="false"
              :dragWithClip="true"
              :clipSnapThreshold="5"
              :defaultClipPath="isItem(selectedItem) ? selectedItem.clipType : ClipType.NONE"
              :roundable="selectedItemActive && (selectedItem as Item)?.supportsRoundable === true"
              :draggable="selectedItemActive"
              :rotatable="selectedItemActive"
              :resizable="selectedItemActive && (selectedItem as Item)?.supportsResizable === true"
              @dragStart="onDragStart"
              @drag="onDrag"
              @dragEnd="onDragEnd"
              @dragGroupStart="onDragGroupStart"
              @dragGroup="onDragGroup"
              @dragGroupEnd="onDragGroupEnd"
              @resizeStart="onResizeStart"
              @resize="onResize"
              @resizeEnd="onResizeEnd"
              @rotateStart="onRotateStart"
              @rotate="onRotate"
              @rotateEnd="onRotateEnd"
              @roundStart="onRoundStart"
              @round="onRound"
              @roundEnd="onRoundEnd"
              @clipStart="onClipStart"
              @clip="onClip"
              @clipEnd="onClipEnd"
            />
          </div>
          <!-- viewport -->
        </VueInfiniteViewer>

        <div
          class="toolbars-container"
          :style="{ top: showRulers && editable ? '40px' : '10px', left: showRulers && editable ? '40px' : '10px' }"
        >
          <!-- Editor Toolbar -->
          <ToolsToolbar
            v-if="editable"
            :customWidgets="customWidgets"
            :selectedTool="currentTool"
            @toolSelected="selectCurrentTool"
          />
          <div class="toolbar-separator"></div>
          <ZoomToolbar
            ref="zoomToolbar"
            :editable="editable"
            :zoomManager="zoomManager"
            @zoomChanged="onZoomChanged"
            @mode-changed="onModeChanged"
          />
          <div class="toolbar-separator"></div>
          <div v-if="editable" class="toolbar">
            <button class="toolbar-item" @click="undo" :disabled="!historyManager.canUndo()" title="Undo">
              <EditorIcon icon="undo" />
            </button>
            <button class="toolbar-item" @click="redo" :disabled="!historyManager.canRedo()" title="Redo">
              <EditorIcon icon="redo" />
            </button>

            <div class="toolbar-item-separator"></div>
            <button class="toolbar-item" @click="deleteItem" :disabled="!selectedItemActive" title="Delete">
              <EditorIcon icon="delete" />
            </button>

            <div class="toolbar-item-separator"></div>
            <button class="toolbar-item" @click="copyItem" :disabled="!isItem(selectedItem)" title="Copy">
              <EditorIcon icon="content_copy" />
            </button>
            <button class="toolbar-item" @click="cutItem" :disabled="!isItem(selectedItem)" title="Cut">
              <EditorIcon icon="content_cut" />
            </button>
            <button class="toolbar-item" @click="pasteItem" :disabled="itemToPaste === null" title="Paste">
              <EditorIcon icon="content_paste" />
            </button>

            <div class="toolbar-item-separator"></div>
            <button class="toolbar-item" @click="sendToBack" :disabled="!selectedItemActive" title="Send to back">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                :style="{ transform: 'scale(1.0)', opacity: selectedItemActive ? 1 : 0.3 }"
              >
                <path
                  fill="gray"
                  d="M469.333333 128a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333h213.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v213.333333h85.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v298.666666a42.666667 42.666667 0 0 1-42.666667 42.666667h-298.666666a42.666667 42.666667 0 0 1-42.666667-42.666667v-85.333333H298.666667a42.666667 42.666667 0 0 1-42.666667-42.666667v-213.333333H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h298.666666z m213.333334 213.333333h-170.666667v128a42.666667 42.666667 0 0 1-42.666667 42.666667H341.333333v170.666667h170.666667v-128a42.666667 42.666667 0 0 1 42.666667-42.666667h128V341.333333z"
                />
              </svg>
            </button>
            <button class="toolbar-item" @click="bringToFront" :disabled="!selectedItemActive" title="Bring to front">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                :style="{ transform: 'scale(1.0)', opacity: selectedItemActive ? 1 : 0.3 }"
                viewBox="0 0 24 24"
              >
                <g>
                  <path fill="none" d="M0 0H24V24H0z" />
                  <path
                    fill="gray"
                    d="M11 3c.552 0 1 .448 1 1v2h5c.552 0 1 .448 1 1v5h2c.552 0 1 .448 1 1v7c0 .552-.448 1-1 1h-7c-.552 0-1-.448-1-1v-2H7c-.552 0-1-.448-1-1v-5H4c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h7zm5 5H8v8h8V8z"
                  />
                </g>
              </svg>
            </button>
            <button class="toolbar-item" @click="saveProto" title="SavePrototype">
              <EditorIcon icon="save" />
            </button>
            <button class="toolbar-item" @click="saveToImage" title="SaveImage">
              <EditorIcon icon="perm_media" />
            </button>
          </div>
          <div class="toolbar-separator"></div>
          <div v-if="editable" class="toolbar">
            <button
              class="toolbar-item"
              @click="showRulers = !showRulers"
              title="Show / Hide rulers"
              :style="{ backgroundColor: showRulers ? '#4af' : '', color: showRulers ? 'white' : '' }"
            >
              <EditorIcon icon="straighten" />
            </button>
            <button
              class="toolbar-item"
              @click="showGuides = !showGuides"
              title="Show / Hide alignment guidelines"
              :style="{ backgroundColor: showGuides ? '#4af' : '', color: showGuides ? 'white' : '' }"
            >
              <EditorIcon icon="border_style" />
            </button>
            <button
              class="toolbar-item"
              @click="showInspector = !showInspector"
              itle="Show / Hide inspector"
              :style="{ backgroundColor: showInspector ? '#4af' : '', color: showInspector ? 'white' : '' }"
            >
              <EditorIcon icon="brush" />
            </button>
            <button
              class="toolbar-item"
              @click="showKeyboard = !showKeyboard"
              title="Show / Hide keyboards shortcuts"
              :style="{ backgroundColor: showKeyboard ? '#4af' : '', color: showKeyboard ? 'white' : '' }"
            >
              <EditorIcon icon="keyboard_hide" />
            </button>
          </div>
        </div>

        <KeyboardHelp
          v-if="showKeyboard"
          style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-order: 1000"
        />
      </div>
      <!-- editor-container -->
    </div>
    <div v-if="editable" class="flex flex-col w-90 bg-[#494949] h-full">
      <n-config-provider :theme="darkTheme" :theme-overrides="prototypeWorkspaceConfig">
        <SyncEditMembers v-if="isSyncManagerInitialized" />
        <ObjectInspector :schema="objectInspectorSchema" :object="selectedItem" @property-changed="onPropertyChange" />
      </n-config-provider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onKeyStroke, useKeyModifier } from '@vueuse/core';
import { computed, getCurrentInstance, nextTick, onBeforeMount, onMounted, ref } from 'vue';
import Guides from 'vue3-guides';
import { VueInfiniteViewer } from 'vue3-infinite-viewer';
import Moveable from 'vue3-moveable';
import ChangeZOrderCommand from './commands/ChangeZOrderCommand';
import HistoryManager from './commands/HistoryManager';
import { LockCommand, UnlockCommand } from './commands/LockCommand';
import MoveCommand from './commands/MoveCommand';
import ResizeCommand from './commands/ResizeCommand';
import RotateCommand from './commands/RotateCommand';
import RoundCommand from './commands/RoundCommand';
import {
  createConnection,
  findMaxZ,
  findMinZ,
  getHandlePosition,
  getItemBlueprint,
  getItemById,
  getItemStyle,
  getUniqueId,
  registerDefaultItemTypes,
} from './helpers';

import RawConnection from './blocks/RawConnection.vue';
import AddItemCommand from './commands/AddItemCommand';
import ToolsToolbar from './components/ToolsToolbar.vue';
import ZoomToolbar from './components/ZoomToolbar.vue';
import {
  ClipType,
  ConnectionHandle,
  ConnectionType,
  DiagramElement,
  EditorTool,
  Frame,
  getToolDefinition,
  isConnection,
  isItem,
  isPage,
  Item as _Item,
  ItemConnection,
  PageItem,
  Position,
} from './types';

import ObjectInspector from '../inspector/ObjectInspector.vue';
import { ObjectProperty } from '../inspector/types';
import AddConnectionCommand from './commands/AddConnectionCommand';
import ClipCommand from './commands/ClipCommand';
import DeleteCommand from './commands/DeleteCommand';
import KeyboardHelp from './components/KeyboardHelp.vue';
import { DefaultZoomManager, IZoomManager } from './ZoomManager';
import { useRoute } from 'vue-router';
import ZoomToolbarVue from './components/ZoomToolbar.vue';
import { editFile, readFile } from '@/api/file';
import html2canvas from 'html2canvas';
import { createSyncManager, syncManager, isSyncManagerInitialized, OperationType } from './synchronous/SyncManager';
import { wsurl } from '@/api/utils/request';
import { darkTheme } from 'naive-ui';
import { prototypeWorkspaceConfig } from '@/config/color';
import { resolve } from 'path';
import router from '@/router';
export type Item = _Item & { hover?: boolean };
// The component props and events
// ------------------------------------------------------------------------------------------------------------------------
export interface DiagramEditorProps {
  customWidgets?: boolean;
  viewportSize?: [number, number];
}

export interface DiagramEditorEvents {
  (e: 'add-item', item: Item): void;
  (e: 'delete-item', item: Item): void;

  (e: 'add-connection', connection: ItemConnection): void;
  (e: 'delete-connection', connection: ItemConnection): void;
}

// Define props
const { viewportSize } = withDefaults(defineProps<DiagramEditorProps>(), {
  customWidgets: false,
});

// Define events
const emit = defineEmits<DiagramEditorEvents>();
// ------------------------------------------------------------------------------------------------------------------------

onMounted(() => {
  console.log('DiagramEditor onMounted');

  registerDefaultItemTypes();

  // Initialize rulers and infinite viewer
  hGuides.value.resize();
  vGuides.value.resize();

  viewer.value.scrollCenter();

  // pages.value = loadElements.value.filter((ele) => ele.isPage == true) as PageItem[];
});

onBeforeMount(() => {
  loadProto();
});

// watch(()=>selectedItem.value)

// Set the handlers to manage keyboard shortcuts
setupKeyboardHandlers();

const editable = ref(true);
// The component state
// ------------------------------------------------------------------------------------------------------------------------
const zoomManager = ref<IZoomManager>(new DefaultZoomManager());
const zoomFactor = ref(1);

const viewer = ref();
const viewport = ref<HTMLDivElement>();
const moveable = ref();
const moveableInspector = ref();
const zoomToolbar = ref<InstanceType<typeof ZoomToolbarVue> | null>(null);

const hGuides = ref();
const vGuides = ref();
const showRulers = ref(true);
const guidesVisible = computed(() => showRulers.value && editable.value);
const hGuideValues = ref<number[]>([]); // Horizontal guides added by the user
const vGuideValues = ref<number[]>([]); // Vertical guides added by the user
const showGuides = ref(true); // Show or hide all the guides
const showInspector = ref(true); // Show or hide all the guides
const showKeyboard = ref(false); // Show or hide all the guides

const loadElements = ref<Array<DiagramElement>>([]);
const selectedItem = ref<DiagramElement | null>(null);
const selectedPageItems = ref<Array<Item>>([]);
const currentPageTargets = ref<Array<string>>([]);

const selectedItemActive = computed(() => {
  if (!selectedItem.value) return false;

  // An item is 'active' if not locked, a connection is always 'active'
  return isItem(selectedItem.value) ? !selectedItem.value.locked === true : true;
});

const objectInspectorSchema = computed(() => {
  return selectedItem.value ? getItemBlueprint(selectedItem.value.component)[1] : null;
});

const shiftPressed = useKeyModifier('Shift');
const historyManager = ref(new HistoryManager());
const currentTool = ref(EditorTool.SELECT);
const currentIcon = ref('');

const creatingConnection = computed<boolean>(() => currentTool.value === EditorTool.CONNECTION);

const items = computed(() => {
  return loadElements.value.filter((e) => isItem(e)) as Item[];
});
const connections = computed(() => loadElements.value.filter((e) => isConnection(e)) as ItemConnection[]);
const pages = ref<Array<PageItem>>([]);
const currentPage = ref<PageItem | null>(null);

const itemToPaste = ref(null as Item | null);
const inlineEditing = ref(false);

// Temporary variables
// ------------------------------------------------------------------------------------------------------------------------
const origin: Frame = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  z: 0,
  r: 0,
  borderRadius: 0,
  opacity: 1,
  clipType: ClipType.NONE,
  clipStyle: '',
};

let originGroup: Frame[];

// Track mouse position within the viewport coordinates
const mouseCoords = ref<Position>({ x: 0, y: 0 });

const route = useRoute();
const handleToolBoxSelect = (selected: EditorTool) => {
  currentTool.value = selected;
  currentIcon.value = '';
};

const handleIconSelected = (icon: string) => {
  currentTool.value = EditorTool.ICON;
  currentIcon.value = icon;
};
var canvas2 = document.createElement('canvas');
var ctx2 = canvas2.getContext('2d');
function draw() {
  let elems = Array.from(document.getElementsByClassName('screenshot') as HTMLCollectionOf<HTMLElement>);

  var len = elems.length;
  console.log('len:' + len);
  canvas2.width = 1000;
  canvas2.height = 800;
  var index = 0;
  elems.forEach((elem: any) => {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    if (context != null) {
      context.fillStyle = 'rgba(255, 255, 255, 0)';
    }
    var width = elem.offsetWidth; //获取dom 宽度
    var height = elem.offsetHeight; //获取dom 高度

    canvas.width = width;
    console.log('text' + canvas.width);
    canvas.height = height;
    var opts = {
      scale: 1, // 添加的scale 参数
      canvas: canvas, //自定义 canvas
      logging: true, //日志开关
      width: width, //dom 原始宽度
      height: height, //dom 原始高度
      useCORS: true,
      withCredentials: true,
      allowTaint: true,
      backgroundColor: null,
    };
    html2canvas(elem, opts).then(function (canvas) {
      if (ctx2 != null) {
        ctx2.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        index++;
        console.log(index);
        if (index == len) {
          let imgUrl = canvas2.toDataURL();
          let a = document.createElement('a');
          a.href = imgUrl;
          // 利用浏览器下载器下载图片
          a.setAttribute('download', '需要生成图片.png');
          a.click();
        }
      }
    });
  });
  return Promise.resolve(123);
}

function saveToImage() {
  draw();
  let dom = document.createElement('div');
  // elems.forEach((elem) => {
  //   var node = elem.cloneNode();
  //   dom.appendChild(node);
  // });

  // var canvas = document.getElementsByClassName('viewport-area')[0] as HTMLElement;
  // var canvas = document.getElementById('tryText') as HTMLElement;
  // var canvas = dom as HTMLElement;
  // htmlToImage.toPng(canvas).then((canvas) => {
  //   FileSaver.saveAs(canvas, 'test.png');
  // });

  // const shareContent = document.getElementById('tryText2') as HTMLElement; //需要截图的包裹的（原生的）DOM 对象

  // // const shareContent = dom;
  // var width = shareContent.offsetWidth; //获取dom 宽度
  // var height = shareContent.offsetHeight; //获取dom 高度
  // var canvas = document.createElement('canvas'); //创建一个canvas节点
  // var scale = 1; //定义任意放大倍数 支持小数
  // canvas.width = width * 1; //定义canvas 宽度 * 缩放
  // canvas.height = height * 1; //定义canvas高度 *缩放
  // canvas.getContext('2d').scale(scale, scale); //获取context,设置scale
  // var opts = {
  //   scale: 1, // 添加的scale 参数
  //   canvas: canvas, //自定义 canvas
  //   logging: true, //日志开关
  //   width: width, //dom 原始宽度
  //   height: height, //dom 原始高度
  //   useCORS: true,
  //   withCredentials: true,
  //   allowTaint: true,
  // };
  // html2canvas(shareContent, opts).then(function (canvas) {
  //   //如果想要生成图片 引入canvas2Image.js 下载地址：
  //   //https://github.com/hongru/canvas2image/blob/master/canvas2image.js
  //   let imgUrl = canvas.toDataURL();
  //   // 动态生成下载图片链接
  //   let a = document.createElement('a');
  //   a.href = imgUrl;
  //   // 利用浏览器下载器下载图片
  //   a.setAttribute('download', '需要生成图片.png');
  //   a.click();
  // });
}

function onDragOver(e: any) {
  if (!viewport.value) return;
  // console.log('onDragOver', e.srcElement, e.offsetX, e.offsetY, e);
  e.preventDefault();
  // Mouse position
  const rect = viewport.value.getBoundingClientRect();
  mouseCoords.value.x = Math.floor((e.clientX - rect.left) / zoomFactor.value);
  mouseCoords.value.y = Math.floor((e.clientY - rect.top) / zoomFactor.value);
}

let connectionInfo: {
  startItem: Item | null;
  endItem: Item | null;
  startPoint: ConnectionHandle;
  endPoint: ConnectionHandle;
} = {
  startItem: null,
  endItem: null,
  startPoint: ConnectionHandle.CENTER,
  endPoint: ConnectionHandle.CENTER,
};

function onMouseOver(item: Item, e: MouseEvent) {
  if (!creatingConnection.value === true) return;
  item.hover = true;
}

function onMouseLeave(item: Item, e: MouseEvent) {
  if (!creatingConnection.value === true) return;
  if ('hover' in item) delete item.hover;
}

function selectItem(item: Item | ItemConnection, e?: MouseEvent): void {
  // Item already selected?
  if (item.id === selectedItem.value?.id) return;
  if (item.isPage == false) {
    selectNone();
    nextTick(() => {
      selectedItem.value = item;
      if (e)
        nextTick(() => {
          moveable.value?.dragStart(e);
        });

      if (moveableInspector.value) moveableInspector.value.updateRect();
    });
  } else {
    selectNone();
    // handleSelectPage(selectedItem.value as PageItem);
    // console.log('page selected');

    nextTick(() => {
      selectedItem.value = item;
      selectedPageItems.value = loadElements.value.filter((elem) => {
        return (item as PageItem).containedIDs.includes(`[data-item-id='${elem.id}']`);
      }) as Item[];
      nextTick(() => {
        selectPage(item as PageItem);
      });
      if (moveableInspector.value) moveableInspector.value.updateRect();
    });
  }
}

function selectNone(): void {
  const target = getTargetElement(selectedItem.value as Item);
  if (target) {
    const elementToEdit = target.querySelector('.diagram-item-inline-edit') as HTMLElement;
    if (elementToEdit) {
      elementToEdit.removeAttribute('contenteditable');
      selectedItem.value!.title = elementToEdit.innerHTML;
      inlineEditing.value = false;
    }
  }

  selectedItem.value = null;
  nextTick(() => {
    if (moveableInspector.value) moveableInspector.value.updateRect();
  });
}

// ---------------------------------------------------------------------------------------------------------------------
// Drag item
// ---------------------------------------------------------------------------------------------------------------------
function onDragStart(e: any): void {
  if (!isItem(selectedItem.value)) return;

  const target = getTargetElement(selectedItem.value);
  if (target && target.contentEditable === 'true') {
    e.stop();
    return;
  }
  if (selectedItem.value != null) {
    origin.x = selectedItem.value.x;
    origin.y = selectedItem.value.y;
  }
}

function onDragGroupStart(e: { events: any }): void {
  e.events.forEach((ev: any, i: number) => {
    if (selectedPageItems.value[i] != null) {
      originGroup[i].x = selectedPageItems.value[i].x;
      originGroup[i].y = selectedPageItems.value[i].y;
    }
  });
}

function onDrag(e: any): void {
  if (!isItem(selectedItem.value)) return;
  if (selectedItem.value != null) {
    selectedItem.value.x = Math.floor(e.beforeTranslate[0]);
    selectedItem.value.y = Math.floor(e.beforeTranslate[1]);
    e.target.style.transform = e.transform;
    syncManager.sendMessage(OperationType.MOVE, {
      targetID: selectedItem.value.id,
      x: selectedItem.value.x,
      y: selectedItem.value.y,
    });
  }
}

function onDragGroup(e: { events: any }): void {
  if (!isItem(selectedItem.value)) return;

  e.events.forEach((e: any, i: number) => {
    if (selectedPageItems.value[i] != null) {
      selectedPageItems.value[i].x = Math.floor(e.beforeTranslate[0]);
      selectedPageItems.value[i].y = Math.floor(e.beforeTranslate[1]);
      e.target.style.transform = e.transform;
      syncManager.sendMessage(OperationType.MOVE, {
        targetID: selectedPageItems.value[i].id,
        x: selectedPageItems.value[i].x,
        y: selectedPageItems.value[i].y,
      });
    }
  });
}

function onDragEnd(e: any): void {
  if (!isItem(selectedItem.value)) return;

  // Item just cliked, no move ?
  if (origin.x === selectedItem.value.x && origin.y === selectedItem.value.y) return;
  if (selectedItem.value.isPage) {
    selectNone();
  }
  if (selectedItem.value != null) {
    historyManager.value.execute(
      new MoveCommand(selectedItem.value, [origin.x, origin.y], [selectedItem.value.x, selectedItem.value.y])
    );
  }
}

function onDragGroupEnd(e: { events: any }): void {
  if (!isItem(selectedItem.value)) return;
  selectNone();
  selectedPageItems.value.forEach((pageItem, i: number) => {
    //console.log('ondragend', pageItem.x, pageItem.y);
    if (pageItem != null) {
      historyManager.value.execute(
        new MoveCommand(pageItem, [originGroup[i].x, originGroup[i].y], [pageItem.x, pageItem.y])
      );
    }
  });
}

// ---------------------------------------------------------------------------------------------------------------------
// Handle Move Sync
// ---------------------------------------------------------------------------------------------------------------------

function handleSync() {
  syncManager.registerMoveFunc((targetID: string, x: number, y: number) => {
    var element = loadElements.value.find((elem) => elem.id == targetID);
    if (element != null) {
      (element as Item).x = x;
      (element as Item).y = y;
    }
  });
  syncManager.registerResizeFunc((targetID: string, x: number, y: number, w: number, h: number) => {
    var element = loadElements.value.find((elem) => elem.id == targetID);
    if (element != null) {
      (element as Item).x = x;
      (element as Item).y = y;
      (element as Item).w = w;
      (element as Item).h = h;
    }
  });
  syncManager.registerAddItemFunc((element: DiagramElement, targetPageID: string) => {
    if (element.isPage) {
      var newPageName = (element as PageItem).pageName;
      var resolution = (element as PageItem).w + 'x' + (element as PageItem).h;
      addPage(newPageName, resolution);
      focusPage(currentPage.value as PageItem);
    } else {
      var page = loadElements.value.find((elem) => elem.id == targetPageID) as PageItem;
      historyManager.value.execute(new AddItemCommand(loadElements.value, element as Item, page));
    }
  });
  syncManager.registerDeleteItemFunc((targetID: string) => {
    var element = loadElements.value.find((elem) => elem.id == targetID);
    if (element?.isPage) {
      var index = pages.value.findIndex((ele) => ele.id == targetID);
      pages.value.splice(index, 1);
      currentPage.value = null;
      currentPageTargets.value = [];
      var containedIDs = (selectedItem.value as PageItem).containedIDs;
      var deleteItems = loadElements.value.filter((ele) => {
        return containedIDs.includes(`[data-item-id='${ele.id}']`);
      });
      deleteItems.forEach((ele) => {
        historyManager.value.execute(new DeleteCommand(loadElements.value, ele));
      });
    } else {
      historyManager.value.execute(new DeleteCommand(loadElements.value, element as Item));
    }
  });
  syncManager.registerModifyFunc((element: DiagramElement) => {
    selectedItem.value = element;
    var trueElementIndex = loadElements.value.findIndex((elem) => elem.id == element.id);
    loadElements.value.splice(trueElementIndex, 1, element);
    nextTick(() => moveable.value?.updateRect());
  });
}

// ---------------------------------------------------------------------------------------------------------------------
// Resize item
// ---------------------------------------------------------------------------------------------------------------------
function onResizeStart(e: any): void {
  if (!isItem(selectedItem.value)) return;

  origin.x = selectedItem.value.x;
  origin.y = selectedItem.value.y;
  origin.w = selectedItem.value.w;
  origin.h = selectedItem.value.h;
}

function onResize(e: any): void {
  if (!isItem(selectedItem.value)) return;

  // console.log('onresize', e);
  selectedItem.value.x = Math.floor(e.drag.beforeTranslate[0]);
  selectedItem.value.y = Math.floor(e.drag.beforeTranslate[1]);
  selectedItem.value.w = Math.floor(e.width);
  selectedItem.value.h = Math.floor(e.height);

  syncManager.sendMessage(OperationType.RESIZE, {
    targetID: selectedItem.value.id,
    x: selectedItem.value.x,
    y: selectedItem.value.y,
    w: selectedItem.value.w,
    h: selectedItem.value.h,
  });

  e.target.style.transform = e.drag.transform;
  e.target.style.width = `${Math.floor(e.width)}px`;
  e.target.style.height = `${Math.floor(e.height)}px`;
}

function onResizeEnd(e: any): void {
  if (isItem(selectedItem.value))
    historyManager.value.execute(new ResizeCommand(selectedItem.value, { ...origin }, { ...selectedItem.value }));
}

// ---------------------------------------------------------------------------------------------------------------------
// Rotate item
// ---------------------------------------------------------------------------------------------------------------------
function onRotateStart(e: any): void {
  if (isItem(selectedItem.value)) origin.r = selectedItem.value.r;
}

function onRotate(e: any): void {
  if (!isItem(selectedItem.value)) return;

  // console.log('onrotate', item, e);
  selectedItem.value.r = e.beforeRotate % 360;
  e.target.style.transform = e.drag.transform;
}

function onRotateEnd(e: any): void {
  if (isItem(selectedItem.value))
    historyManager.value.execute(new RotateCommand(selectedItem.value, origin.r, selectedItem.value.r));
}

// ---------------------------------------------------------------------------------------------------------------------
// Round item
// ---------------------------------------------------------------------------------------------------------------------
function onRoundStart(e: any): void {
  if (isItem(selectedItem.value)) origin.borderRadius = selectedItem.value.borderRadius;
}

function onRound(e: any): void {
  if (!isItem(selectedItem.value)) return;

  selectedItem.value.borderRadius = parseInt(e.borderRadius) || 0;
  e.target.style.borderRadius = e.borderRadius;
}

function onRoundEnd(e: any): void {
  if (isItem(selectedItem.value))
    historyManager.value.execute(
      new RoundCommand(selectedItem.value, origin.borderRadius, selectedItem.value.borderRadius)
    );
}

// ---------------------------------------------------------------------------------------------------------------------
// Clip item
// ---------------------------------------------------------------------------------------------------------------------
function onClipStart(e: any): void {
  if (!isItem(selectedItem.value)) return;
  // console.log('onClipStart', e);

  origin.clipType = e.clipType;
  origin.clipStyle = e.clipStyle;
  if (
    origin.clipStyle === ClipType.RECT ||
    origin.clipStyle === ClipType.POLYGON ||
    origin.clipStyle === ClipType.ELLIPSE
  )
    origin.clipStyle = '';
}

function onClip(e: any): void {
  if (!isItem(selectedItem.value)) return;

  if (e.clipType === ClipType.RECT) e.target.style.clip = e.clipStyle;
  else e.target.style.clipPath = e.clipStyle;

  selectedItem.value.clipType = e.clipType;
  selectedItem.value.clipStyle = e.clipStyle;
}

function onClipEnd(e: any): void {
  // console.log('onClipEnd', e);

  if (isItem(selectedItem.value))
    historyManager.value.execute(
      new ClipCommand(
        selectedItem.value,
        origin.clipType,
        origin.clipStyle,
        selectedItem.value.clipType,
        selectedItem.value.clipStyle
      )
    );
}

// ---------------------------------------------------------------------------------------------------------------------
// Synch viewer / guieds scrolling
// ---------------------------------------------------------------------------------------------------------------------
function onScroll(e: any): void {
  if (e.ctrlKey) zoomFactor.value = e.deltaY < 0 ? zoomManager.value.zoomIn() : zoomManager.value.zoomOut();

  if (hGuides.value) {
    hGuides.value.scroll(e.scrollLeft);
    hGuides.value.scrollGuides(e.scrollTop);
  }
  if (vGuides.value) {
    vGuides.value.scroll(e.scrollTop);
    vGuides.value.scrollGuides(e.scrollLeft);
  }
}

/** Send the selected item to the bottom of the z-index */
function sendToBack(): void {
  if (selectedItem.value)
    historyManager.value.execute(
      new ChangeZOrderCommand(selectedItem.value, selectedItem.value.z, findMinZ(items.value as Item[]) - 1)
    );
}

/** Send the selected item to the top of the z-index */
function bringToFront(): void {
  if (selectedItem.value)
    historyManager.value.execute(
      new ChangeZOrderCommand(selectedItem.value, selectedItem.value.z, findMaxZ(items.value as Item[]) + 1)
    );
}

/** Save the scene into a json file */
function saveProto(): void {
  var protoData = JSON.stringify(loadElements.value as Item[]);
  // localStorage.setItem('proto', protoData);
  var protoID = parseInt(route.params.protoID as string);
  editFile({ fileID: protoID, data: protoData }).then((res) => {
    window.$message.info('已保存');
  });
}

function loadProto() {
  var protoID = parseInt(route.params.protoID as string);
  readFile({ fileID: protoID, teamID: null })
    .then((res) => {
      if (res.data.data != null) {
        loadElements.value = JSON.parse(res.data.data) as DiagramElement[];
      } else {
        loadElements.value = [
          // createPageItem()
        ];
      }
    })
    .finally(() => {
      pages.value = loadElements.value.filter((ele) => ele.isPage == true) as PageItem[];
      selectPage(pages.value[0]);
      originGroup = new Array<Frame>(loadElements.value.length)
        .fill({
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          z: 0,
          r: 0,
          borderRadius: 0,
          opacity: 1,
          clipType: ClipType.NONE,
          clipStyle: '',
        })
        .map((item: Frame) => ({
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          z: 0,
          r: 0,
          borderRadius: 0,
          opacity: 1,
          clipType: ClipType.NONE,
          clipStyle: '',
        }));
      createSyncManager(wsurl, loadElements.value);
      handleSync();
    });
}

function handleCreatePage(newPageName: string, pageResolution: string) {
  addPage(newPageName, pageResolution);
  focusPage(currentPage.value as PageItem);
  syncManager.sendMessage(OperationType.ADD_ITEM, { element: currentPage.value });
}

function addPage(newPageName: string, pageResolution: string): void {
  // TODO: page ID and save proto
  saveProto();
  // Clicking the canvas with other tools => create a new item of related type
  const toolDef = getToolDefinition(EditorTool.PAGE);
  const properties = getItemBlueprint(toolDef.itemType!)[0];
  const wh = pageResolution.split('x');
  const w = parseInt(wh[0]);
  const h = parseInt(wh[1]);
  let accWidth = 0;
  pages.value.forEach((page) => {
    accWidth += page.w + 200;
  });
  const newItem = deepCloneItem({
    ...properties,
    id: getUniqueId(),
    x: 200 + accWidth,
    y: 200,
    w: w,
    h: h,
    pageName: newPageName,
  });

  historyManager.value.execute(new AddItemCommand(loadElements.value, newItem, newItem as PageItem));
  currentPage.value = newItem;
  pages.value.push(currentPage.value as PageItem);
  emit('add-item', newItem);
}

/** Delete current selected item / connection */
function deleteItem() {
  if (isItem(selectedItem.value)) {
    if (isPage(selectedItem.value)) {
      var index = pages.value.findIndex((ele) => ele.id == selectedItem.value?.id);
      pages.value.splice(index, 1);
      currentPage.value = null;
      currentPageTargets.value = [];
      var containedIDs = (selectedItem.value as PageItem).containedIDs;
      console.log(containedIDs);
      var deleteItems = loadElements.value.filter((ele) => {
        return containedIDs.includes(`[data-item-id='${ele.id}']`);
      });
      console.log(deleteItems);
      deleteItems.forEach((ele) => {
        syncManager.sendMessage(OperationType.DELETE_ITEM, { targetID: (ele as DiagramElement).id });
        historyManager.value.execute(new DeleteCommand(loadElements.value, ele));
      });
    } else {
      syncManager.sendMessage(OperationType.DELETE_ITEM, { targetID: (selectedItem.value as DiagramElement).id });
      historyManager.value.execute(new DeleteCommand(loadElements.value, selectedItem.value));
      emit('delete-item', selectedItem.value);
      selectNone();
    }
  }

  if (isConnection(selectedItem.value)) {
    historyManager.value.execute(new DeleteCommand(loadElements.value, selectedItem.value));
    emit('delete-connection', selectedItem.value);
    selectNone();
  }
}

/** Lock current selected item */
function lockItem(item: Item) {
  historyManager.value.execute(item.locked === true ? new UnlockCommand(item) : new LockCommand(item));
}

function elementGuidelines() {
  if (!viewport.value) return [];

  return Array.prototype.slice
    .call(viewport.value!.querySelectorAll('.item'), 0)
    .filter((n) => !n.classList.contains('target'));
}

/** Undo last action done (is possible) */
function undo() {
  if (!historyManager.value.canUndo()) return;

  historyManager.value?.undo();
  selectNone();
  nextTick(() => moveable.value?.updateTarget());
}

/** Redo last undoed action (is possible) */
function redo() {
  if (!historyManager.value.canRedo()) return;

  historyManager.value?.redo();
  nextTick(() => moveable.value?.updateTarget());
}

/** Select the current tool to use (selection, connection, text, image, ...) */
function selectCurrentTool(tool: EditorTool): void {
  // console.log('selectCurrentTool', tool);

  currentTool.value = tool;
  selectNone();

  if (tool == EditorTool.CONNECTION) {
    // console.log('Creating connection');
    nextTick(() => {
      connectionInfo.startItem = null;
      connectionInfo.endItem = null;
    });

    return;
  }
}

/** Handle the clik in the overall canvas */
function onCanvasClick(e: any): void {
  console.log('onCanvasClick', e);

  // Was just clicking the scrollbar for scrolling?
  if (e.target?.classList?.contains('infinite-viewer-scroll-thumb')) return;

  // Current tool is 'select' => clicking the canvas unselect all
  if (currentTool.value === EditorTool.SELECT) {
    if (!selectedItem.value?.isPage) {
      console.log('Unselecting all');
      selectNone();
    }
    // selectNone();
    return;
  }

  // Clicking in the canvas resets the current connection creation
  if (currentTool.value === EditorTool.CONNECTION) {
    connectionInfo.startItem = null;
    connectionInfo.endItem = null;
    return;
  }

  // Clicking the canvas with other tools => create a new item of related type
  const toolDef = getToolDefinition(currentTool.value);
  const newItem = deepCloneItem({
    ...getItemBlueprint(toolDef.itemType!)[0],
    id: getUniqueId(),
    x: mouseCoords.value.x,
    y: mouseCoords.value.y,
    title: currentIcon.value,
  });
  console.log('creating new item', toolDef, toolDef.itemType, newItem);
  historyManager.value.execute(new AddItemCommand(loadElements.value, newItem, currentPage.value));
  syncManager.sendMessage(OperationType.ADD_ITEM, { element: newItem, targetPageID: currentPage.value?.id });
  emit('add-item', newItem);
  currentTool.value = EditorTool.SELECT;
}

/** Handle a click on the connection handles */
function connectionHandleClick(item: Item, point: ConnectionHandle) {
  console.log('connectionHandleClick', item, point);

  // Shorter alias
  const ci = connectionInfo;

  // We are clicking the starting item/point
  if (ci.startItem == null) {
    ci.startItem = item;
    ci.startPoint = point;
    return;
  }

  // We are clicking the ending item/point
  ci.endItem = item;
  ci.endPoint = point;

  const newConnection = deepCloneItem(
    createConnection(ci.startItem.id, ci.endItem.id, { from: { handle: ci.startPoint }, to: { handle: ci.endPoint } })
  );

  ci.startItem = null;
  ci.endItem = null;

  historyManager.value.execute(new AddConnectionCommand(loadElements.value, newConnection));
  emit('add-connection', newConnection);
}

function onPropertyChange(p: ObjectProperty, newValue: any) {
  //console.log('onPropertyChange', p, 'New value:', newValue);
  // TODO: create a history command for this change so the action is undoable (for that we need the 'oldValue' as well)
  // historyManager.value.execute(new PropertyChangeCommand(selectedItem.value, oldValue, newValue));
  syncManager.sendMessage(OperationType.MODIFY, { element: selectedItem.value });
  nextTick(() => moveable.value?.updateRect());
}

/** Handle zoom changes from the zoom toolbar */
function onZoomChanged(newZoomFactor: number, scrollViewerToCenter?: boolean) {
  console.log('onZoomChanged', newZoomFactor, scrollViewerToCenter);
  zoomFactor.value = newZoomFactor;

  if (scrollViewerToCenter === true) nextTick(() => viewer.value?.scrollCenter());
}

function onModeChanged() {
  if (editable.value == false) {
    router.go(0);
    window.location.reload();
  }
  editable.value = !editable.value;
}

/** Handle scroll to page */
function handleSelectPage(page: PageItem) {
  selectNone();
  selectPage(page);
  focusPage(page);
  nextTick(() => {
    selectedItem.value = page;
    selectedPageItems.value = loadElements.value.filter((elem) => {
      return (page as PageItem).containedIDs.includes(`[data-item-id='${elem.id}']`);
    }) as Item[];
    if (moveableInspector.value) moveableInspector.value.updateRect();
  });
}

function focusPage(page: PageItem) {
  window.$message.info('聚焦' + page.pageName);
  const left = page.x - 100;
  const top = page.y - 100;
  viewer.value?.scrollTo(left, top);
  zoomToolbar.value?.zoomReset();
  console.log('page info', currentPage.value, currentPageTargets.value);
}

function selectPage(page: PageItem) {
  currentPage.value = page;
  if (page != null) {
    currentPageTargets.value = page.containedIDs;
  }
}

/** Setup all the keyboard shortcuts */
function setupKeyboardHandlers() {
  // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

  function onKey(keys: string | string[], handler: (e: KeyboardEvent) => void) {
    onKeyStroke(
      keys,
      (e) => {
        if (document.activeElement) {
          // console.log('active element', document.activeElement, e);
          if (['INPUT', 'SELECT'].includes(document.activeElement.tagName) || inlineEditing.value === true) return;
        }

        e.preventDefault();
        handler(e);
      },
      { eventName: 'keydown' }
    );
  }

  function isVirtualCtrl(e: KeyboardEvent) {
    const isMac = navigator.userAgent.toLowerCase().includes('macintosh');
    return isMac ? e.metaKey : e.ctrlKey;
  }

  // Delete / backspace to delete selected item
  onKey(['Backspace', 'Delete'], (e: KeyboardEvent) => {
    console.log('Pressed delete', e);
    if (selectedItem.value) deleteItem();
  });

  // CMD+Z to undo, Shift+CMD+Z to redo
  onKey(['z'], (e: KeyboardEvent) => {
    if (isVirtualCtrl(e)) {
      if (e.shiftKey) redo();
      else undo();
    }
  });

  // CMD+Z to undo, Shift+CMD+Z to redo
  onKey(['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'], (e: KeyboardEvent) => {
    if (!selectedItem.value) return;

    console.log('Pressed arrow key', e);

    const item = selectedItem.value as Item;

    let dx = 0,
      dy = 0;
    if (e.key == 'ArrowLeft') dx = -1;
    if (e.key == 'ArrowRight') dx = 1;
    if (e.key == 'ArrowUp') dy = -1;
    if (e.key == 'ArrowDown') dy = 1;

    if (e.shiftKey) {
      dx *= 10;
      dy *= 10;
    }

    historyManager.value.execute(new MoveCommand(item as Item, [item.x, item.y], [item.x + dx, item.y + dy]));
    nextTick(() => moveable.value?.updateRect());
  });

  onKey(['s'], (e: KeyboardEvent) => {
    if (isVirtualCtrl(e)) {
      saveProto();
    }
  });

  // Shortcuts to tools selection
  // onKey(['s'], (e: KeyboardEvent) => selectCurrentTool(EditorTool.SELECT)); // S = Select tool
  onKey(['t'], (e: KeyboardEvent) => selectCurrentTool(EditorTool.TEXT)); // T = Text tool
  onKey(['i'], (e: KeyboardEvent) => (showInspector.value = !showInspector.value)); // I = Show/hide inspector
  onKey(['k'], (e: KeyboardEvent) => (showKeyboard.value = !showKeyboard.value)); // K = Show/Hide keyboard help

  // R = Rectanble tool, CMD+R = Reload
  onKey(['r'], (e: KeyboardEvent) =>
    isVirtualCtrl(e) ? window.location.reload() : selectCurrentTool(EditorTool.RECTANGLE)
  );

  // C = Connection tool, CMD+C = Copy
  onKey(['l'], (e: KeyboardEvent) => (isVirtualCtrl(e) ? copyItem() : selectCurrentTool(EditorTool.CONNECTION)));

  // CMD+X = Cut, CMD+V = Cut
  onKey(['x'], (e: KeyboardEvent) => {
    if (isVirtualCtrl(e)) cutItem();
  });
  onKey(['v'], (e: KeyboardEvent) => {
    if (isVirtualCtrl(e)) pasteItem();
  });

  onKey(['Escape'], (e: KeyboardEvent) => {
    if (creatingConnection.value === true) {
      console.log('ESC pressed: cancelling connection creation');
      connectionInfo.startItem = null;
      connectionInfo.endItem = null;
      selectCurrentTool(EditorTool.SELECT);
      nextTick(() => selectCurrentTool(EditorTool.CONNECTION));
    }
  });
}

// Clipboard management
// ---------------------------------------------------------------------------------------------------------------------
function deepCloneItem(item: any): any {
  return JSON.parse(JSON.stringify(item));
}

function copyItem() {
  if (!isItem(selectedItem.value)) return;

  console.log('Copying item', selectedItem.value);

  itemToPaste.value = selectedItem.value;

  // TODO:  notify the user visually that the item has been copied
}

function cutItem() {
  if (!isItem(selectedItem.value)) return;

  console.log('Cutting item', selectedItem.value);
  itemToPaste.value = selectedItem.value;
  deleteItem();
}

function pasteItem() {
  if (!itemToPaste.value) return;
  console.log('Paste item', selectedItem.value);

  const newItem = deepCloneItem(itemToPaste.value) as Item;

  newItem.id = getUniqueId();
  newItem.x += 20;
  newItem.y += 20;

  historyManager.value.execute(new AddItemCommand(loadElements.value, newItem, currentPage.value));
  itemToPaste.value = newItem;
  nextTick(() => selectItem(newItem));

  emit('add-item', newItem);
}
// ---------------------------------------------------------------------------------------------------------------------

function getTargetElement(item: Item): HTMLDivElement | undefined {
  if (!item) return undefined;
  const el = viewport.value?.querySelector(`[data-item-id='${item.id}']`);
  if (el === undefined || el === null) return undefined;

  return el as HTMLDivElement;
}

function inlineEdit(item: Item) {
  const target = getTargetElement(item);
  if (!target) return;

  // Find the child element with the 'diagram-item-inline-edit' CSS class (if any)
  const elementToEdit = target.querySelector('.diagram-item-inline-edit') as HTMLElement;
  if (elementToEdit) {
    elementToEdit.contentEditable = 'true';
    elementToEdit.focus();
    inlineEditing.value = true;
  }
}
</script>

<style>
.diagram-item-inline-edit {
  /* marker class */
  cursor: auto;
}
</style>

<style scoped>
.editor-container {
  position: relative;
  border: 1px solid #ccc;
  width: 100%;
  height: 100%;
  background-color: white;
}

.object-inspector-container {
  position: absolute;
  top: 80px;
  right: 20px;
  width: 300px;
  height: auto;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.tool-box-container {
  position: absolute;
  top: 80px;
  left: 30px;
  width: 300px;
  height: auto;
  max-height: 90%;
  overflow-x: hidden;
  overflow-y: auto;
}
.viewer {
  box-sizing: border-box;
  position: absolute;
  /* top: 30px;
  left: 30px;
  width: calc(100% - 30px);
  height: calc(100% - 30px);
  background-color: rgb(237, 237, 237); 
  */
  user-select: none;
  background-image: linear-gradient(90deg, rgba(140, 140, 140, 0.15) 10%, rgba(0, 0, 0, 0) 10%),
    linear-gradient(rgba(140, 140, 140, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
  background-size: 10px 10px;
}

.viewport {
  box-sizing: border-box;
  position: relative;
}

.viewport-area {
  background-color: lightyellow;
  border: 2px dashed #ccc;
  width: 600px;
}
.ruler {
  position: absolute !important;
  top: 0px;
  left: 0px;
  transform: translateZ(1px);
}

.ruler.ruler-horizontal {
  left: 30px !important;
  width: calc(100% - 30px) !important;
  height: 30px !important;
}

.ruler.ruler-vertical {
  top: 30px !important;
  height: calc(100% - 30px) !important;
  width: 30px !important;
}

.rulers-left-top-box {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 30px;
  height: 30px;
  background-color: #494949;
}

.toolbars-container {
  position: absolute;
  top: 40px;
  left: 40px;
  width: auto;
  height: auto;

  display: flex;
  align-items: center;
}

.toolbar-separator {
  width: 16px;
}
.toolbar-item-separator {
  width: 8px;
}

.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: auto;
  height: auto;
  background-color: #fefefe;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px #ccc;
  gap: 0px;
  user-select: none;
}

.toolbar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 32px;
  height: 32px;
  text-align: center;
  background-color: #fefefe;
  color: #676767;
  border: 0px;
}

.toolbar-item:disabled {
  color: #b5b5b5;
}

.toolbar-item:hover {
  background-color: #efefef;
}

.item {
  box-sizing: border-box;
  position: absolute;
  top: 0px;
  left: 0px;
  text-align: center;
  font-weight: normal;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0px;
  user-select: none;
  cursor: pointer;
}

.item.target {
  cursor: pointer;
}

.item.target.locked {
  border: 3px dotted red;
}

.item .decorator {
  position: absolute;
  border: 1px solid #4af;
  border-radius: 4px;
  background-color: #4af;
  color: white;
  text-align: center;
  font-weight: normal;
  line-height: 1;
}

.item .decorator-delete {
  top: 0px;
  right: -32px;
  width: 24px;
  height: 24px;
  font-size: 24px;
  cursor: pointer;
}

.item .decorator-locked {
  top: 0px;
  right: -20px;
  width: auto;
  height: auto;
  font-size: 16px;
  background: transparent;
  border: 0px;
  border-radius: 0px;
}

.item .decorator-size {
  position: absolute;
  bottom: -30px;
  left: 0px;
  width: auto;
  height: auto;
  font-size: 14px;
  padding: 4px 8px;
  white-space: nowrap;
}

.item.mouse-hover {
  border: 2px solid #4af;
}

.item {
  --handle-width: 10px;
  --handle-size: 7px;
  --handle-offset: -7px;
}
.item .connection-handle {
  position: absolute;
  border: 2px solid white;
  border-radius: 50%;
  width: var(--handle-width);
  height: var(--handle-width);
  background-color: red;
  color: white;
  text-align: center;
  font-weight: normal;
  line-height: 1;
}

.item .connection-handle:hover {
  background-color: #4af;
}

.item .connection-handle-left {
  left: var(--handle-offset);
  top: calc(50% - var(--handle-size));
}
.item .connection-handle-right {
  right: var(--handle-offset);
  top: calc(50% - var(--handle-size));
}
.item .connection-handle-top {
  top: var(--handle-offset);
  left: calc(50% - var(--handle-size));
}
.item .connection-handle-bottom {
  bottom: var(--handle-offset);
  left: calc(50% - var(--handle-size));
}
.item .connection-handle-center {
  top: calc(50% - var(--handle-size));
  left: calc(50% - var(--handle-size));
}

.object-inspector-moveable {
  border: 0px;
  outline: 0px;
}
</style>
