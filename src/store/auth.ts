import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const avatar = ref(localStorage.getItem('avatar') || '');
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

  function setAvatar(avatarUrl: string) {
    avatar.value = avatarUrl;
  }
  function getAvatar() {
    return avatar.value;
  }

  return { token, isLogin, signIn, signOut, setAvatar, getAvatar };
});
