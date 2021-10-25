<template>
  <div v-if="property.type === 'people'">
    {{ name }}: {{ property.people }}
  </div>
  <div v-else-if="property.type === 'select'">
    {{ name }}: {{ property.select.name }}
  </div>
  <div v-else>
    {{ name }}: {{ property }}
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'Property',

  props: {
    name: {
      type: String,
      required: true,
    },
    property: {
      type: Object as PropType<any>,
      required: true,
    },
  },

  data() {
    return {
    };
  },

  methods: {

  },
});
</script>
