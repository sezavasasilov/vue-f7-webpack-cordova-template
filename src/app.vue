<template>
  <f7-app :params="f7params">
    <f7-statusbar></f7-statusbar>
    <f7-view main url="/"></f7-view>
  </f7-app>
</template>

<script>
import routes from './routes.js';

let theme = location.search.indexOf('theme=') >= 0 ? location.search.split('theme=')[1].split('&')[0] : 'auto';

export default {
  data() {
    return {
      f7params: {
        name: APP_NAME,
        id: APP_BUNDLE,
        theme,
        routes,
      }
    }
  }
}
</script>
