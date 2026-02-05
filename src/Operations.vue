<script setup lang="ts">
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Anchor from '@/Anchor.vue'
import PublicHelloWorld from '@/PublicHelloWorld.vue'
import OrganizationsList from '@/OrganizationsList.vue'
import OrganizationTokens from '@/OrganizationTokens.vue'
</script>

<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0">Hello World</Tab>
      <Tab value="2">Organizations</Tab>
      <Tab value="3">Organization Tokens</Tab>
      <Tab value="1">Anchor</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <PublicHelloWorld />
      </TabPanel>
      <TabPanel value="1">
        <Anchor />
      </TabPanel>
      <TabPanel value="2">
        <OrganizationsList />
      </TabPanel>
      <TabPanel value="3">
        <OrganizationTokens />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<style scoped></style>
