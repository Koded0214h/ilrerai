interface CacheItem {
  data: any;
  expiry: number;
}

class Cache {
  private store = new Map<string, CacheItem>();

  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    this.store.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  get(key: string) {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear() {
    this.store.clear();
  }
}

export default new Cache();