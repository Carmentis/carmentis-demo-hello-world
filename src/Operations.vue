<script setup lang="ts">
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Anchor from '@/Anchor.vue'
import PublicHelloWorld from '@/PublicHelloWorld.vue'
import FeatureAuthentication from '@/FeatureAuthentication.vue'
import FeatureDeskAnchor from '@/FeatureDeskAnchor.vue'
import FeatureDeskJsonRpc from '@/FeatureDeskJsonRpc.vue'
</script>

<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0">Hello World</Tab>
      <Tab value="2">Desk Authentiaction</Tab>
      <Tab value="3">Desk Anchor</Tab>
      <Tab value="1">Operator Anchor</Tab>
      <Tab value="4">Desk JSON-RPC</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <PublicHelloWorld />
      </TabPanel>
      <TabPanel value="1">
        <Anchor />
      </TabPanel>
      <TabPanel value="2">
        <FeatureAuthentication />
      </TabPanel>
      <TabPanel value="3">
        <FeatureDeskAnchor />
      </TabPanel>
      <TabPanel value="4">
        <FeatureDeskJsonRpc />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<style scoped></style>
