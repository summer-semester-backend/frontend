import {
  connectionModel,
  iconModel,
  imageModel,
  lineModel,
  shapeModel,
  shapeWithoutRadiusModel,
  textModel,
  inputModel,
  radioModel,
  buttonModel,
  pageModel,
} from './item-properties';
import {
  ClipType,
  ConnectionHandle,
  ConnectionMarker,
  ConnectionStyle,
  ConnectionType,
  ImageItem,
  Item,
  ItemConnection,
  LineItem,
  RadioItem,
  // TestItem,
  Position,
  TextHAlign,
  TextVAlign,
  PageItem,
} from './types';

import { StyleValue } from 'vue';
import { ObjectInspectorModel } from '../inspector/types';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Return an unique ID (use current time + random number)
 */
export function getUniqueId(prefix: string = 'id_'): string {
  const base = 36;
  return prefix + Date.now().toString(base) + '_' + randomInt(1, 100000).toString(base);
}

/**
 * Return a random number between min and max (included)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getItemStyle(item: Item): StyleValue {
  let t = `translate(${item.x}px, ${item.y}px)`;
  if (item.r !== 0) t += ` rotate(${item.r}deg)`;

  const style: StyleValue = {
    width: item.w + 'px',
    height: item.h + 'px',
    zIndex: item.z,
    backgroundColor: item.component ? 'transparent' : item.backgroundColor,
    transform: t,
  };

  if (item.clipType !== ClipType.NONE) {
    item.clipType === ClipType.RECT ? (style.clip = item.clipStyle) : (style.clipPath = item.clipStyle);
  } else {
    item.clipStyle = '';
    style.clip = 'none';
    style.clipPath = 'none';
  }

  return style;
}

export function getItemById(items: Item[], id: string): Item | undefined {
  return items.find((n) => n.id == id);
}

export function createPageItem(): PageItem {
  return {
    ...createItem({
      id: 'id_page0',
      isPage: true,
      x: 200,
      y: 200,
      w: 1080,
      h: 720,
      z: -10000,
    }),
    title: 'page',
    component: 'Page',
    containedIDs: [],
    pageName: '??????',
  };
}

export function createItem(item?: DeepPartial<Item>): Item {
  return {
    id: getUniqueId(),
    isPage: false,
    title: 'Item',
    component: 'Rectangle',

    x: randomInt(200, 500),
    y: randomInt(100, 300),
    w: randomInt(100, 500),
    h: randomInt(50, 300),
    z: 0,
    r: 0,

    borderRadius: 0,
    opacity: 100,

    clipType: ClipType.NONE,
    clipStyle: '',

    supportsRoundable: true,
    supportsResizable: true,
    supportsClippable: false,

    backgroundColor: 'white',
    textColor: 'black',
    fontSize: 14,

    textHAlign: TextHAlign.CENTER,
    textVAlign: TextVAlign.CENTER,

    border: {
      width: 0,
      style: ConnectionStyle.SOLID,
      color: 'black',
    },

    shadow: false,
    locked: false,

    ...item,
  } as Item;
}

export function createConnection(fromID: string, toID: string, c?: DeepPartial<ItemConnection>): ItemConnection {
  return {
    id: getUniqueId(),
    isPage: false,
    component: 'Connection',

    from: {
      item: fromID,
      handle: c?.from?.handle || ConnectionHandle.CENTER,
      marker: c?.from?.marker || ConnectionMarker.NONE,
    },

    to: {
      item: toID,
      handle: c?.to?.handle || ConnectionHandle.CENTER,
      marker: c?.to?.marker || ConnectionMarker.NONE,
    },

    type: c?.type || ConnectionType.CURVE,
    style: c?.style || ConnectionStyle.DASHED,
    thick: c?.thick || 3,

    backgroundColor: c?.backgroundColor || '#18181c',
  } as ItemConnection;
}

export function deleteItemInArray(items: any[], item: any) {
  items.splice(items.indexOf(item), 1);
}

export function findMinZ(items: Item[]): number {
  let min = items[0].z;
  for (let v of items) if (v.z < min) min = v.z;
  return min;
}

export function findMaxZ(items: Item[]): number {
  let max = items[0].z;
  for (let v of items) if (v.z > max) max = v.z;
  return max;
}

// Shape medata definitions
const registry: Record<string, [Item, ObjectInspectorModel]> = {};

export function registerItemType<T extends Item>(item: T, model: ObjectInspectorModel) {
  registry[item.component] = [item, model];
}

export function getItemBlueprint(type: string): [Item, ObjectInspectorModel] {
  if (!registry[type]) throw new Error('No item type registered with name: ' + type);
  return registry[type];
}

let alreadyRegistered = false;
export function registerDefaultItemTypes() {
  if (alreadyRegistered) return; // Already registered?

  alreadyRegistered = true;

  const defaults = {
    id: '',
    title: '',
    isPage: false,
    yOffset: 0,

    x: 100,
    y: 100,
    w: 200,
    h: 50,
    z: 0,
    r: 0,
    borderRadius: 0,
    opacity: 100,

    clipType: ClipType.NONE,
    clipStyle: '',

    supportsRoundable: false,
    supportsResizable: true,

    backgroundColor: 'white',
    textColor: 'black',
    fontSize: 14,
    fontWeight: 400,

    locked: false,

    textHAlign: TextHAlign.CENTER,
    textVAlign: TextVAlign.CENTER,

    border: {
      width: 1,
      style: ConnectionStyle.SOLID,
      color: 'gray',
    },

    shadow: false,
  };

  // ----------------------------------------------------------------------
  let type = 'Connection';
  registerItemType(
    {
      ...defaults,
      component: type,
    },
    connectionModel
  );

  // ----------------------------------------------------------------------
  type = 'Text';
  registerItemType(
    {
      ...defaults,
      title: 'Hello World',
      yOffset: 0,
      backgroundColor: 'transparent',
      textColor: 'black',

      component: type,
      border: {
        width: 1,
        style: ConnectionStyle.SOLID,
        color: 'black',
      },
    },
    textModel
  );

  // ----------------------------------------------------------------------
  type = 'Line';
  registerItemType<LineItem>(
    {
      ...defaults,
      component: type,
      style: ConnectionStyle.SOLID,
      thick: 3,
      backgroundColor: 'gray',
    },
    lineModel
  );

  // ----------------------------------------------------------------------
  type = 'Test';
  registerItemType(
    {
      ...defaults,
      component: type,
      supportsRoundable: true,
    },
    shapeModel
  );

  // ----------------------------------------------------------------------
  type = 'Rectangle';
  registerItemType(
    {
      ...defaults,
      component: type,
      w: 200,
      h: 150,
      supportsRoundable: true,
    },
    shapeModel
  );

  // ----------------------------------------------------------------------
  type = 'Ellipse';
  registerItemType(
    {
      ...defaults,
      component: type,
      w: 90,
      h: 70,
    },
    shapeWithoutRadiusModel
  );

  // ----------------------------------------------------------------------
  type = 'Triangle';
  registerItemType(
    {
      ...defaults,
      component: type,

      w: 90,
      h: 70,
    },
    shapeWithoutRadiusModel
  );

  // ----------------------------------------------------------------------
  type = 'Star';
  registerItemType(
    {
      ...defaults,
      component: type,

      w: 70,
      h: 70,
    },
    shapeWithoutRadiusModel
  );

  // ----------------------------------------------------------------------
  type = 'Image';
  registerItemType<ImageItem>(
    {
      ...defaults,
      w: 220,
      h: 150,
      component: type,
      supportsRoundable: true,

      url: '', // 'https://images.unsplash.com/photo-1540390769625-2fc3f8b1d50c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1228&q=80',        // 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      fit: 'cover',

      flip: 'none',

      filtersEnabled: false,
      filters: {
        brightness: 100,
        contrast: 100,
        saturate: 100,
        grayscale: 0,
        hue: 0,
        invert: 0,
        sepia: 0,
        blur: 0,
      },
    },
    imageModel
  );

  // ----------------------------------------------------------------------
  type = 'Icon';
  registerItemType(
    {
      ...defaults,

      component: type,
      title: 'portrait', // icon name
      supportsRoundable: true,
      yOffset: 15,

      backgroundColor: 'transparent',
      fontSize: 60,
      w: 60,
      h: 60,
    },
    iconModel
  );

  // ----------------------------------------------------------------------
  type = 'Input';
  registerItemType(
    {
      ...defaults,

      component: type,
      title: 'input',
      supportsRoundable: true,

      placeholder: '???????????????',
      disabled: false,
      round: false,
      size: 'medium',
      status: 'success',
      value: '',
    },
    inputModel
  );

  type = 'Radio';
  registerItemType(
    {
      ...defaults,
      component: type,
      title: 'radio',
      supportsRoundable: true,

      checked: false,
      disabled: false,
      value: '?????????',
      w: 150,
      h: 30,
    },
    radioModel
  );
  // ----------------------------------------------------------------------
  type = 'Button';
  registerItemType(
    {
      ...defaults,

      component: type,
      title: 'button',
      supportsRoundable: true,
      value: '??????',
      bordered: true,
      circle: false,
      isPrimary: true,
      color: '#40a9ff',
    },
    buttonModel
  );

  type = 'Page';
  registerItemType(
    {
      ...defaults,
      z: -10000,
      component: type,
      isPage: true,
      title: 'page',
      w: 1080,
      h: 720,
      containedIDs: [],
      border: {
        width: 0,
        style: ConnectionStyle.SOLID,
        color: 'black',
      },
    },
    pageModel
  );
} // func

export function getHandlePosition(item: Item, cp: ConnectionHandle): Position {
  // If item is rotated always use the center handle
  if (item.r !== 0) return { x: item.x + item.w / 2, y: item.y + item.h / 2 };

  if (cp === ConnectionHandle.LEFT) return { x: item.x, y: item.y + item.h / 2 };
  else if (cp === ConnectionHandle.RIGHT) return { x: item.x + item.w, y: item.y + item.h / 2 };
  else if (cp === ConnectionHandle.TOP) return { x: item.x + item.w / 2, y: item.y };
  else if (cp === ConnectionHandle.BOTTOM) return { x: item.x + item.w / 2, y: item.y + item.h };
  /*  ConnectionHandle.CENTER */ else return { x: item.x + item.w / 2, y: item.y + item.h / 2 };
}
