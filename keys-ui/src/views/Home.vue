<template>
  <div class="home">
    <div v-if="loaded">
      <table class="feature-flag-table">
        <tr>
          <th></th>
          <th class="text-left">Feature Flag</th>
          <th class="text-right">Enabled</th>
        </tr>
        <tr
          v-for="fkey in filteredKeys"
          :key="fkey.name"
          :class="{ green: fkey.overridden }"
        >
          <td>
            <button
              @click.prevent="deleteOverride(fkey.name)"
              :disabled="!fkey.overridden"
              title="Delete override"
            >
              -
            </button>
          </td>
          <td class="text-left">
            <label :for="fkey.name">{{ fkey.name }}</label>
          </td>
          <td class="text-right">
            <input
              type="checkbox"
              :id="fkey.name"
              v-model="updatedKeys[fkey.name]"
            />
          </td>
        </tr>
        <tr>
          <td></td>
          <td class="text-right">
            <button @click.prevent="save">Save</button>
          </td>
          <td class="text-right">
            <button @click.prevent="reset">Reset</button>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>Loading</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import api from "../api/api";
import cloneDeep from "lodash/cloneDeep";
import some from "lodash/some";
export default Vue.extend({
  data: () => ({
    loaded: false,
    overrides: [],
    keys: {} as any,
    updatedKeys: {} as any
  }),
  computed: {
    filteredKeys(): any[] {
      return (
        Object.keys(this.keys)
          .filter(val => val.indexOf("jcr:") !== 0)
          .sort()
          .map(val => ({
            name: val,
            overridden: some(this.overrides, { name: val })
          })) || []
      );
    },
    changes(): any[] {
      return this.filteredKeys
        .filter(
          (val: any) => this.updatedKeys[val.name] !== this.keys[val.name]
        )
        .map((val: any) => ({
          name: val.name,
          value: this.updatedKeys[val.name]
        }));
    }
  },
  methods: {
    reset() {
      this.updatedKeys = cloneDeep(this.keys);
    },
    async save() {
      if (this.changes.length > 0) {
        await Promise.all(
          this.changes.map(val =>
            api.post(`/${val.name}`, { value: val.value })
          )
        );
        await this.init();
      }
    },
    async deleteOverride(name: string) {
      await api.delete(`/${name}`);
      await this.init();
    },
    async init() {
      this.loaded = false;
      await Vue.nextTick();
      const promises = [];
      promises.push(
        api.get("/overrides").then(response => {
          this.overrides = response.data;
        })
      );
      promises.push(
        api.get("/").then(response => {
          this.keys = response.data;
          this.updatedKeys = cloneDeep(this.keys);
        })
      );
      await Promise.all(promises);
      this.loaded = true;
      await Vue.nextTick();
    }
  },
  mounted() {
    this.init();
    document.title = 'Feature Flags';
  }
});
</script>

<style lang="scss">
.feature-flag-table {
  margin: 0 auto;
  width: 600px;
  max-width: 80vw;
  padding-top: 20px;
  padding-bottom: 20px;
  border-collapse: collapse;
  font-size: 13px;
  tr {
    border-bottom: 1px solid lightgray;
    height: 40px;
  }
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.green {
  background-color: lightgreen;
}
</style>
