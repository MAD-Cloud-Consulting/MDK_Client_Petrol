import { MapExtension } from './MapExtension';

export class MapExtensionWithContext extends MapExtension {

    protected readFromContext() {
        return true;
    }

    protected getObjectsFromContext(schema, property): Promise<any> {
        let objects = this.getObjectsToBind(property);
        if (objects && objects.length === 0 && this.isDemoMode()) {
            objects = this.getMockData();
        }

        return this.bindObjectsMatching(schema, objects);
    }

    private bindObjectsMatching(schema, items): Promise<any> {
        return new Promise((resolve, reject) => {
            let aPromises: Promise<any>[] = [];
            for (let item of items) {
                aPromises.push(this.getObject(schema, item));
            }

            return Promise.all(aPromises).then(results => {
                resolve(results);
            });
        });

    }
}
