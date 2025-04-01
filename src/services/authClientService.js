import apiClient from "./apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error(
      "[registerUser] API Error:",
      error?.response?.data || error.message
    );
    throw (
      error?.response?.data?.error || "Erreur de communication avec le serveur"
    );
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });

    await AsyncStorage.setItem("authToken", response.data.token);
    await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data?.error || "Error during login";
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};
