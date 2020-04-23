"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const DIR = path_1.default.join(os_1.default.homedir(), '.config', 'keys-server');
if (!fs_1.default.existsSync(DIR)) {
    fs_1.default.mkdirSync(DIR);
}
const SOURCE = path_1.default.join(DIR, 'db.sqlite');
exports.db = new sqlite3_1.default.Database(SOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    else {
        exports.db.run(`CREATE TABLE appFeatures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name text UNIQUE,
      value boolean,
      CONSTRAINT name_unique UNIQUE (name)
    )`, (err) => {
            // Do nothing
        });
    }
});
