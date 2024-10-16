export const setSessionStorage = (data) => {
  sessionStorage.setItem("user", JSON.stringify(data));
};

export const getSessionStorage = () => {
  const data = sessionStorage.getItem("user");
  return data;
};

export const clearSessionStorage = () => {
  return sessionStorage.clear();
};
