import { join } from "node:path";

export const DATA_DIR_PATH = join(process.cwd(), "data");
export const RT_DATA_DIR_PATH = join(DATA_DIR_PATH, "rt-data");
export const STATIC_DATA_DIR_PATH = join(DATA_DIR_PATH, "static-data");
export const INDEX_FILE_PATH = join(DATA_DIR_PATH, "index.json");
