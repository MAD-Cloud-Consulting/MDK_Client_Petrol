/**
 * Static class that has all of the getter and setter of the global variable
 */
export class ItemCategoryVar {

    static setItemCategories(value) {
        this._globalItemCategories = value;
    }

    static getItemCategories() {
        return this._globalItemCategories;
    }
}
