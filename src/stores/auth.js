import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/api/api";

export const useAuthStore = defineStore("auth", () => {

  const token = ref(localStorage.getItem("token"));
  const user = ref(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const login = async (payload) => {
    const formData = new FormData();
    formData.append('email_or_phone', payload.email);
    formData.append('password', payload.password);

    const res = await api.post("/api/login", formData);

    token.value = res.data.data.token;
    localStorage.setItem("token", token.value);

    await fetchProfile();

    // Verify if user has System Admin role
    const hasAdminRole = user.value?.roles?.some(role => role.name === 'System Admin');
    if (!hasAdminRole) {
      clearAuth();
      throw new Error('Unauthorized: Admin access required.');
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/me");
      user.value = res.data.data;

      // Ensure user still has System Admin role
      const hasAdminRole = user.value?.roles?.some(role => role.name === 'System Admin');
      if (!hasAdminRole) {
        clearAuth();
        throw new Error('Unauthorized: Admin access required.');
      }
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.delete("/api/logout");
    } finally {
      clearAuth();
    }
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  };

  return {
    token,
    user,
    isAuthenticated,

    login,
    fetchProfile,
    logout,
    clearAuth,
  };
});
