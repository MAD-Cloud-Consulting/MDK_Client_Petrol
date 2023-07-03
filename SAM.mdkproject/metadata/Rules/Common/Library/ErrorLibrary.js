import Logger from '../../Log/Logger';
import appSettings from './ApplicationSettings';
import libVal from './ValidationLibrary';

export default class {
    
    static getActionResults(context) {
        try {
            return context.actionResults;
        } catch (error) {
            Logger.error('ErrorLibrary - getActionResults', error);
        }
        return '';
    }

    static getErrorResult(context) {
        try {
            return this.getActionResults(context).result;
        } catch (error) {
            Logger.error('ErrorLibrary - getErrorResult', error);
        }
        return '';
    }

    static getError(context) {
        try {
            return this.getErrorResult(context).error;
        } catch (error) {
            Logger.error('ErrorLibrary - getError', error);
        }
        return '';
    }

    static saveError(context, errorMessage) {
        this.setErrorName(context, this.getErrorKey(context));
        this.saveErrorMessage(context, this.getErrorKey(context), errorMessage);
    }

    static clearError(context) {
        appSettings.remove(context, this.getErrorKey(context)+'code');
        appSettings.remove(context, this.getErrorKey(context)+'message');
    }

    static saveErrorMessage(context, key, errorMessage) {
        try {
            appSettings.remove(context, key+'message');
            if (!libVal.evalIsEmpty(errorMessage)) {
                appSettings.setString(context, key+'message', errorMessage);
            } else if (!libVal.evalIsEmpty(this.getError(context).message)) {
                appSettings.setString(context, key+'message', this.getError(context).message);
            }
        } catch (error) {
            Logger.error('ErrorLibrary - saveErrorMessage', error);
        }
    }

    static getErrorMessage(context) {
        try {
            if (!libVal.evalIsEmpty(this.getErrorKey(context)+'message')) {
                return appSettings.getString(context, this.getErrorKey(context)+'message').replace(/\[(.*)\]\s*/g, ''); 
            }
        } catch (error) {
            Logger.error('ErrorLibrary - getErrorMessage', error);
        }
        return '';
    }

    static saveErrorCode(context, key) {
        try {
            appSettings.remove(context, key+'code');
            if (!libVal.evalIsEmpty(context.Error)) {
                appSettings.setString(context, key+'message', context.Error.responseCode);
            } else {
                appSettings.setString(context, key+'message', '001');
            }
            //appSettings.setString(context, key+'code', this.getActionResults(context).result.error.responseCode);
        } catch (error) {
            Logger.error('ErrorLibrary - saveErrorCode', error);
        }
    }

    static getErrorCode(context) {
        try {
            return appSettings.getString(context, this.getErrorKey(context)+'code');
        } catch (error) {
            Logger.error('ErrorLibrary - getErrorCode', error);
        }
        return '';
    }

    static saveErrorType(context) {
        try {
            appSettings.remove(context, this.getErrorKey(context)+'type');
        } catch (error) {
            Logger.error('ErrorLibrary - saveErrorType', error);
        }
    }

    static getErrorType(context) {
        try {
            return appSettings.getString(context, this.getErrorKey(context)+'type');
        } catch (error) {
            Logger.error('ErrorLibrary - getErrorType', error);
        }
        return '';
    }

    static setErrorName(context, key) {
        try {
            appSettings.remove(context, key+'name');
            appSettings.setString(context, key+'name', this.getError(context).name);
        } catch (error) {
            Logger.error('ErrorLibrary - setErrorName', error);
        }
    }

    static getErrorName(context) {
        try {
            return appSettings.getString(context, this.getErrorKey(context)+'name');
        } catch (error) {
            Logger.error('ErrorLibrary - getErrorName', error);
        }
        return '';
    }

    static getErrorKey(context) {
        return context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue();
    }
}
