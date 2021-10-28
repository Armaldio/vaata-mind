<template>
  <v-btn
    :href="`https://api.notion.com/v1/oauth/authorize?client_id=5302e0ee-222a-4c66-89cf-0960e715db67&redirect_uri=${redirectURL}/oauth/callback&response_type=code&owner=user`"
  >
    Login with Notion
  </v-btn>
</template>

<script>

import { redirectURL } from '../api/utils';

export default {
  data() {
    return {
      redirectURL,
    };
  },

};
</script>

<style>

</style>
