import { BaseObservable } from 'mdk-core/observables/BaseObservable';
import { IContext } from 'mdk-core/context/IContext';
import { Context } from 'mdk-core/context/Context';
import { IControl } from 'mdk-core/controls/IControl';
import { IDefinitionProvider } from 'mdk-core/definitions/IDefinitionProvider';
import { PropertyTypeChecker } from 'mdk-core/utils/PropertyTypeChecker';
import { I18nHelper } from 'mdk-core/utils/I18nHelper';
import { TargetPathInterpreter } from 'mdk-core/targetpath/TargetPathInterpreter';
import { Utils } from './Utils';
import { EventHandler } from 'mdk-core/EventHandler';

export class BaseExtensionParser {
    public static TARGET_TYPE = {
        EntitySet: 'EntitySet',
        KeyProperties: 'KeyProperties',
        Properties: 'Properties',
        QueryOptions: 'QueryOptions',
        Service: 'Service',
    };

    protected _formatPattern = /#format:(.+)}/i;
    protected _target: any;

    public bind(fromValue: any, context: IContext, bTwoWay: boolean, key: string): Promise<any> {
        return this.parse(fromValue, context, key);
    }

    public parse(fromValue: any, context: IContext, key: string): Promise<any> {
        // Do nothing. Sub classes must override this
        return this.createPromiseValue(key, fromValue);
    }

    public parseImage(value: string): any {
        let defProvider = IDefinitionProvider.instance();
        try {
            return defProvider.getDefinition(value);
        } catch (e) {
            return value;
        }
    }

    public parseValue(value: any, context: IContext): any {
        if (value && typeof value === 'string') {
            try {
                // Need to cast back to <any> as an es5 work around
                if ((<any> (value)).indexOf('{') >= 0) {
                    if (!context || !context.binding) {
                        throw new Error('Context does not have an object');
                    }
                    // Replace binding values
                    value = this.getValueFromMultipleBinding(value, context);
                }
                if ((<any> (value)).indexOf('$(') >= 0) {
                    value = this.localizeValue(context, value);
                } else if ((<any> (value)).includes('/Globals/')) {
                    try {
                        let constValue = IDefinitionProvider.instance().getDefinition(value);
                        value = constValue.getValue();
                        value = Utils.toString(value);

                    } catch (error) {
                        console.log(error);
                    }
                } else if (PropertyTypeChecker.isTargetPath(value)) {
                    return new TargetPathInterpreter(context).evaluateTargetPathForValue(value);
               }
            } catch (e) {
                // If there's any error, just return an empty string. That way the error
                // doesn't prevent an entire page from loading.
                console.error(e);
                console.error('Failed to parse value of ' + value + '.');
                return '';
            }
        }
        return value;
    }

    /**
     * Bind multiple values in a string from context
     * @param value - string possibly containing binding keys
     * @param context - Context containing object with binding values
     */
    public getValueFromMultipleBinding(value: string, context: IContext) {
        let regex = /{(.+?)}/g;
        let match;
        let results = [];
        for (match = regex.exec(value); match; match = regex.exec(value)) {
          let bindValue = context.binding[match[1]];
          value = value.replace(match[0], bindValue);
          // Change the last index to account for difference in 
          // Length of key being replaced and value replacing it
          regex.lastIndex -= match[0].length;
          if (bindValue) {
              regex.lastIndex += bindValue.length;
          }
        }
        return value; 
    }

     public getFormatRule(value): any {
        let formatRule;
        if (value) {
            let format = value.match(this._formatPattern);
            if (format && format.length === 2) {
                formatRule = format[1];
            }
        }
        return formatRule;
    }

    public applyFormat(formatRule, value, context, key): Promise<any> {
        const eventHandler = new EventHandler();
        let clientData = context.clientData;
        clientData.value = value;
        clientData.context = context; 
        if (formatRule) {
            return new Promise((resolve, reject) => {
                eventHandler.executeActionOrRule(formatRule, context).then(result => {
                    resolve(this.createBoundValue(key, result));
                });
            });
        }

        return Promise.reject('Invalid type');
    }

