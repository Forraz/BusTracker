

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

				console.warn(`Failed to map ${name} to DTO`, {
					...getInfo(entity),
					error: err
				});

				return null;
			}

	}).filter((dto): dto is TDTO => dto != null);

}
