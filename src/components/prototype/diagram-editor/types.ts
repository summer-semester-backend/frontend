import { Component } from 'vue';

export interface Position {
  x: number; // X Coordinate
  y: number; // Y Coordinate
}

export interface Rect extends Position {
  w: number; // Width
  h: number; // Height
}

export interface Frame extends Rect {
  z: number; // Z-Index
  r: number; // Rotation angle
  borderRadius: number; // Border radius
  opacity: number; // Opacity (0=full transparent, 100=full opaque). Default = 100

  clipType: ClipType; // Frame clip type
  clipStyle: string; // Frame clip path
}

export interface DiagramElement {
  id: string; // The unique element ID
  title: string; // The element title / label
  z: number; // The element z-index
  isPage: boolean; // whether used as page
  yOffset: number;

  backgroundColor: string; // The element background color (item background, connection stroke color)
  textColor: string; // The element text color (text inside the element, etc.)
  opacity: number; // Opacity (0=full transparent, 100=full opaque). Default = 100

  fontWeight: number; // text font weight
  fontSize: number; // The element text font size
  shadow: boolean; // Show/hide element shadow

  component: string; // The Vue component used to render this element
  componentOptions?: any; // The Vue component options / config
}

export interface Item extends DiagramElement {
  x: number; // X coordinate (in px)
  y: number; // Y coordinate (in px)
  w: number; // Width (in px)
  h: number; // Height (in px)
  r: number; // Rotation angle (in degrees)

  borderRadius: number; // border radius (in px)
  clipType: ClipType; // The item clip type (rect or ellipse)
  clipStyle: string; // Item clipping path

  supportsRoundable: boolean; // The item can be rounded (user can change border radius)
  supportsResizable: boolean; // The item can be resized (user can change width / height)

  locked: boolean; // The item is locked (cannot be moved / resized / rotated / ...)

  textHAlign: TextHAlign;
  textVAlign: TextVAlign;

  border: ItemBorder;
  connection?: ItemConnection;
}

export enum TextHAlign {
  LEFT = 'flex-start',
  CENTER = 'center',
  RIGHT = 'flex-end',
}

export enum TextVAlign {
  TOP = 'flex-start',
  CENTER = 'center',
  BOTTOM = 'flex-end',
}

export enum ClipType {
  NONE = 'none',
  RECT = 'rect',
  POLYGON = 'polygon',
  ELLIPSE = 'ellipse',
}
export interface ItemBorder {
  width: number;
  style: ConnectionStyle;
  color: string;
}

export interface ConnectionPoint {
  item: string; // The item ID which this connection point is referring to
  handle: ConnectionHandle; // The handle this point is connected to
  marker: ConnectionMarker; // The marker used by this connection point
}

export interface ItemConnection extends DiagramElement {
  from: ConnectionPoint; // The connection starting point
  to: ConnectionPoint; // The connection ending point

  type: ConnectionType; // The connection type (line, curve, ...)
  style: ConnectionStyle; // The connection style (solid, dashed, ...)

  thick: number; // The connection thickness (in px)
}

export enum ConnectionHandle {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export enum ConnectionMarker {
  NONE = 'none',
  CIRCLE = 'circle',
  SQUARE = 'square',
  ARROW = 'arrow',
}

export enum ConnectionType {
  LINE = 'line',
  CURVE = 'curve',
}

export enum ConnectionStyle {
  SOLID = 'solid',
  DASHED = 'dashed',
  DOTTED = 'dotted',
}

export enum EditorTool {
  SELECT = 'select',
  TEXT = 'text',
  IMAGE = 'image',
  LINE = 'line',
  RECTANGLE = 'rectangle',
  TRIANGLE = 'triangle',
  ELLIPSE = 'ellipse',
  STAR = 'star',
  WIDGET = 'widget',
  ICON = 'icon',
  CONNECTION = 'connection',
  // Custom
  INPUT = 'input',
  RADIO = 'radio',
  BUTTON = 'button',

