import sqliteConnection from './sqlite/sqlite.connect';

const init = () => {
  sqliteConnection.getClient();
};

export default {
  init,
};
