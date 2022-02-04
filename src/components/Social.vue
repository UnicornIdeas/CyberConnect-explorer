<template>
  <v-container class="fill-height main-body">
    <v-row>
      <v-col cols="4">
        <v-card color="#1e1e29" class="rotated-card" elevation="10">
          <v-row align="center">
            <v-avatar size="10vw" class="avatar-style">
              <img
                alt="Avatar"
                src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
              />
            </v-avatar>
          </v-row>
          <v-row justify="center">
            <h1 style="color: #41c8fb">pisofa.eth</h1>
          </v-row>
          <v-row justify="center">
            <div class="caption font-weight-light grey--text">
              Since 18.12.2022
            </div>
          </v-row>

          <v-row justify="center" class="follow-row">
            <v-col class="center-column column-left" cols="4">
              123<br />
              Following
            </v-col>
            <v-divider vertical class="divider-style" />
            <v-col class="center-column column-right" cols="4">
              8888<br />
              Followers
            </v-col>
          </v-row>

          <v-card-actions> </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.main-body {
  padding-right: 15vw !important;
  padding-left: 15vw !important;
  max-width: unset !important;
}

.rotated-card {
  transform: rotate(8deg);
}

.avatar-style {
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
}

.center-column {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #292b3a;
  text-align: center;
}
.column-right {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.column-left {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.follow-row {
  margin-top: 35px !important;
  margin-bottom: 10px;
}

.divider-style {
  border-color: #1e1e29 !important;
  z-index: 1;
  margin-bottom: 8px;
  margin-top: 8px;
}
</style>