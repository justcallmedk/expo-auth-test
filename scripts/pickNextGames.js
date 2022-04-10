const constituents = require('./data/constituents.json');

const NUM_OF_GAMES = 3;
let map = {};
const pick = () => {
  for(const constituent of constituents) {
    const sector = constituent.Sector;
    if(!map[sector]) {
      map[sector] = {};
    }
    map[constituent.Sector][constituent.Symbol] = constituent.Name;
  }
  const sectorKeys = Object.keys(map);
  const sector = sectorKeys[Math.floor(Math.random() * sectorKeys.length)];
  const symbolKeys = Object.keys(map[sector]);
  const symbol = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
  const name = map[sector][symbol];
  delete map[sector];
  return {
    symbol : symbol,
    name : name,
    sector : sector
  }
};

(async () => {
  let games = [];
  for(let i = 0; i < NUM_OF_GAMES; i++) {
    games.push({
      home : pick(),
      away : pick()
    })
  }
  console.info(games);
})();
