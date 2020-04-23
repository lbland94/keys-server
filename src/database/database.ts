import sqlite3 from 'sqlite3';
import path from 'path';
import os from 'os';
import fs from 'fs';

const DIR = path.join(os.homedir(), '.config', 'keys-server');

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}

const SOURCE = path.join(DIR, 'db.sqlite');

export const db = new sqlite3.Database(SOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    db.run(`CREATE TABLE appFeatures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name text UNIQUE,
      value boolean,
      CONSTRAINT name_unique UNIQUE (name)
    )`,
    (err) => {
      // Do nothing
    });
  }
});
