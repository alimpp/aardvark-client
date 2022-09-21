export function restoreClasses(entity: any, classes: any[]): any {
    if (Array.isArray(entity)) {
        return entity.map(property => restoreClasses(property, classes))
    } else if (entity !== null && typeof entity === 'object') {
        const c = classes.find((c: any) => c && c.name === entity.__class)

        if (c) {
            entity = Object.assign(Object.create(c.prototype), entity)
        }

        for (const key in entity) {
            if (Object.prototype.hasOwnProperty.call(entity, key)) {
                entity[key] = restoreClasses(entity[key], classes)
            }
        }

        return entity
    } else {
        return entity
    }
}
