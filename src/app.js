// Import Vue
import Vue from 'vue';

// Import F7 Bundle
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7-Vue Plugin Bundle (with all F7 components registered)
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import F7 Style
import Framework7CSS from 'framework7/css/framework7.bundle.css';

// Import App Custom Styles
import AppStyles from './less/styles.less';

// Import F7 iOS Icons
import Framework7Icons from 'framework7-icons/css/framework7-icons.css';

// Import Material Icons
import MaterialIcons from 'material-design-icons/iconfont/material-icons.css';

// Import multilanguage plugin
import I18n from './i18n';

// Init F7-Vue Plugin
Framework7.use(Framework7Vue);

// Import Main App component
import App from './app.vue';

// Init App
new Vue({
  el: '#app',
  i18n: I18n,
  render: (h) => h(App),
});
