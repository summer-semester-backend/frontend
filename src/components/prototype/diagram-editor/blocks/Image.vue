<template>
  <img
    class="image"
    :src="item.url === '' ? imagePlaceholder : item.url"
    :style="{
      color: item.textColor,
      border: item.border.width + 'px ' + item.border.style + ' ' + item.border.color,
      borderRadius: item.borderRadius + 'px',
      fontSize: item.fontSize + 'px',
      opacity: item.opacity / 100,
      objectFit: item.fit,
      boxShadow: item.shadow ? '3px 3px 5px #aaa' : 'none',
      filter: cssFilter,
      transform: cssTransform,
    }"
    @click.stop="handleLinkClick"
  />
</template>

<style scoped>
.image {
  width: 100%;
  height: 100%;
  max-width: 100%;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import imagePlaceholder from '../image-placeholder.png';
import { ImageItem } from '../types';

const props = defineProps<{ item: ImageItem }>();

const cssFilter = computed(() => {
  if (!props.item.filtersEnabled || !props.item.filters) return '';
  /*
        blur:       0px-10px,    default = 0,    step 1
        grayscale:  0% to 100%,  default = 0%,   step 1
        brightness: 0% to 200%,  default = 100%, step 1
        contrast:   0% to 200%,  default = 100%, step 1
        hue:        0  to 359,   default = 0,    step 1
        invert:     0% to 100%,  default = 0%,   step 1
        saturate:   0% to 200%,  default = 100%, step 1
        sepia:      0% to 100%,  default = 0%,   step 1
    */

  let f = '';
  if (props.item.filters.blur > 0) f += ` blur(${props.item.filters.blur}px)`;
  if (props.item.filters.grayscale > 0) f += ` grayscale(${props.item.filters.grayscale}%)`;
  if (props.item.filters.brightness !== 100) f += ` brightness(${props.item.filters.brightness}%)`;
  if (props.item.filters.contrast !== 100) f += ` contrast(${props.item.filters.contrast}%)`;
  if (props.item.filters.hue > 0) f += ` hue-rotate(${props.item.filters.hue}deg)`;
  if (props.item.filters.invert > 0) f += ` invert(${props.item.filters.invert}%)`;
  if (props.item.filters.saturate != 100) f += ` saturate(${props.item.filters.saturate}%)`;
  if (props.item.filters.sepia > 0) f += ` sepia(${props.item.filters.sepia}%)`;

  return f;
});

const cssTransform = computed(() => {
  if (props.item.flip === 'horizontal') return 'scaleX(-1)';
  if (props.item.flip === 'vertical') return 'scaleY(-1)';
  if (props.item.flip === 'both') return 'scale(-1, -1)';

  return '';
});
interface LinkClickEvents {
  (e: 'link-to-click', itemID: string): void;
}
const emits = defineEmits<LinkClickEvents>();
const handleLinkClick = () => {
  if (props.item.connection != undefined) {
    emits('link-to-click', props.item.connection.to.item);
  }
};
</script>
