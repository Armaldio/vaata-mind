<template>
  <v-app>
    <v-main>
       <v-autocomplete
        dense
        outlined
        label="Select a project..."
        v-model="currentProject"
        :items="projects"
        item-text="name"
        item-value="id"
        return-object
        hide-details
      >
      </v-autocomplete>

      <v-card v-if="task">
        <v-card-text>
          <Viewer task="5c1d4860-f7c7-4b69-850b-c143a67bfceb"></Viewer>
          <v-chip>Algo</v-chip>
        </v-card-text>
        <v-card-actions>
          <template v-if="doingMode">
            <v-btn @click="done">Terminer</v-btn>
            <v-btn @click="cancel">Annuler</v-btn>
          </template>

          <template v-else>
            <v-btn @click="reject">Rejecter</v-btn>
            <v-btn @click="accept">Accepter</v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
// import * as Swing from 'swing';
import { getTasks } from '../wrapper/api';
import Viewer from '@/views/Administration/Viewer.vue';
import { State } from '@/store';

export default Vue.extend({
  name: 'Element',

  components: {
    Viewer,
  },

  data() {
    return {
      tasks: [] as any[],
      task: null as any,

      doingMode: false,
    };
  },

  computed: {
    projects(): State['projects'] {
      return this.$accessor.projects;
    },
    currentProject: {
      get(): State['currentProject'] {
        return this.$accessor.currentProject;
      },
      set(val: State['currentProject']) {
        this.$accessor.SET_CURRENT_PROJECT(val);
      },
    },
  },

  methods: {
    reject() {
      //
    },
    accept() {
      this.doingMode = true;
    },
    done() {
      this.doingMode = false;
    },
    cancel() {
      this.doingMode = false;
    },
  },

  async mounted() {
    const tasks = await getTasks();
    this.$accessor.SET_TASKS(tasks);

    this.tasks = tasks;
    // eslint-disable-next-line prefer-destructuring
    this.task = this.tasks[0];
    console.log('tasks', tasks);

    // await this.$nextTick();

    // const refsTasks = Array.isArray(this.$refs.task) ? this.$refs.task : [this.$refs.task];
    // console.log('refsTasks', refsTasks);
    // const els = refsTasks.map((task) => {
    //   if (task) {
    //     return ((task as Vue).$el ? (task as Vue).$el : task);
    //   }
    //   return undefined;
    // });
    // console.log('els', els);
    // console.log('Swing', Swing);
    // const stack = Swing.Stack();

    // els.forEach((targetElement) => {
    //   // Add card element to the Stack.
    //   stack.createCard(targetElement);
    // });

    // // Add event listener for when a card is thrown out of the stack.
    // stack.on('throwout', (event) => {
    //   // e.target Reference to the element that has been thrown out of the stack.
    //   // e.throwDirection Direction in which the element has been thrown
    //   // (Direction.LEFT, Direction.RIGHT).

    //   console.log('Card has been thrown out of the stack.');
    //   console.log(`Throw direction:
    //     ${event.throwDirection === Swing.Direction.LEFT ? 'left' : 'right'}
    //   `);
    // });

    // // Add event listener for when a card is thrown in the stack, including
    // // the spring back into place effect.
    // stack.on('throwin', () => {
    //   console.log('Card has snapped back to the stack.');
    // });
  },
});
</script>
