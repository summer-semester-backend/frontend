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
import Test from './diagram-editor/blocks/Test.vue';
export function setupPrototypeComponents(app: App) {
  app.component('Text', Text);
  app.component('Line', Line);
  app.component('Rectangle', Rectangle);
  app.component('Ellipse', Ellipse);
  app.component('Triangle', Triangle);
  app.component('Star', Star);
  app.component('Image', Image);
  app.component('Icon', Icon);
  app.component('Test', Test);
  app.component('Connection', Connection);
}
