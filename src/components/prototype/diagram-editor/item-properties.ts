import { InspectorTab, PropertyType } from '../inspector/types';
import { ObjectInspectorModel, ObjectProperty } from './../inspector/types';
import { ClipType, ConnectionStyle, ConnectionType, TextHAlign, TextVAlign } from './types';

export const separator$: ObjectProperty = { name: '' };

export const id$: ObjectProperty = {
  name: 'id',
  label: 'ID',
  type: PropertyType.TEXT,
  editorFullsize: true,
  readonly: true,
  formatValue: (obj, prop, value) => value + ' (' + obj.component + ')',
};
export const title$: ObjectProperty = { name: 'title', label: '文字', type: PropertyType.TEXT, editorFullsize: true };

export const fontSize$: ObjectProperty = {
  name: 'fontSize',
  label: '字号',
  type: PropertyType.RANGE,
  editorFullsize: true,
  editorOptions: { min: 4, max: 120, step: 1 },
};

export const textHAlign$: ObjectProperty = {
  name: 'textHAlign',
  label: '纵向对齐',
  type: PropertyType.ICON_LIST,
  editorOptions: {
    items: [
      { name: TextHAlign.LEFT, icon: 'format_align_left' },
      { name: TextHAlign.CENTER, icon: 'format_align_center' },
      { name: TextHAlign.RIGHT, icon: 'format_align_right' },
    ],
  },
};

export const textVAlign$: ObjectProperty = {
  name: 'textVAlign',
  label: '横向对齐',
  type: PropertyType.ICON_LIST,
  editorRightAlign: true,
  editorOptions: {
    items: [
      { name: TextVAlign.TOP, icon: 'vertical_align_top' },
      { name: TextVAlign.CENTER, icon: 'vertical_align_center' },
      { name: TextVAlign.BOTTOM, icon: 'vertical_align_bottom' },
    ],
  },
};

export const backColor$: ObjectProperty = { name: 'backgroundColor', label: '背景颜色', type: PropertyType.COLOR };
export const textColor$: ObjectProperty = {
  name: 'textColor',
  label: '文字颜色',
  type: PropertyType.COLOR,
  editorRightAlign: true,
};
export const shadow$: ObjectProperty = { name: 'shadow', label: '阴影', type: PropertyType.BOOLEAN };
export const locked$: ObjectProperty = { name: 'locked', label: '锁定', type: PropertyType.BOOLEAN };

export const x$: ObjectProperty = { name: 'x', label: 'X', type: PropertyType.NUMBER };
export const y$: ObjectProperty = { name: 'y', label: 'Y', type: PropertyType.NUMBER };
export const w$: ObjectProperty = { name: 'w', label: '宽度', type: PropertyType.NUMBER };
export const h$: ObjectProperty = { name: 'h', label: '高度', type: PropertyType.NUMBER };

export const rotate$: ObjectProperty = {
  name: 'r',
  label: '旋转',
  type: PropertyType.RANGE,
  editorFullsize: true,
  editorOptions: { min: -360, max: 360, step: 1 },
};
export const radius$: ObjectProperty = {
  name: 'borderRadius',
  label: '圆角半径',
  type: PropertyType.RANGE,
  editorFullsize: true,
  editorOptions: { min: 0, max: 100, step: 1 },
};
export const opacity$: ObjectProperty = {
  name: 'opacity',
  label: '透明度',
  type: PropertyType.RANGE,
  editorFullsize: true,
  editorOptions: { min: 0, max: 100, step: 1 },
};

export const borderSection$ = {
  // Border
  name: 'border',
  title: '边框',
  properties: [
    {
      name: 'border.width',
      label: '宽度',
      type: PropertyType.RANGE,
      editorFullsize: true,
      editorOptions: { min: 0, max: 50, step: 1 },
    },
    {
      name: 'border.style',
      label: '样式',
      type: PropertyType.ICON_LIST,
      editorFullsize: true,
      editorOptions: {
        items: [
          { name: ConnectionStyle.SOLID, text: '实线' },
          { name: ConnectionStyle.DASHED, text: '虚线' },
          { name: ConnectionStyle.DOTTED, text: '点线' },
        ],
      },
    },
    { name: 'border.color', label: '颜色', type: PropertyType.COLOR, editorFullsize: true },
    radius$,
  ],
};

