    // Função principal que busca o conteúdo da URL e desenha o grid
    async function fetchAndRenderGrid(docUrl) {
      try {
        // Faz o fetch do conteúdo HTML da URL (Google Docs publicado)
        const response = await fetch(docUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        // Lê o HTML como texto
        const html = await response.text();

        // Usa DOMParser para transformar a string HTML em um objeto DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Encontra a primeira tabela na página
        const table = doc.querySelector('table');
        if (!table) {
          document.getElementById('output').textContent = 'Nenhuma tabela encontrada na página!';
          return;
        }

        // Pega todas as linhas da tabela, exceto o cabeçalho
        const rows = Array.from(table.querySelectorAll('tr')).slice(1);
        const points = [];

        // Itera pelas linhas e extrai x, caractere e y
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length === 3) {
            const x = parseInt(cells[0].textContent.trim());      // Coluna X
            const char = cells[1].textContent.trim();             // Caractere a ser desenhado
            const y = parseInt(cells[2].textContent.trim());      // Linha Y
            points.push({ x, char, y });                          // Armazena ponto no array
          }
        });

        // Determina os limites do grid (mínimo e máximo de X e Y)
        const minX = Math.min(...points.map(p => p.x));
        const maxX = Math.max(...points.map(p => p.x));
        const minY = Math.min(...points.map(p => p.y));
        const maxY = Math.max(...points.map(p => p.y));

        const width = maxX - minX + 1;   // Largura do grid
        const height = maxY - minY + 1;  // Altura do grid

        // Cria uma matriz (grid) preenchida com espaços
        const grid = Array.from({ length: height }, () => Array(width).fill(' '));

        // Preenche o grid com os caracteres nos locais corretos
        points.forEach(({ x, char, y }) => {
          const col = x - minX; // posição horizontal ajustada
          const row = y - minY; // posição vertical ajustada
          grid[row][col] = char; // coloca o caractere no lugar certo
        });

        // Transforma a matriz em uma string com quebras de linha
        const rendered = grid.map(row => row.join('')).join('\n');

        // Mostra o resultado no <pre id="output">
        document.getElementById('output').textContent = rendered;

      } catch (error) {
        // Em caso de erro (na rede ou no parse), mostra no <pre>
        console.error('Erro ao buscar ou processar o documento:', error);
        document.getElementById('output').textContent = 'Erro: ' + error.message;
      }
    }

    // URL do Google Docs publicado que contém a tabela com X, caractere e Y
    const docUrl = 'https://docs.google.com/document/d/e/2PACX-1vSZ1vDD85PCR1d5QC2XwbXClC1Kuh3a4u0y3VbTvTFQI53erafhUkGot24ulET8ZRqFSzYoi3pLTGwM/pub';

    // Chama a função para buscar e renderizar o grid
    fetchAndRenderGrid(docUrl);
