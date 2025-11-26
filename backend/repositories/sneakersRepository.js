import fs from "fs";
import path from "path";

function loadQuery(name) {
    // Carga los SQL desde LA RAIZ del proyecto
    return fs.readFileSync(path.join("sql", name), "utf8");
}

export class SneakersRepository {

    constructor(db) {
        this.db = db;
    }

    async getSneakers() {
        const sql = loadQuery("getSneakers.sql");
        const [rows] = await this.db.execute(sql);
        return rows;
    }

    async getSneakerByMarca(marcaId) {
        const sql = loadQuery("getSneakerByMarca.sql");
        const [rows] = await this.db.execute(sql, [marcaId]);
        return rows;
    }

    async getSneakersByCategory(categoryId) {
        const sql = loadQuery("getSneakersByCategory.sql");
        const [rows] = await this.db.execute(sql, [categoryId]);
        return rows;
    }

    async getSneakersByID(id) {
        const sql = loadQuery("getSneakersByID.sql");
        const [rows] = await this.db.execute(sql, [id]);
        return rows;
    }

    async getSneakersByMarcaAndCategory(marcaId, categoryId) {
        const sql = loadQuery("getSneakersByMarcaAndCategory.sql");
        const [rows] = await this.db.execute(sql, [marcaId, categoryId]);
        return rows;
    }

    async getSneakersByName(name) {
        const sql = loadQuery("getSneakersByName.sql");
        const [rows] = await this.db.execute(sql, [name]);
        return rows;
    }
}
