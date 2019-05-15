<!-- home.vue -->
<template>
  <f7-panel left reveal>
    <f7-view url="/left-panel/">
      <f7-page>
        <f7-block-title>Radio Group</f7-block-title>
        <f7-list>
          <f7-list-item radio name="lang-radio"
            v-for="(val, key) in $i18n.messages"
            :key="key"
            :title="key"
            :checked="key === $i18n.locale"
            :value="key"
            @change="changeLanguage($event)">
          </f7-list-item>
        </f7-list>
        <f7-block-title>Bundle</f7-block-title>
        <f7-block>{{ appBundle }}</f7-block>
        <f7-block-title>Version</f7-block-title>
        <f7-block>{{ appVersion }}</f7-block>
      </f7-page>
    </f7-view>
  </f7-panel>
</template>

<script>
export default {
  data() {
    return {
      appBundle: APP_BUNDLE,
      appVersion: APP_VERSION
    }
  },
  methods: {
    changeLanguage(e) {
      this.$i18n.locale = e.target.value;
      if (DEV) console.log(`Language changed to ${this.$i18n.locale}`);
    }
  }
}
</script>

<style lang="less" scoped>

</style>
