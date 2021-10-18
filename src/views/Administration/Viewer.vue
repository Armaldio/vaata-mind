<template>
  <v-container
    class="py-8 px-6"
    fluid
  >
    <v-row>
      <v-col
        cols="12"
      >
        <v-card>
          <v-subheader>{{ name }}</v-subheader>
          <v-card-text>
            <VueNotionRender v-if="blockMap" :unofficial="false" :data="blockMap"></VueNotionRender>
            <!-- <NotionRenderer v-if="blockMap" :blockMaps="blockMap" ></NotionRenderer> -->
            <div v-else>
              No data
            </div>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import VueNotionRender from 'vue-notion-render';

export default Vue.extend({
  name: 'Element',

  components: {
    VueNotionRender,
  },

  props: {
    task: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      blockMap: null as null | any,
      name: '',
    };
  },

  beforeRouteUpdate(to: any, from: any, next: any) {
    if (this.task) {
      return;
    }

    const { element } = this.$route.params;
    const { elements } = this.$accessor;

    this.blockMap = elements.find((el) => el.id === element)?.content ?? null;
    next();
  },

  mounted() {
    const { elements } = this.$accessor;

    if (this.task) {
      const found = elements.find((el) => el.id === this.task);
      if (found) {
        this.name = found.name;
        this.blockMap = found.content ?? null;
      }
    } else {
      const { element } = this.$route.params;

      this.blockMap = elements.find((el) => el.id === element)?.content ?? null;
    }
  },
});
</script>
