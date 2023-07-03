export default class {

    static init(context) {
        this._nativescript = context.nativescript;
    }

    static getNativeScriptObject(context) {
        if (!this._nativescript) {
            this.init(context);
        }
        return this._nativescript;
    }
}
