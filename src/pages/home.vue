<!-- home.vue -->
<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link href="/left-panel/">
          <f7-icon ios="f7:bars" md="material:menu"></f7-icon>
        </f7-link>
      </f7-nav-left>

      <f7-nav-title :title="$f7.name"></f7-nav-title>
    </f7-navbar>

    <f7-block-title medium class="text-align-center">{{ $t('welcome') }}</f7-block-title>
    <f7-block>
      <f7-row class="text-align-center">
        <f7-col>
          <img src="../img/f7-logo.svg" alt="Framework7 logo"><br>
          <h2 class="f7color">Framework7</h2>
        </f7-col>
        <f7-col>
          <img src="../img/vue-logo.svg" alt="Vue.js logo"><br>
          <h2 class="vjsvolor">Vue.js</h2>
        </f7-col>
      </f7-row>
      <f7-row class="text-align-center">
        <f7-col>
          <img src="../img/webpack-logo.svg" alt="Webpack logo"><br>
          <h2 class="wpkcolor">Webpack</h2>
        </f7-col>
        <f7-col>
          <img src="../img/cordova-logo.svg" alt="Cordova logo"><br>
          <h2 class="cordovacolor">Cordova</h2>
        </f7-col>
      </f7-row>
    </f7-block>
  </f7-page>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
img{
  width: auto;
  height: 128px;
}
</style>
