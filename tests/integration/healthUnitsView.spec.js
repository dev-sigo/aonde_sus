/**
 * @jest-environment jsdom
 */
import { describe, expect, test, beforeEach } from '@jest/globals';

describe('Função [ renderUnits ]', () => {
  let View;

  beforeEach(async () => {
    document.body.innerHTML = `
      <div id="results-count"></div>
      <div id="no-results" class="hidden"></div>
      <div id="units-list"></div>
      <select id="specialty"></select>
      <select id="unit-type"></select>
      
      <template id="unit-card-template">
        <div class="unit-card">
          <h3 class="unit-card__name"></h3>
          <p class="unit-card__address"></span>
        </div>
      </template>
    `;

    View = await import(`../../assets/js/healthUnitsView.js?${Math.random()}`);
  });

  test('Deve renderizar a lista e atualizar o contador de unidades', () => {
    const mockUnits = [
      {
        name: 'Unidade de Teste',
        location: { streetAddress: 'Rua X', neighborhood: 'Bairro Y', city: 'Cidade Z' },
        specialties: ['Geral'],
      },
    ];

    View.renderUnits(mockUnits);

    const list = document.getElementById('units-list');
    const countText = document.getElementById('results-count').textContent;

    expect(list.children).toHaveLength(1);
    expect(countText).toContain('1 Unidade encontrada');
    expect(list.querySelector('.unit-card__name').textContent).toBe('Unidade de Teste');
  });

  test('Deve popular corretamente os seletores de filtro', () => {
    const specs = ['Cardiologia'];
    const types = ['UBS'];

    View.populateFilterOptions(specs, types);

    const specSelect = document.getElementById('specialty');
    const typeSelect = document.getElementById('unit-type');

    expect(specSelect.options).toHaveLength(1);
    expect(specSelect.options[0].text).toBe('Cardiologia');
    expect(typeSelect.options[0].text).toBe('UBS');
  });

  test('Deve exibir a pluralização correta para uma e múltiplas unidades', () => {
    View.renderUnits([{ name: 'U1', location: { streetAddress: '', neighborhood: '', city: '' }, specialties: [] }]);
    expect(document.getElementById('results-count').textContent).toBe('1 Unidade encontrada.');

    View.renderUnits([
      { name: 'U1', location: { streetAddress: '', neighborhood: '', city: '' }, specialties: [] },
      { name: 'U2', location: { streetAddress: '', neighborhood: '', city: '' }, specialties: [] },
    ]);
    expect(document.getElementById('results-count').textContent).toBe('2 Unidades encontradas.');
  });

  test('Deve exibir mensagem de erro e limpar a lista anterior', () => {
    const list = document.getElementById('units-list');
    list.innerHTML = '<div>Conteúdo Antigo</div>';

    View.renderError('Falha na conexão');

    expect(list.innerHTML).toBe('<p class="error">Falha na conexão</p>');
  });

  test('Deve limpar a lista antes de renderizar novos resultados', () => {
    const unit = { name: 'Unidade', location: { streetAddress: '', neighborhood: '', city: '' }, specialties: [] };

    View.renderUnits([unit]);
    View.renderUnits([unit]);

    const list = document.getElementById('units-list');
    expect(list.children).toHaveLength(1);
  });

  test('Deve evitar criar badges se a lista de especialidades estiver vazia', () => {
    const unitWithoutSpecs = {
      name: 'Sem Especialidade',
      location: { streetAddress: '', neighborhood: '', city: '' },
      specialties: [],
    };

    View.renderUnits([unitWithoutSpecs]);

    const badgeContainer = document.querySelector('.unit-card__badges');
    expect(badgeContainer.children).toHaveLength(0);
  });
});
