<template>
  <div style="padding: 2rem;" class="row q-col-gutter-md">
    <div class="col-3">
      <QuickAccessPanel />
    </div>
    <div class="col-9">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          align="left"
          class="bg-primary text-white shadow-2"
          :breakpoint="0"
        >
          <q-tab name="overview" label="Overviews" icon="insert_chart" />
          <q-tab name="pivot" label="Pivot Tables" icon="table_chart" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="overview">
            <Overview />
          </q-tab-panel>

          <q-tab-panel name="pivot">
            <PivotTable />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import QuickAccessPanel from "../components/Cards/QuickAccessPanel.vue";
  import PivotTable from "../components/Cards/PivotTable.vue";
  import Overview from "../components/Cards/Overview.vue";

  const tab = ref("overview")

</script>

<style lang="scss" scoped>

</style>
