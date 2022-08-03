import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const isLogin = computed(() => {
    return token.value !== '';
  });

  function signIn(userToken: string) {
    token.value = userToken;
  }
  function signOut() {
    token.value = '';
  }

  return { token, isLogin, signIn, signOut };
});

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
      this.userBar = false;
      this.projectBar = false;
      this.teamBar = true;
    },

    closeTeamBar() {
      this.teamBar = false;
    },
  },
});
