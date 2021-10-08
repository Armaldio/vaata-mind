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
          <v-subheader>card</v-subheader>

          <v-card-text>
            <div v-if="blockMap">
              <template v-for="(block, key) in blockMap">
                <div :key="key" v-if="block.type === 'paragraph'">
                  {{ block.paragraph.text[0].plain_text }}
                </div>
              </template>
            </div>
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
// import { NotionRenderer } from 'vue-notion';

export default Vue.extend({
  name: 'Element',

  components: {
    // NotionRenderer,
  },

  data() {
    return {
      blockMap: null as null | any,
    };
  },

  mounted() {
    const { element } = this.$route.params;
    const { elements } = this.$accessor;

    this.blockMap = elements.find((el) => el.id === element)?.content ?? null;
  },
});
</script>
