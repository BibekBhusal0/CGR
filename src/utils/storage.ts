export const saveToLocalStorage = (key: string, data: unknown): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const loadFromLocalStorage = (key: string): Promise<unknown | null> => {
  return new Promise((resolve) => {
    try {
      const data = localStorage.getItem(key);
      resolve(data ? JSON.parse(data) : null);
    } catch (error) {
      console.error(error);
      resolve(null);
    }
  });
};
