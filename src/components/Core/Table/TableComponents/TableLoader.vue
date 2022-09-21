<template>
  <div class="table-loader maz-p-2 maz-flex maz-justify-center maz-align-end">
    <div class="maz-flex maz-direction-column maz-align-center maz-justify-center">
      <CoreSpinner
        class="maz-mb-2"
        :size="50"
      />
    </div>
  </div>
</template>

<script>
  import CoreSpinner from '@/components/Core/CoreSpinner.vue'

  export default {
    name: 'TableLoader',
    components: {CoreSpinner}
  }
</script>

<style lang="scss" scoped>
  .table-loader {
    /*background-color: rgba(0, 0, 0, 0.1);*/
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
</style>
