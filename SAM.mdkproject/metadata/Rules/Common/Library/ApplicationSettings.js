import Logger from '../../Log/Logger';
import NativeScriptObject from './NativeScriptObject';

export default class {

    static setString(context, key, value) {
        try {
            NativeScriptObject.getNativeScriptObject(context).appSettingsModule.setString(key, value);
        } catch (error) {
            Logger.error('ApplicationSettings - setString', error);
        }
    }

    static setBoolean(context, key, value) {
        try {
            NativeScriptObject.getNativeScriptObject(context).appSettingsModule.setBoolean(key, Boolean(value));
        } catch (error) {
            Logger.error('ApplicationSettings - setBoolean', error);
        }
    }

    static setNumber(context, key, value) {
        try {
            NativeScriptObject.getNativeScriptObject(context).appSettingsModule.setNumber(key, Number(value));
        } catch (error) {
            Logger.error('ApplicationSettings - setNumber', error);
        }
    }

    static getString(context, key, defaultValue = '') {
        try {
            if (NativeScriptObject.getNativeScriptObject(context).appSettingsModule.hasKey(key)) {
                return NativeScriptObject.getNativeScriptObject(context).appSettingsModule.getString(key, defaultValue);
            }
        } catch (error) {
            Logger.error('ApplicationSettings - getString', error);
        }
        return defaultValue;
    }

    static getBoolean(context, key, defaultValue = false) {
        try {
            if (NativeScriptObject.getNativeScriptObject(context).appSettingsModule.hasKey(key)) {
                return NativeScriptObject.getNativeScriptObject(context).appSettingsModule.getBoolean(key, defaultValue);
            }
        } catch (error) {
            Logger.error('ApplicationSettings - getBoolean', error);
        }
        return defaultValue;
    }

    static getNumber(context, key, defaultValue = 0) {
        try {
            if (NativeScriptObject.getNativeScriptObject(context).appSettingsModule.hasKey(key)) {
                return NativeScriptObject.getNativeScriptObject(context).appSettingsModule.getNumber(key, defaultValue);
            }
        } catch (error) {
            Logger.error('ApplicationSettings - getNumber', error);
        }
        return defaultValue;
    }

    static remove(context, key) {
        try {
            if (NativeScriptObject.getNativeScriptObject(context).appSettingsModule.hasKey(key)) {
                NativeScriptObject.getNativeScriptObject(context).appSettingsModule.remove(key);
            }
        } catch (error) {
            Logger.error('ApplicationSettings - remove', error);
        }
    }

    static clear(context) {
        try {
            NativeScriptObject.getNativeScriptObject(context).appSettingsModule.clear();
        } catch (error)  {
            Logger.error('ApplicationSettings - clear', error);
        }
    }
    static hasKey(context, key) {
        try {
            return NativeScriptObject.getNativeScriptObject(context).appSettingsModule.hasKey(key);
        } catch (error) {
            Logger.error('ApplicationSettings - hasKey', error);
        }
        return false;
    }
}
