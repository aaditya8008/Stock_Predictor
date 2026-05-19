const API_BASE_URL = 'http://localhost:8000';

export const stockService = {
  async getPrediction(symbol: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/${symbol}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || 
          `Failed to fetch prediction (Status: ${response.status})`
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          console.error('Error: ML backend server is not running. Please start the server first.');
          throw new Error('ML backend server is not running. Please start the server first.');
        }
        console.error('Error fetching prediction:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
};