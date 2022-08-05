import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useProjStore = defineStore('proj', () => {
  const projID = ref<number | null>(null);
  const getProjID = () => {
    return projID.value;
  };
  const setProjID = (id: number) => {
    projID.value = id;
  };

  return { getProjID, setProjID };
});
