import pool from "../services/connect.js";
import { SneakersRepository } from "../repositories/sneakersRepository.js";

// Instancia del repositorio usando la conexión MySQL (pool con promesas)
const sneakersRepository = new SneakersRepository(pool);

export const getSneakers = async () => {
  return await sneakersRepository.getSneakers();
};

export const getSneakerByMarca = async (marca_id) => {
  return await sneakersRepository.getSneakerByMarca(marca_id);
};

export const getSneakersByCategory = async (category_id) => {
  return await sneakersRepository.getSneakersByCategory(category_id);
};

export const getSneakerByMarcaAndCategory = async (marca_id, category_id) => {
  return await sneakersRepository.getSneakersByMarcaAndCategory(
    marca_id,
    category_id
  );
};

export const getSneakersByName = async (name) => {
  return await sneakersRepository.getSneakersByName(name);
};

export const getSneakersById = async (id) => {
  return await sneakersRepository.getSneakersByID(id);
};


