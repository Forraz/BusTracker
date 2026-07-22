import { logger } from "../utils/logger.js";


export function mapManyToDTO<TEntity, TDTO>(

	entities: TEntity[],
	mapper: (entity: TEntity) => TDTO,
	name: string,
	getInfo: (entity: TEntity) => {}

): TDTO[] {

	return entities.map((entity) => {

			try {

				return mapper(entity);

			} catch (err) {

				logger.warn({
					...getInfo(entity),
					...{ err }
				}, `Failed to map ${name} to DTO`);

				return null;
			}

	}).filter((dto): dto is TDTO => dto != null);

}
