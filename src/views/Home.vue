<template>
  <Page>

    <v-btn color="primary" @click="guitar.play()" style="margin-top: 20px;">Bong!</v-btn>

  </Page>
</template>

<script>
  import Page from '@/components/Page.vue'
  import Guitar from '@/instruments/Guitar.ts'

  export default {
    name: 'Home',
    components: {
      Page,
    },
    data() {
      return {
        guitar: new Guitar()
      }
    },
  };
</script>