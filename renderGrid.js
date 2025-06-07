const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

async function fetchAndRenderGrid(docUrl) {
  try {
    const response = await fetch(docUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const html = await response.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const table = document.querySelector('table');
    if (!table) {
      console.error('No table found on the page!');
      return;
    }

    const rows = Array.from(table.querySelectorAll('tr')).slice(1);
    const points = [];

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length === 3) {
        const x = parseInt(cells[0].textContent.trim());
        const char = cells[1].textContent.trim();
        const y = parseInt(cells[2].textContent.trim());
        points.push({ x, char, y });
      }
    });

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    const grid = Array.from({ length: height }, () => Array(width).fill(' '));

    points.forEach(({ x, char, y }) => {
      const col = x - minX;
      const row = y - minY;
      grid[row][col] = char;
    });

    for (let row = 0; row < height; row++) {
      console.log(grid[row].join(''));
    }
  } catch (error) {
    console.error('Error fetching or parsing the document:', error);
  }
}

// Replace with your published Google Doc URL here:
const docUrl = 'https://docs.google.com/document/d/e/2PACX-1vSZ1vDD85PCR1d5QC2XwbXClC1Kuh3a4u0y3VbTvTFQI53erafhUkGot24ulET8ZRqFSzYoi3pLTGwM/pub';

fetchAndRenderGrid(docUrl);

