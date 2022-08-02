<template>
  <div>
    <div id="workstage"></div>
  </div>
  <n-button @click="addStar()">添加</n-button>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Konva from 'konva';
const workstage = ref(null);
var width = window.innerWidth;
var height = window.innerHeight;

var tween: Konva.Tween;
var stage: Konva.Stage;

var layer = new Konva.Layer();
var dragLayer = new Konva.Layer();
function addStar() {
  var scale = Math.random();

  var star = new Konva.Star({
    x: Math.random() * stage.width(),
    y: Math.random() * stage.height(),
    numPoints: 5,
    innerRadius: 30,
    outerRadius: 50,
    fill: '#89b717',
    opacity: 0.8,
    draggable: true,
    scale: {
      x: scale,
      y: scale,
    },
    rotation: Math.random() * 180,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: {
      x: 5,
      y: 5,
    },
    shadowOpacity: 0.6,
    startScale: scale,
  });

  layer.add(star);
}

onMounted(() => {
  stage = new Konva.Stage({
    container: 'workstage',
    width: width,
    height: height,
  });
  for (var n = 0; n < 40; n++) {
    addStar();
  }

  stage.add(layer);
  stage.add(dragLayer);

  // bind stage handlers
  stage.on('mousedown', function (evt) {
    var shape = evt.target;
    shape.moveTo(dragLayer);
    // restart drag and drop in the new layer
    shape.startDrag();
  });

  stage.on('mouseup', function (evt) {
    var shape = evt.target;
    shape.moveTo(layer);
  });

  stage.on('dragstart', function (evt) {
    var shape = evt.target;
    if (tween) {
      tween.pause();
    }
    shape.setAttrs({
      shadowOffset: {
        x: 15,
        y: 15,
      },
      scale: {
        x: shape.getAttr('startScale') * 1.2,
        y: shape.getAttr('startScale') * 1.2,
      },
    });
  });

  stage.on('dragend', function (evt) {
    var shape = evt.target;

    tween = new Konva.Tween({
      node: shape,
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: shape.getAttr('startScale'),
      scaleY: shape.getAttr('startScale'),
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    });

    tween.play();
  });
});
</script>
