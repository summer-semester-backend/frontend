<template>
  <i v-html="iconSvg(props.name)" :class="`size-${props.size} ${props.iconClass}`" />
</template>

<script setup="js">
import feather from 'feather-icons';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Object,
    default: 16,
  },
  iconClass: {
    type: String,
    default: '',
  },
});

const iconSvg = (icon) => {
  return feather.icons[icon].toSvg();
};
</script>
