import ApplicationSettings from './ApplicationSettings';

export default class NetworkMonitoringLibrary {
    constructor() {
        this._instance = null;
        this._callbackActions = {};
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    startNetworkMonitoring(context) {
        const connectivityModule = context.nativescript.connectivityModule;
        connectivityModule.startMonitoring((newConnectionType) => {
            switch (newConnectionType) {
                case connectivityModule.connectionType.wifi:
                case connectivityModule.connectionType.mobile:
                    // filter duplicated events
                    if (ApplicationSettings.getNumber(context, 'LastConnectionType') === connectivityModule.connectionType.none) {
                        for (let action of Object.values(this._callbackActions)) {
                            action();
                        }
                    }
                    break;
                default:
                    break;
            }
            // cache the last connetion type
            ApplicationSettings.setNumber(context, 'LastConnectionType', newConnectionType);
        });
    }

    stopNetworkMonitoring(context) {
        context.nativescript.connectivityModule.stopMonitoring();
    }
    
    addCallbackAction(key, action) {
        this._callbackActions[key] = action;
    }
    
    removeCallbackAction(key) {
        delete this._callbackActions[key];
    }

    static isNetworkConnected(context) {
        const connectivityModule = context.nativescript.connectivityModule;
        switch (connectivityModule.getConnectionType()) {
            case connectivityModule.connectionType.wifi:
            case connectivityModule.connectionType.mobile:
                return true;
            default:
                break;
        }        
        return false;
    }
}
