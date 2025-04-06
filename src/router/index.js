import { createRouter, createWebHistory } from 'vue-router';
import FormView from '@/views/FormView.vue';
import SubmissionsView from '@/views/SubmissionsView.vue';

const routes = [
  {
    path: '/',
    name: 'form',
    component: FormView
  },
  {
    path: '/submissions',
    name: 'submissions',
    component: SubmissionsView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
