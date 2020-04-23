"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
class AppFeaturesDriver {
    getFeatures() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                const sql = 'select * from appFeatures';
                database_1.db.all(sql, [], (err, rows) => {
                    if (err) {
                        rej(err);
                        return;
                    }
                    res(rows.map(row => ({ name: row.name, value: Boolean(row.value) })));
                });
            });
        });
    }
    setFeature(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                const insertSql = 'INSERT INTO appFeatures(name, value) VALUES(?, ?)';
                database_1.db.run(insertSql, [name, value], (err) => {
                    if (err) {
                        const updateSql = `UPDATE appFeatures SET value = ${value} WHERE name = "${name}";`;
                        database_1.db.run(updateSql, [], (updateErr) => {
                            if (updateErr) {
                                rej(updateErr);
                                return;
                            }
                            res();
                        });
                        return;
                    }
                    res();
                });
            });
        });
    }
    deleteFeature(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                const deleteSql = 'DELETE from appFeatures WHERE name = (?)';
                database_1.db.run(deleteSql, [name], (err) => {
                    if (err) {
                        rej(err);
                        return;
                    }
                    res();
                });
            });
        });
    }
}
exports.AppFeaturesDriver = AppFeaturesDriver;
const appFeaturesDriver = new AppFeaturesDriver();
exports.default = appFeaturesDriver;