  // Container
  PAGE = 'page',
}

export enum ToolBoxGroup {
  TOOL = 'tool',
  SHAPE = 'shape',
  ICON = 'icon',
  CONTAINER = 'container',
  BASIC = 'basic',
}

export interface ToolDefinition {
  type: EditorTool | 'separator';
  title: string;
  icon?: string;
  iconComponent?: Component;
  group: ToolBoxGroup;
  itemType?: string;
}

import {
  Text,
  Image,
  RemoveOutline,
  RadioButtonOffOutline,
  TabletLandscapeOutline,
  TriangleOutline,
  StarOutline,
  CreateOutline,
  RadioButtonOnOutline,
} from '@vicons/ionicons5';
import { PushOutline } from '@vicons/ionicons5';

export const toolDefinitions: ToolDefinition[] = [
  { type: EditorTool.SELECT, title: '??????', group: ToolBoxGroup.TOOL, icon: 'ads_click' },
  { type: EditorTool.CONNECTION, title: '??????', group: ToolBoxGroup.TOOL, icon: 'link', itemType: 'Connection' },
  {
    type: EditorTool.TEXT,
    title: '??????',
    group: ToolBoxGroup.BASIC,
    icon: 'text_fields',
    itemType: 'Text',
    iconComponent: Text,
  },
  {
    type: EditorTool.IMAGE,
    title: '??????',
    group: ToolBoxGroup.BASIC,
    icon: 'image',
    itemType: 'Image',
    iconComponent: Image,
  },
  {
    type: EditorTool.INPUT,
    title: '??????',
    group: ToolBoxGroup.BASIC,
    icon: 'input',
    itemType: 'Input',
    iconComponent: CreateOutline,
  },
  {
    type: EditorTool.RADIO,
    title: '?????????',
    group: ToolBoxGroup.BASIC,
    icon: 'radio',
    itemType: 'Radio',
    iconComponent: RadioButtonOnOutline,
  },
  {
    type: EditorTool.BUTTON,
    title: '??????',
    group: ToolBoxGroup.BASIC,
    icon: 'radio_button_checked',
    itemType: 'Button',
    iconComponent: PushOutline,
  },
  {
    type: EditorTool.LINE,
    title: '??????',
    group: ToolBoxGroup.SHAPE,
    icon: 'horizontal_rule',
    itemType: 'Line',
    iconComponent: RemoveOutline,
  },
  {
    type: EditorTool.RECTANGLE,
    title: '??????',
    group: ToolBoxGroup.SHAPE,
    icon: 'rectangle',
    itemType: 'Rectangle',
    iconComponent: TabletLandscapeOutline,
  },
  {
    type: EditorTool.ELLIPSE,
    title: '??????',
    group: ToolBoxGroup.SHAPE,
    icon: 'circle',
    itemType: 'Ellipse',
    iconComponent: RadioButtonOffOutline,
  },
  {
    type: EditorTool.TRIANGLE,
    title: '?????????',
    group: ToolBoxGroup.SHAPE,
    icon: 'change_history',
    itemType: 'Triangle',
    iconComponent: TriangleOutline,
  },
  {
    type: EditorTool.STAR,
    title: '?????????',
    group: ToolBoxGroup.SHAPE,
    icon: 'grade',
    itemType: 'Star',
    iconComponent: StarOutline,
  },
  // Icon
  { type: EditorTool.ICON, title: '??????', group: ToolBoxGroup.ICON, icon: 'portrait', itemType: 'Icon' },
  // Page
  { type: EditorTool.PAGE, title: '??????', group: ToolBoxGroup.CONTAINER, icon: 'rectangle', itemType: 'Page' },
  // { type: EditorTool.WIDGET, title: 'Widgets', group: ToolBoxGroup.CONTAINER, icon: 'view_in_ar' },
];

export function getToolDefinition(toolType: EditorTool): ToolDefinition {
  const t = toolDefinitions.find((t) => t.type === toolType);
  if (!t) throw new Error('Invalid tool type: ' + toolType);
  return t;
}

export function isItem(e: DiagramElement | undefined | null): e is Item {
  return e !== null && e != undefined && 'x' in e;
}

export function isPage(e: DiagramElement | undefined | null): e is Item {
  return e?.isPage == true;
}

export function isConnection(e: DiagramElement | undefined | null): e is ItemConnection {
  return e !== null && e != undefined && 'from' in e;
}

export interface LineItem extends Item {
  thick: number;
  style: ConnectionStyle;
}

// export interface TestItem extends Item {
//   thick: number;
//   style: ConnectionStyle;
// }

export interface ImageItem extends Item {
  url: string;
  fit: 'contain' | 'cover' | 'fill' | 'none';

  flip: 'none' | 'horizontal' | 'vertical' | 'both';

  filtersEnabled: boolean;
  filters?: {
    blur: number; // 0px-10px,    default = 0,    step 1
    grayscale: number; // 0% to 100%,  default = 0%,   step 1
    brightness: number; // 0% to 200%,  default = 100%, step 1
    contrast: number; // 0% to 200%,  default = 100%, step 1
    hue: number; // 0 to 360,    default = 0,    step 1
    invert: number; // 0% to 100%,  default = 0%,   step 1
    saturate: number; // 0% to 200%,  default = 0%,   step 1
    sepia: number; // 0% to 100%,  default = 0%,   step 1
  };
}

export interface WidgetDefinition {
  type: string; // The widget type. Example: 'my_shape
  label: string; // The widget label. Example: 'My Shape'
  descr: string; // The widget description. Example: 'A shape with rounded borders'
  thumbnail: string; // The widget thumbnail. Example: 'my_shape.png'

  component: string; // The Vue component used to render this widget
  componentOptions?: any; // The default Vue component options used to instantiate this widget

  canBeResized?: boolean; // Is the widget resizable? Default: true
}

export interface InputItem extends Item {
  inputType: 'text' | 'password' | 'textarea';
  placeholder: string;
  disabled: boolean;
  round: boolean;
  status: 'success' | 'warning' | 'error' | undefined;
  value: string;
}

export interface ButtonItem extends Item {
  value: string;
  isPrimary: boolean;
  bordered: boolean;
  circle: boolean;
  useColor: boolean;
  color: string;
}

export interface RadioItem extends Item {
  checked: boolean;
  disabled: boolean;
  value: string;
}

export interface PageItem extends Item {
  containedIDs: Array<string>;
  pageName: string;
}
