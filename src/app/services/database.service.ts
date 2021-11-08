import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  databaseObj: SQLiteObject;
  tables = {
    users: 'users',
    outlet: 'outlet',
    item: 'item',
    itenary: 'itenary',
    visibility: 'visibility',
    tx_survey: 'tx_survey',
    tx_stok: 'tx_stok',
    tx_category: 'tx_category',
    tx_photo: 'tx_photo',
    tx_merchandising: 'tx_merchandising',
    group_outlet: 'group_outlet',
  };

  constructor(private sqlite: SQLite) {}

  async createDatabase() {
    await new Promise(async (resolve) => {
      const createDb = await this.sqlite.create({
        name: 'modis_db',
        location: 'default',
      });
      resolve(createDb);
    })
      .then(async (db: SQLiteObject) => {
        this.databaseObj = db;
        await this.createTables();
      })
      .catch((e) => {
        console.log('error: ' + JSON.stringify(e));
      });
  }

  // async createDatabase() {
  //   await this.sqlite
  //     .create({
  //       name: 'modis_db',
  //       location: 'default',
  //     })
  //     .then((db: SQLiteObject) => {
  //       this.databaseObj = db;
  //     })
  //     .catch((e) => {
  //       console.log('error: ' + JSON.stringify(e));
  //     });

  //   await this.createTables();
  // }

  async createTables() {
    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.users} (id INTEGER PRIMARY KEY, name VARCHAR(255), uuid VARCHAR(50)  NOT NULL UNIQUE)`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.outlet} (id_outlet VARCHAR(15) PRIMARY KEY, name_outlet VARCHAR(100), group_outlet INTEGER, group_outlet_name VARCHAR(100), address TEXT, kelurahan VARCHAR(100), kecamatan VARCHAR(100), kota VARCHAR(100), kdpos VARCHAR(10), kontak VARCHAR(100), hp VARCHAR(20), lat VARCHAR(20), long VARCHAR(20), is_new VARCHAR(1) DEFAULT 'N' )`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.item} (code VARCHAR(10) PRIMARY KEY, name_item VARCHAR(255), image_path VARCHAR(255), status VARCHAR(1), category_id VARCHAR(10), category_desc VARCHAR(200), sub_category_id VARCHAR(10), sub_category_desc VARCHAR(200), image_blob BLOB)`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.itenary} (id INTEGER PRIMARY KEY, id_outlet VARCHAR(10), group_outlet INTEGER, id_user INTEGER, status VARCHAR(1), start_date VARCHAR(30), end_date VARCHAR(30), start_lat VARCHAR(20), start_long VARCHAR(20), end_lat VARCHAR(20), end_long VARCHAR(20), activity_id INTEGER, activity_code VARCHAR(20), reason VARCHAR(100))`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.tx_stok} (id INTEGER PRIMARY KEY, code VARCHAR(10), id_outlet VARCHAR(10), category_id VARCHAR(10), id_user INTEGER, bagus INTEGER, rusak INTEGER, is_sync VARCHAR(1) DEFAULT 'N', date_create DATETIME DEFAULT CURRENT_TIMESTAMP)`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.tx_category} (id_outlet VARCHAR(10), category_id VARCHAR(10), category_desc VARCHAR(200), max_item INTEGER, PRIMARY KEY (id_outlet, category_id))`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.visibility} (id_visibility VARCHAR(10) PRIMARY KEY, id_outlet VARCHAR(10), visibility_desc VARCHAR(200), have_photo VARCHAR(1) DEFAULT 'N')`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.tx_photo} (id INTEGER PRIMARY KEY, id_visibility VARCHAR(10) NOT NULL UNIQUE, id_outlet VARCHAR(10), id_user INTEGER, image_blob BLOB, is_sync VARCHAR(1) DEFAULT 'N', date_create DATETIME DEFAULT CURRENT_TIMESTAMP)`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.tx_survey} (id INTEGER PRIMARY KEY, id_outlet VARCHAR(10), survey_desc VARCHAR(200), id_user INTEGER, is_yes VARCHAR(1) DEFAULT 'N', is_sync VARCHAR(1) DEFAULT 'N' )`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.tx_merchandising} (id INTEGER PRIMARY KEY, code VARCHAR(10), activity_date VARCHAR(50), start_at VARCHAR(50), end_at VARCHAR(50), id_user INTEGER, is_active VARCHAR(1) DEFAULT 'Y' )`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.group_outlet} (id INTEGER PRIMARY KEY, code VARCHAR(10), name VARCHAR(100), max_item INTEGER, planogram BLOB )`,
      []
    );
  }

  async addUser(name: string, uuid: string) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.users} (name, uuid) VALUES('${name}', '${uuid}')`,
        []
      )
      .then(() => {
        return 'user created';
      })
      .catch((e) => {
        if (e.code === 6) {
          return 'user already exist';
        }

        return 'error on creating users ' + JSON.stringify(e);
      });
  }

  async _addData(params: any) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${params.table} (${params.field}) VALUES(${params.value})`,
        []
      )
      .then(() => {
        return true;
      })
      .catch((e) => {
        if (e.code === 6) {
          return 'data already exist';
        }

        return `error on creating data ${params.table} ` + JSON.stringify(e);
      });
  }

  async getUser() {
    return this.databaseObj
      .executeSql(`SELECT * FROM ${this.tables.users} ORDER BY id ASC`, [])
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return 'error on get users ' + JSON.stringify(e);
      });
  }

  async _getData(params: any) {
    return this.databaseObj
      .executeSql(
        `SELECT ${params.select} FROM ${params.table} ${params.where} ${params.order}`,
        []
      )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return `error on get table ${params.table} ` + JSON.stringify(e);
      });
  }

  async deleteUser(id: number) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${this.tables.users} WHERE id= ${id}`, [])
      .then(() => {
        return 'user deleted';
      })
      .catch((e) => {
        return 'error on delete user ' + JSON.stringify(e);
      });
  }

  async _deleteData(params: any) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${params.table} ${params.where}`, [])
      .then(() => {
        return `data ${params.table} deleted`;
      })
      .catch((e) => {
        return `error on delete ${params.table}` + JSON.stringify(e);
      });
  }

  async editUser(id: number, name: string, uuid: string) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.users} SET name='${name}', uuid='${uuid}' WHERE id=${id}`,
        []
      )
      .then(() => {
        return 'user updated';
      })
      .catch((e) => {
        if (e.code === 6) {
          return 'user already exist';
        }

        return 'error on updating user ' + JSON.stringify(e);
      });
  }

  async _editData(params: any) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${params.table} SET ${params.set} WHERE ${params.where}`,
        []
      )
      .then(() => {
        return true;
      })
      .catch((e) => {
        if (e.code === 6) {
          return 'data already exist';
        }

        return `error on updating ${params.table} ` + JSON.stringify(e);
      });
  }
}
