<template>
  <div v-html="content"> </div>
</template>

<script>
export default {
  name: 'AnnouncementContainer',
  data() {
    return {
      done: false,
    };
  },
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  methods: {
    startBouncing() {
      const box = document.getElementById('bouncing-box');
      if (!box) return;
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const boxWidth = box.offsetWidth;
      const boxHeight = box.offsetHeight;

      let currentTop = Math.random() * (containerHeight - boxHeight);
      let currentLeft = Math.random() * (containerWidth - boxWidth);
      let directionX = 1;
      let directionY = 1;

      let me = this;

      function moveBox() {
        currentTop += 2.5 * directionY;
        currentLeft += 2.5 * directionX;

        if (currentTop >= containerHeight - boxHeight || currentTop <= 0) {
          directionY *= -1;
        }

        if (currentLeft >= containerWidth - boxWidth || currentLeft <= 0) {
          directionX *= -1;
        }

        box.style.top = currentTop + 'px';
        box.style.left = currentLeft + 'px';

        if (!me.done)
          requestAnimationFrame(moveBox);
      }

      requestAnimationFrame(moveBox);
    },
  },
  mounted() {
    this.startBouncing();
  },
  watch: {
    content(newVal, oldVal) {
      setTimeout(() => {
        this.startBouncing();
      }, 1000);
    },
  },
  beforeUnmount() {
    this.done = true;
  },
}
</script>
