import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Theme } from "../types/theme";
import { builtinThemes, themeMap } from "../data/themes";

export const useThemeStore = defineStore(
  "theme",
  () => {
    const currentThemeId = ref("clean-light");
    const userThemes = ref<Theme[]>([]);

    const allThemes = computed<Theme[]>(() => [
      ...builtinThemes,
      ...userThemes.value,
    ]);

    const currentTheme = computed<Theme>(() => {
      const fromUser = userThemes.value.find(
        (t) => t.id === currentThemeId.value,
      );
      if (fromUser) return fromUser;
      return themeMap.get(currentThemeId.value) ?? builtinThemes[0]!;
    });

    function setTheme(id: string) {
      currentThemeId.value = id;
    }

    function addUserTheme(theme: Theme) {
      userThemes.value.push({ ...theme, source: "user" });
    }

    function removeUserTheme(id: string) {
      userThemes.value = userThemes.value.filter((t) => t.id !== id);
      if (currentThemeId.value === id) {
        currentThemeId.value = "clean-light";
      }
    }

    return {
      currentThemeId,
      currentTheme,
      allThemes,
      userThemes,
      setTheme,
      addUserTheme,
      removeUserTheme,
    };
  },
  {
    persist: {
      key: "keyboard-show-off-theme",
      pick: ["currentThemeId", "userThemes"],
    },
  },
);
