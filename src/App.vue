<script setup lang="ts">
import FeatureDeskJsonRpc from '@/FeatureDeskJsonRpc.vue'
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Carmentis Demo</h1>
    </div>

    <FeatureDeskJsonRpc/>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.config-card {
  margin-bottom: 2rem;
}

.message {
  margin-bottom: 1.5rem;
}

.spacer {
  height: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.input-field {
  width: 100%;
}
</style>