export const borderWithoutRadiusSection$ = {
  // Border
  name: 'border',
  title: '边框',
  properties: [
    {
      name: 'border.width',
      label: '宽度',
      type: PropertyType.RANGE,
      editorFullsize: true,
      editorOptions: { min: 0, max: 50, step: 1 },
    },
    {
      name: 'border.style',
      label: '样式',
      type: PropertyType.ICON_LIST,
      editorFullsize: true,
      editorOptions: {
        items: [
          { name: ConnectionStyle.SOLID, text: '实线' },
          { name: ConnectionStyle.DASHED, text: '虚线' },
          { name: ConnectionStyle.DOTTED, text: '点线' },
        ],
      },
    },
    { name: 'border.color', label: '颜色', type: PropertyType.COLOR, editorFullsize: true },
  ],
};

const otherTab: InspectorTab = {
  title: '其他',
  sections: [
    {
      name: 'comp_info',
      title: '组件信息',
      properties: [
        id$,
        { name: 'component', label: '组件', type: PropertyType.TEXT, editorFullsize: true, readonly: true },
        separator$,
        {
          name: 'id',
          label: 'DEBUG',
          type: PropertyType.TEXT,
          editorFullsize: true,
          readonly: true,
          formatValue: (obj, prop, value) => '<pre>' + JSON.stringify(obj, null, 2) + '</pre>',
        },
      ], // props
    }, // section
  ], // sections
}; // tab

export const basicModel: ObjectInspectorModel = {
  tabs: [
    {
      title: '样式',
      sections: [
        {
          // Style
          name: 'style',
          title: '样式',
          properties: [backColor$, opacity$, locked$, shadow$],
        },
        borderWithoutRadiusSection$,
        {
          // Position & size
          name: 'pos_size',
          title: '位置与大小',
          properties: [x$, y$, w$, h$, separator$, rotate$],
        },
      ], // sections
    },
    otherTab,
  ],
};

export const shapeModel: ObjectInspectorModel = {
  tabs: [
    {
      title: '样式',
      sections: [
        {
          // Style
          name: 'style',
          title: '文本与样式',
          properties: [
            title$,
            fontSize$,
            textHAlign$,
            textVAlign$,
            separator$,
            backColor$,
            textColor$,
            opacity$,
            locked$,
            shadow$,
          ],
        },
        borderSection$,
        {
          // Position & size
          name: 'pos_size',
          title: '位置与大小',
          properties: [x$, y$, w$, h$, separator$, rotate$],
        },
      ], // sections
    },
    otherTab,
  ],
};

export const shapeWithoutRadiusModel: ObjectInspectorModel = {
  tabs: [
    {
      title: '样式',
      sections: [
        {
          // Style
          name: 'style',
          title: '文本与样式',
          properties: [
            title$,
            fontSize$,
            textHAlign$,
            textVAlign$,
            separator$,
            backColor$,
            textColor$,
            opacity$,
            locked$,
            shadow$,
          ],
        },
        borderWithoutRadiusSection$,
        {
          // Position & size
          name: 'pos_size',
          title: '位置与大小',
          properties: [x$, y$, w$, h$, separator$, rotate$],
        },
      ], // sections
    },
    otherTab,
  ],
};

