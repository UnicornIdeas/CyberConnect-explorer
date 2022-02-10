<template>
  <v-app>
    <v-app-bar class="app_bar_margin" app color="primary" dark elevation="0">
      <v-app-bar-nav-icon>
        <v-img
          max-height="30"
          max-width="30"
          src="https://app.cyberconnect.me/assets/logo-white.svg"
        />
      </v-app-bar-nav-icon>
      <v-app-bar-title> CyberConnect </v-app-bar-title>
      <v-text-field
        filled
        flat
        solo
        hide-details="true"
        dense
        placeholder="Search address"
        append-icon="mdi-magnify"
        background-color="#25252f"
      />
    </v-app-bar>

    <v-main class="main_class">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style scoped>
.main_class {
  background-color: #21212d;
}

.app_bar_margin {
  margin-left: 15vw;
  margin-right: 15vw;
}

.v-toolbar__title {
  padding-left: 0px !important;
  margin-right: 15vw;
}
</style>

<style>
.v-app-bar-title__content {
  overflow: auto !important;
  width: unset !important;
}

.v-input {
  border-radius: 0px !important;
}

.v-input::after,
.v-input::before,
.v-input__control::after,
.v-input__control::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: #b4b4bb;
  transition: 1s;
  mix-blend-mode: hue;
}

.v-input:before {
  top: -2px;
  left: -2px;
}
.v-input:after {
  top: -2px;
  right: -2px;
}
.v-input__control:before {
  bottom: -2px;
  left: -2px;
}
.v-input__control:after {
  bottom: -2px;
  right: -2px;
}

.v-input:hover:before,
.v-input:hover:after,
.v-input:hover .v-input__control:before,
.v-input:hover .v-input__control:after {
  width: 30px;
  height: 20px;
}
</style>
