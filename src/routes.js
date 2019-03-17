import Home from './pages/home.vue';
import LeftPanel from './pages/left-panel.vue';

export default [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/left-panel/',
    panel: {
      component: LeftPanel
    }
  },
]
