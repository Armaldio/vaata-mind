<template>
  <v-app>
    <v-main class="main">
      <v-container class="d-flex h100 flex-column">
      <!-- <v-treeview
        selectable
        item-text="text"
        item-key="id"
        :items="selector"
      ></v-treeview> -->

        <v-row>
          <v-col>
            <v-autocomplete
              chips
              dense
              solo
              label="Select a project..."
              v-model="currentProject"
              :items="selector"
              item-text="name"
              item-value="id"
              multiple
              :loading="isProjectsLoading"
              return-object
              hide-details
            >
            </v-autocomplete>
          </v-col>
        </v-row>

        <v-row v-if="!isProjectsLoading">
          <v-col>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="6"
                lg="4"
                v-for="(item, index) in properties" :key="index"
              >
                <v-autocomplete
                  chips
                  dense
                  solo
                  :label="item.name"
                  :items="item.values"
                  item-text="name"
                  item-value="id"
                  multiple
                  return-object
                  hide-details
                >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-skeleton-loader
          v-else
          type="text@3"
          class="mb-4"
        ></v-skeleton-loader>

        <v-row class="h100">
          <v-col class="h100 d-flex flex-column hide-overflow">
            <Viewer
              class="flex-grow-1 h100 hide-overflow"
              :task="currentTask"
              :isLoading="isTaskLoading"
              :doingMode="doingMode"

              @accept="accept"
              @reject="reject"
              @done="done"
              @cancel="cancel"
            ></Viewer>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { SearchResponse } from '@notionhq/client/build/src/api-endpoints';
import Viewer from '@/views/Administration/Viewer.vue';
import { api } from '@/wrapper/api';
import {
  Category, Elements, ICategory, IProject, isCategory, isProject, isTask, Project, Task,
} from '@/models/project';

export default Vue.extend({
  name: 'Random',

  components: {
    Viewer,
  },

  computed: {
    selector(): (IProject | ICategory)[] {
      // console.log('this.projects', this.projects);
      // console.log('this.categories', this.categories);
      return this.projects;
    },
    tasksFromProject(): Task[] {
      const selectedProject = this.currentProject?.map((p) => p.id);
      return this.tasks
        .filter((task) => selectedProject?.includes(task.parent))
        .filter((task) => !this.denyList.includes(task.id));
    },
    properties() {
      const props: Record<string, { name: string, values: any[] }> = {};

      this.tasksFromProject.forEach((task) => {
        const propsForTask = task.properties;
        Object.entries(propsForTask).forEach(([key, value]) => {
          // @ts-ignore
          if (!props[key] && value.type !== 'title') {
            props[key] = {
              name: key,
              values: [],
            };
          }

          const propForTask = propsForTask[key];
          if (
            propForTask.type === 'select'
            && propForTask.select
            && !props[key].values.find((prop) => prop.id === propForTask.select.id)
          ) {
            props[key].values.push(propForTask.select);
          } else if (
            propForTask.type === 'people'
            && propForTask.people
          ) {
            // @ts-ignore
            propForTask.people.forEach((person) => {
              if (!props[key].values.find((prop) => prop.id === person.id)) {
                props[key].values.push(person);
              }
            });
          } else if (
            propForTask.type === 'title'
          ) {
            // Do nothing
          }
        });
      });

      return props;
    },
    tasks(): Task[] {
      // @ts-ignore
      return this.elements.filter((e) => isTask(e));
    },
    projects(): IProject[] {
      // @ts-ignore
      return this.elements.filter((e) => isProject(e));
    },
    categories(): ICategory[] {
      // @ts-ignore
      return this.elements.filter((e) => isCategory(e));
    },
  },

  data() {
    return {
      doingMode: false,
      currentProject: null as IProject[] | null,
      currentTask: null as null | Task,

      elements: [] as Elements[],
      denyList: [] as string[],

      isTaskLoading: true,
      isProjectsLoading: true,
    };
  },

  methods: {
    setTaskContent(taskId: Task['id'], content: any) {
      const task = this.tasks.find((t) => t.id === taskId);
      if (task) {
        task.content = content;
      }
    },
    async getRandomTask(): Promise<void> {
      this.isTaskLoading = true;
      const tasks = this.tasksFromProject;
      console.log('tasks', tasks);

      const index = Math.floor(Math.random() * tasks.length);
      console.log('index', index);

      console.log('tasks[index]', tasks[index]);

      const newTask = tasks[index];

      const content = await api.getPageContent(newTask.id);

      this.setTaskContent(newTask.id, content.results);

      this.currentTask = newTask;
      this.isTaskLoading = false;
    },
    reject() {
      if (this.currentTask) {
        this.denyList.push(this.currentTask.id);
        this.getRandomTask();
      }
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
    const rawAuth = localStorage.getItem('notion-auth');

    if (!rawAuth) {
      this.$router.push('/login');
    } else {
      const auth = JSON.parse(rawAuth);
      api.setToken(auth.access_token);

      const data: SearchResponse['results'] = [];
      let hasMore = true;
      let nextCursor = '';

      while (hasMore) {
      // eslint-disable-next-line no-await-in-loop
        const { has_more, next_cursor, results } = await api.fetchElements(nextCursor);

        if (has_more && next_cursor) {
          nextCursor = next_cursor;
        }

        hasMore = has_more;

        data.push(...results);
      }

      for await (const element of data) {
        if (element.object === 'page') {
          if (element.parent.type === 'workspace') {
            // Workspaces
            let cover = '';
            let text = '';

            if (
              element.cover?.type === 'external'
            ) {
              cover = element.cover.external.url;
            } else {
              cover = element.cover?.file.url ?? '';
            }

            if (element.properties.title.type === 'title') {
              if (Array.isArray(element.properties.title.title)) {
                text = element.properties.title.title.map((t) => t.plain_text).join(' ');
              }
            }

            this.elements.push(new Category({
              id: element.id,
              cover,
              archived: element.archived,
              text,
              parent: '',
              url: element.url,
            }));
          } else {
            // Tasks
            this.elements.push(new Task({
              // @ts-ignore
              name: element.properties?.Name?.title?.[0]?.plain_text ?? 'No Title',
              // @ts-ignore
              parent: element.parent.database_id,
              id: element.id,
              content: [],
              archived: element.archived,
              properties: element.properties,
              url: element.url,
            }));

            // console.log('b', element);
            // console.log('b', element.properties.Name.title[0].plain_text);
          }
        } else if (element.object === 'database') {
          // Projects
          this.elements.push(new Project({
            id: element.id,
            name: element.title[0].plain_text,
            // @ts-ignore
            parent: element.parent.page_id,
            properties: element.properties,
            url: element.url,
          }));
        }
      }

      this.currentProject = this.projects;

      this.isProjectsLoading = false;

      await this.getRandomTask();

      console.log('this.properties', this.properties);
    }
  },
});
</script>

<style lang="scss" scoped>
.h100 {
  height: 100%;
}

.main {
  height: 100vh;
}
</style>
