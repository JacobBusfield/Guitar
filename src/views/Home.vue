<template>
  <Page>
    <div class="audiocontrols">
      <v-btn color="primary" @click="togglePlay()" block style="margin-top: 20px; margin-bottom: 20px;">
        <span v-if="isPlaying">Stop!</span>
        <span v-else>Play!</span>
      </v-btn>

      <v-slider v-model="stringTension" @change="updateStringTension(stringTension)" label="String Tension" min="0"
        max="1" step="0.1">
      </v-slider>
      <v-slider v-model="characterVariation" @change="updateCharacterVariation(characterVariation)"
        label="Character Variation" min="0" max="1" step="0.1">
      </v-slider>
      <v-slider v-model="stringDamping" @change="updateStringDamping(stringDamping)" label="String Damping" min="0.1"
        max="0.7" step="0.1">
      </v-slider>
      <v-slider v-model="stringDampingVariation" @change="updateStringDampingVariation(stringDampingVariation)"
        label="String Damping Variation" min="0" max="0.5" step="0.05">
      </v-slider>
      <v-slider v-model="pluckDamping" @change="updatePluckDamping(pluckDamping)" label="Pluck Damping" min="0"
        max="0.9" step="0.1">
      </v-slider>
      <v-slider v-model="pluckDampingVariation" @change="updatePluckDampingVariation(pluckDampingVariation)"
        label="Pluck Damping Variation" min="0" max="0.5" step="0.05">
      </v-slider>
      <v-slider v-model="stereoSpread" @change="updateStereoSpread(stereoSpread)" label="Stereo Spread" min="0" max="1"
        step="0.1">
      </v-slider>
      <v-radio-group label="String Damping Calculation" v-model="stringDampingCalculation"
        @change="updateStringDampingCalculation(stringDampingCalculation)" row>
        <v-radio label="Magic" value="magic"></v-radio>
        <v-radio label="Direct" value="direct"></v-radio>
      </v-radio-group>
      <v-radio-group label="Body Resonation" v-model="body" @change="updateBody(body)" row>
        <v-radio label="None" value="none"></v-radio>
        <v-radio label="Simple" value="simple"></v-radio>
      </v-radio-group>
    </div>
  </Page>
</template>

<script>
  import Page from '@/components/Page.vue'

  import {
    startGuitarPlaying,
    stopGuitarPlaying,
    updateStringDamping,
    updateStringDampingVariation,
    updateStringDampingCalculation,
    updateStringTension,
    updateCharacterVariation,
    updateStereoSpread,
    updatePluckDamping,
    updatePluckDampingVariation,
    updateBody
  } from '@/karplusstrong/karplusstrong.js'

  export default {
    name: 'Home',
    components: {
      Page,
    },
    data() {
      return {
        stringTension: 0,
        characterVariation: 0,
        stringDamping: 0.5,
        stringDampingVariation: 0.25,
        pluckDamping: 0.5,
        pluckDampingVariation: 0.45,
        stereoSpread: 1,
        stringDampingCalculation: 'magic',
        body: 'simple',

        isPlaying: false,

        //methods
        startGuitarPlaying: startGuitarPlaying,
        stopGuitarPlaying: stopGuitarPlaying,
        updateStringDamping: updateStringDamping,
        updateStringDampingVariation: updateStringDampingVariation,
        updateStringDampingCalculation: updateStringDampingCalculation,
        updateStringTension: updateStringTension,
        updateCharacterVariation: updateCharacterVariation,
        updateStereoSpread: updateStereoSpread,
        updatePluckDamping: updatePluckDamping,
        updatePluckDampingVariation: updatePluckDampingVariation,
        updateBody: updateBody,
      }
    },
    methods: {
      togglePlay() {
        if (this.isPlaying) {
          this.stopGuitarPlaying()
        } else {
          this.startGuitarPlaying()
        }

        this.isPlaying = !this.isPlaying
      }
    }
  };
</script>

<style>
  .audiocontrols .v-label {
    min-width: 220px;
  }

  .audiocontrols .v-radio {
    margin-left: 15px;
  }

  .audiocontrols .v-radio .v-label {
    min-width: 20px;
  }
</style>