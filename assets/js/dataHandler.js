const DATA_URL = './assets/js/data.json';

/**
 * Busca e carrega a lista de unidades de saúde de forma segura,
 * garantindo que a aplicação não pare de funcionar (quebrar)
 * em caso de falhas de conexão ou erros de servidor.
 *
 * @returns {Promise<Array>} Retorna a lista de unidades ou um array vazio se houver erro.
 */
export async function getHealthUnitsData() {
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