export const imageModel: ObjectInspectorModel = {
  tabs: [
    {
      title: '样式',
      sections: [
        {
          // Style
          name: 'style',
          title: '来源于样式',
          properties: [
            { name: 'url', label: 'URL', type: PropertyType.TEXT, editorFullsize: true },
            separator$,
            {
              name: 'clipType',
              label: '剪裁',
              type: PropertyType.ICON_LIST,
              editorFullsize: true,
              editorOptions: {
                items: [
                  { name: ClipType.NONE, icon: 'image' },
                  { name: ClipType.RECT, icon: 'rectangle' },
                  { name: ClipType.POLYGON, icon: 'timeline' },
                  { name: ClipType.ELLIPSE, icon: 'circle' },
                ],
              },
            },
            {
              name: 'fit',
              label: '适应',
              type: PropertyType.ICON_LIST,
              editorFullsize: true,
              editorOptions: {
                items: [
                  { name: 'none', text: 'None' },
                  { name: 'contain', text: 'Contain' },
                  { name: 'cover', text: 'Cover' },
                  { name: 'fill', text: 'Fill' },
                ],
              },
            },
            {
              name: 'flip',
              label: '翻转',
              type: PropertyType.ICON_LIST,
              editorFullsize: true,
              editorOptions: {
                items: [
                  { name: 'none', text: 'None' },
                  { name: 'horizontal', text: 'Horizontal' },
                  { name: 'vertical', text: 'Vertical' },
                  { name: 'both', text: 'Both' },
                ],
              },
            },
            opacity$,
            locked$,
            shadow$,
          ],
        },
        borderSection$,
        {
          // Filters
          name: 'image_filters',
          title: '选项',
          properties: [
            { name: 'filtersEnabled', label: 'Enabled', type: PropertyType.BOOLEAN, editorFullsize: true },
            {
              name: 'filters.blur',
              label: '模糊',
              type: PropertyType.RANGE,
              editorFullsize: true,
              editorOptions: { min: 0, max: 10, step: 1 },
            },
            {
              name: 'filters.grayscale',
              label: '灰阶',
              type: PropertyType.RANGE,
              editorFullsize: true,
              editorOptions: { min: 0, max: 100, step: 1 },
            },
            {
              name: 'filters.brightness',
              label: '明暗',
              type: PropertyType.RANGE,
              editorFullsize: true,
              editorOptions: { min: 0, max: 200, step: 1 },
            },
            {
              name: 'filters.contrast',
              label: '对比度',
              type: PropertyType.RANGE,
              editorFullsize: true,
              editorOptions: { min: 0, max: 200, step: 1 },
            },
            {
              name: 'filters.invert',
              label: '反转',
              type: PropertyType.RANGE,
              editorFullsize: true,
              editorOptions: { min: 0, max: 100, step: 1 },
            },
            {
              name: 'filters.saturate',
              label: '饱和度',
              type: PropertyType.RANGE,
              editorFullsize: true,
              editorOptions: { min: 0, max: 200, step: 1 },
            },
            {
              name: 'filters.sepia',
              label: '黑色',
              type: PropertyType.RANGE,
              editorFullsize: true,
              editorOptions: { min: 0, max: 100, step: 1 },
            },
            {
              name: 'filters.hue',
              label: '色调',
              type: PropertyType.RANGE,
              editorFullsize: true,
              editorOptions: { min: 0, max: 359, step: 1 },
            },
          ],
        },
        {
          // Position & size
          name: 'pos_size',
          title: '位置与大小',
          properties: [x$, y$, w$, h$, separator$, rotate$],
        },
      ], // sections
    },
    otherTab,
  ],
};

export const textModel: ObjectInspectorModel = {
  tabs: [
    {
      title: '样式',
      sections: [
        {
          // Style
          name: 'style',
          title: '文字与样式',
          properties: [
            title$,
            fontSize$,
            textHAlign$,
            textVAlign$,
            separator$,
            backColor$,
            textColor$,
            opacity$,
            locked$,
            shadow$,
          ],
        },
        borderSection$,
        {
          // Position & size
          name: 'pos_size',
          title: '位置与大小',
          properties: [x$, y$, w$, h$, separator$, rotate$],
        },
      ], // sections
    },
    otherTab,
  ],
};

