<!-- home.vue -->
<template>
  <f7-panel left reveal>
    <f7-view url="/left-panel/">
      <f7-page>
        <f7-block-title>Radio Group</f7-block-title>
        <f7-list>
          <f7-list-item radio name="lang-radio"
            v-for="(val, key) in $i18n.messages"
            :title="key"
            :checked="key === $i18n.locale"
            :value="key"
            @change="$i18n.locale = $event.target.value">
          </f7-list-item>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-panel>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>

</style>