    /**
     * 
     * @param context - calling context
     * @param mValue - value to localize in $(S, V, ...) format where S is localizing strategy,
     *                 v is value, and remaining parameters are arguments
     */
    public localizeValue(context: IContext, mValue: string) {

        while (true) {
            let startIndex = mValue.indexOf('$(');
            if (startIndex < 0) {
                break;
            }

            let endIndex = mValue.indexOf(')', startIndex);
            if (endIndex < 0) {
                break;
            }

            // Substring the pieces
            let start = mValue.substring(0, startIndex);
            // Get the replacement string, minus the '$(' and ')'
            let replace = mValue.substring(startIndex + 2, endIndex);
            let end = mValue.substring(endIndex + 1);

            let pieces = replace.split(',').map(item => {
                return item.trim();
            });
            let type = pieces.shift();
            let i18nKey = pieces.shift();
            let localized = this.localize(context, type, i18nKey, pieces);

            // Piece the expression back together
            mValue = start + localized + end;
        }

        return mValue;
    }

    public bindParameters(object, params): Promise<any> {
        let context: Context = new Context(object);
        let aPromises: Promise<any>[] = [];
        if (params) {
            Object.keys(params).forEach(sKey => {
                let value = params[sKey];
                if (value) {
                    if (typeof (value) !== 'object') {
                        aPromises.push(this.bind(value, context, false, sKey));
                    } else {
                        aPromises.push(this.bindParameters(object, value));
                    }
                }
            });
        }
        return new Promise((resolve, reject) => {
            return Promise.all(aPromises).then(results => {
                for (let result of results) {
                    let key = result.key;
                    if (key) {
                        params[key] = result.value;
                    }
                }
                resolve(params);
            });
        });
    }
    
    public setTarget(target) {
        this._target = target;
    }

    public getExtensionLocalizedValue(key, params, context): any {
        return I18nHelper.localizeExtensionText(key, this.getFolderName(), params, context);
    }

    protected getFolderName(): string {
        return '';
    }

    protected localize(context, type, i18nKey: string, args) {
        let localized = undefined;
        switch (type) {

            case 'L':
                if (args.length > 0) {
                    localized = context.clientAPI.localizeText(i18nKey, args);
                } else {
                    localized = context.clientAPI.localizeText(i18nKey);
                }
                break;
            default:
                // TODO: localize numbers ?
                break;
        }

        if (localized === i18nKey) {
            // Localization didn't occur
            switch (type) {
                case 'L':
                    localized = I18nHelper.localizeExtensionText(i18nKey, this.getFolderName(), args, context);
                    break;
                default:
                    // TODO: localize numbers ?
                    break;
            }
        }

        if (localized === undefined) {
            return i18nKey;
        }

        return localized;
    }

    protected createPromiseValue(key, value): Promise<any> {
        return Promise.resolve(this.createBoundValue(key, value));
    }

    protected createBoundValue(key, value): any {
        let boundValue = {key, value};
        return boundValue;
    }

    protected parseObject(path, data, property) {
        let array = path.split('/');
        if (data && array) {
            for (let item of array) {
                if (data && data.hasOwnProperty(item)) {
                    data = data[item];
                    if (data instanceof Array) {
                        data = data[0]; // Always pick first element for now. 
                    }
                }
            }
            if (property && typeof property === 'string') {
                let startPos: number = property.indexOf('{');
                let endPos: number = property.indexOf('}');
                if (startPos !== -1) {
                    property = property.substring(startPos + 1, endPos);
                }
            }
            // if results from BE is not filtered data might be null
            if (data && data.hasOwnProperty(property)) {
                return data[property];
            }
        }
        return '';
    }

    protected getTargetProperty(type) {
        switch (type) {
            case BaseExtensionParser.TARGET_TYPE.EntitySet:
                return this._target.EntitySet;
            case BaseExtensionParser.TARGET_TYPE.Service:
                return this._target.Service;
            case BaseExtensionParser.TARGET_TYPE.QueryOptions:
                return this._target.QueryOptions;
            case BaseExtensionParser.TARGET_TYPE.Properties:
                return this._target.Properties;
            case BaseExtensionParser.TARGET_TYPE.KeyProperties:
                return this._target.KeyProperties;
            default:
                return this._target;
        }
    }
}
