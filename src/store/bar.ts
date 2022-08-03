import { defineStore } from 'pinia';
export const barState = defineStore('bar', {
  state: () => {
    return {
      userBar: false,
      projectBar: false,
      teamBar: false,
    };
  },

  actions: {
    openUserBar() {
      this.projectBar = false;
      this.teamBar = false;
      this.userBar = true;
    },

    closeUserBar() {
      this.userBar = false;
    },

    openProjectBar() {
      this.userBar = false;
      this.teamBar = false;
      this.projectBar = true;
    },

    closeProjectBar() {
      this.projectBar = false;
    },

    openTeamBar() {
      this.userBar = true;
      this.projectBar = false;
      this.teamBar = true;
    },

    closeTeamBar() {
      this.teamBar = false;
    },
  },
});