export const connectionModel: ObjectInspectorModel = {
  tabs: [
    {
      title: '样式',
      sections: [
        {
          // Style
          name: 'style',
          title: '样式',
          properties: [
            {
              name: 'type',
              label: '类型',
              type: PropertyType.ICON_LIST,
              editorFullsize: true,
              editorOptions: {
                items: [
                  { name: ConnectionType.LINE, icon: 'horizontal_rule' },
                  { name: ConnectionType.CURVE, icon: 'conversion_path' },
                ],
              },
            },
            {
              name: 'style',
              label: '样式',
              type: PropertyType.ICON_LIST,
              editorFullsize: true,
              editorOptions: {
                items: [
                  { name: ConnectionStyle.SOLID, text: '实线' },
                  { name: ConnectionStyle.DASHED, text: '虚线' },
                  { name: ConnectionStyle.DOTTED, text: '点线' },
                ],
              },
            },
            separator$,
            { name: 'backgroundColor', label: '颜色', type: PropertyType.COLOR },
            {
              name: 'thick',
              label: '粗细',
              type: PropertyType.RANGE,
              editorFullsize: true,
              editorOptions: { min: 1, max: 10, step: 1 },
            },
          ],
        },
      ], // sections
    }, // tab
  ], // tabs
};

export const lineModel: ObjectInspectorModel = {
  tabs: [
    {
      title: '样式',
      sections: [
        {
          // Style
          name: 'style',
          title: '样式',
          properties: [
            {
              name: 'thick',
              label: '粗细',
              type: PropertyType.RANGE,
              editorFullsize: true,
              editorOptions: { min: 1, max: 10, step: 1 },
            },
            {
              name: 'style',
              label: '样式',
              type: PropertyType.ICON_LIST,
              editorFullsize: true,
              editorOptions: {
                items: [
                  { name: ConnectionStyle.SOLID, text: '实线' },
                  { name: ConnectionStyle.DASHED, text: '虚线' },
                  { name: ConnectionStyle.DOTTED, text: '点线' },
                ],
              },
            },
            { name: 'backgroundColor', label: '颜色', type: PropertyType.COLOR },
          ],
        },
        {
          // Position & size
          name: 'pos_size',
          title: '位置与大小',
          properties: [x$, y$, w$, h$, rotate$],
        },
      ], // sections
    }, // tab
  ], // tabs
};

export const iconModel: ObjectInspectorModel = {
  tabs: [
    {
      title: '样式',
      sections: [
        {
          // Style
          name: 'style',
          title: '图标与样式',
          properties: [
            { name: 'title', label: '图标', type: PropertyType.TEXT, editorFullsize: true },
            {
              name: '_1',
              label: '',
              type: PropertyType.TEXT,
              editorFullsize: true,
              readonly: true,
              formatValue: (obj: any, prop: ObjectProperty, value: any) =>
                `<a href='https://fonts.google.com/icons?icon.set=Material+Icons&icon.style=Outlined' target='_blank' style='color: #4af;'>See available icons</a>`,
            },
            separator$,
            { name: 'textColor', label: '颜色', type: PropertyType.COLOR, editorRightAlign: true },
            opacity$,
            locked$,
            shadow$,
          ],
        },
        {
          // Position & size
          name: 'pos_size',
          title: '位置与大小',
          properties: [x$, y$, w$, h$, rotate$],
        },
      ], // sections
    }, // tab
  ], // tabs
};

export const inputModel: ObjectInspectorModel = {
  tabs: [
    {
      title: '样式',
      sections: [
        {
          name: 'properties',
          title: '属性',
          properties: [
            { name: 'disabled', label: '禁用', type: PropertyType.BOOLEAN, editorFullsize: true },
            { name: 'round', label: '圆角', type: PropertyType.BOOLEAN, editorFullsize: true },
            { name: 'value', label: '文字', type: PropertyType.TEXT, editorFullsize: true },
            { name: 'placeholder', label: '预留文字', type: PropertyType.TEXT, editorFullsize: true },
            {
              name: 'inputType',
              label: '输入类型',
              type: PropertyType.ICON_LIST,
              editorFullsize: true,
              editorOptions: {
                items: [
                  { name: 'text', text: 'text' },
                  { name: 'password', text: 'password' },
                  { name: 'textarea', text: 'textarea' },
                ],
              },
            },
            {
              name: 'status',
              label: '状态',
              type: PropertyType.ICON_LIST,
              editorFullsize: true,
              editorOptions: {
                items: [
                  { name: 'success', text: 'success' },
                  { name: 'warning', text: 'warning' },
                  { name: 'error', text: 'error' },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};
