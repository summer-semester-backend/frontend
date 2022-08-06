import type { App } from 'vue';
import Connection from './diagram-editor/blocks/Connection.vue';
import Ellipse from './diagram-editor/blocks/Ellipse.vue';
import Icon from './diagram-editor/blocks/Icon.vue';
import Image from './diagram-editor/blocks/Image.vue';
import Line from './diagram-editor/blocks/Line.vue';
import Rectangle from './diagram-editor/blocks/Rectangle.vue';
import Star from './diagram-editor/blocks/Star.vue';
import Text from './diagram-editor/blocks/Text.vue';
import Triangle from './diagram-editor/blocks/Triangle.vue';
// Custom
import Input from './diagram-editor/blocks/Input.vue';
import Radio from './diagram-editor/blocks/Radio.vue';
import Button from './diagram-editor/blocks/Button.vue';
import Page from './diagram-editor/blocks/Page.vue';
export function setupPrototypeComponents(app: App) {
  app.component('Text', Text);
  app.component('Line', Line);
  app.component('Rectangle', Rectangle);
  app.component('Ellipse', Ellipse);
  app.component('Triangle', Triangle);
  app.component('Star', Star);
  app.component('Image', Image);
  app.component('Icon', Icon);
  app.component('Input', Input);
  app.component('Radio', Radio);
  app.component('Button', Button);
  app.component('Page', Page);
  app.component('Connection', Connection);
}
