const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    screens: {
      smartphone: '375px',
      desktop: '1024px',
    },
    extend: {
      width: {
        sp_main_content: '375px',
        pc_main_content: '1024px',
      },
      colors: {
        text_black: '#333333',
        border_black: '#000000',
        bg_civilization_score: '#448AFF',
        br_civilization_score: '#448AFF',
        bg_military_score: '#EB5757',
        br_military_score: '#EB5757',
        bg_commercial_score: '#F2C94C',
        br_commercial_score: '#F2C94C',
        bg_science_score: '#27AE60',
        br_science_score: '#27AE60',
        bg_guild_score: '#BB6BD9',
        br_guild_score: '#BB6BD9',
        bg_city_score: '#333333',
        br_city_score: '#333333',
        bg_leader_score: '#F5F5F5',
        br_leader_score: '#F5F5F5',
        bg_wonder_score: '#EDB91B',
        br_wonder_score: '#EDB91B',
        bg_coin_score: '#F5D67A',
        br_coin_score: '#F5D67A',
      },
    },
  },
  plugins: [],
};
