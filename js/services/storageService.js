export function get(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to storage', e);
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from storage', e);
  }
}
