const DATA_URL = './assets/js/data.json';

/**
 * Função assíncrona para carregar dados de unidades de saúde de forma robusta.
 * Garante que a aplicação não quebre em caso de falha de rede ou HTTP.
 *
 * @returns {Promise<Array>} Um array de unidades de saúde ou um array vazio em caso de falha.
 */
export async function loadHealthUnits() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} (Not Found)`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading health units data:', error);
    return [];
  }
}
