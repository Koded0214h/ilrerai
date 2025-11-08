class HealthCheckService {
  private isBackendAvailable = false;
  private checkInterval: NodeJS.Timeout | null = null;

  async checkBackendHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        this.isBackendAvailable = true;
        return true;
      }
      
      this.isBackendAvailable = false;
      return false;
    } catch (error) {
      this.isBackendAvailable = false;
      return false;
    }
  }

  startHealthCheck(callback?: (isHealthy: boolean) => void) {
    // Check immediately
    this.checkBackendHealth().then(callback);
    
    // Check every 10 seconds
    this.checkInterval = setInterval(async () => {
      const isHealthy = await this.checkBackendHealth();
      callback?.(isHealthy);
    }, 10000);
  }

  stopHealthCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  isHealthy(): boolean {
    return this.isBackendAvailable;
  }
}

export default new HealthCheckService();