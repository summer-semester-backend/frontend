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
    localStorage.clear();
    token.value = '';
  }

  return { token, isLogin, signIn, signOut };
});
