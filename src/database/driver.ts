import { db } from "./database";

export class AppFeaturesDriver {
  async getFeatures(): Promise<IAppFeature[]> {
    return new Promise((res, rej) => {
      const sql = 'select * from appFeatures';
      db.all(sql, [], (err, rows) => {
        if (err) {
          rej(err);
          return;
        }
        res(rows.map(row => ({name: row.name, value: Boolean(row.value)})));
      });
    });
  }

  async setFeature(name: string, value: boolean) {
    return new Promise((res, rej) => {
      const insertSql = 'INSERT INTO appFeatures(name, value) VALUES(?, ?)';
      db.run(insertSql, [name, value], (err) => {
        if (err) {
          const updateSql = `UPDATE appFeatures SET value = ${value} WHERE name = "${name}";`;
          db.run(updateSql, [], (updateErr) => {
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
  }

  async deleteFeature(name: string) {
    return new Promise((res, rej) => {
      const deleteSql = 'DELETE from appFeatures WHERE name = (?)';
      db.run(deleteSql, [name], (err) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      })
    });
  }
}

interface IAppFeature {
  value: boolean;
  name: string;
}

const appFeaturesDriver = new AppFeaturesDriver();

export default appFeaturesDriver;
