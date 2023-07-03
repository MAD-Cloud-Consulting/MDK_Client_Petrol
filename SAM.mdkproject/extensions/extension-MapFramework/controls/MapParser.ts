import { IContext } from 'mdk-core/context/IContext';
import { IControl } from 'mdk-core/controls/IControl';
import { BaseExtensionParser } from './BaseExtensionParser';
import { ValueResolver} from 'mdk-core/utils/ValueResolver';

const iconsKey = 'Icons';
const tags = 'Tags';
const detailImage = 'DetailImage';
const statusImage = 'StatusImage';
const substatusImage = 'SubstatusImage';
const symbol = 'Symbol';
const selectedSymbol = 'SelectedSymbol';
const queryOptions = 'QueryOptions';
const geometry = 'Geometry';
const action = 'Action';
const expandPrefix = '$expand=';

export class MapParser extends BaseExtensionParser {
    public parse(fromValue: any, context: IContext, key: string): Promise<any> {
        if (fromValue) {
            if (key !== action  && typeof fromValue === 'string' && fromValue.indexOf('/Rules/') >= 0) {
                // This is a rule that should be evaluated
                return ValueResolver.resolveValue(fromValue, context, key !== geometry).then((result) => {
                    return this.createBoundValue(key, result);
                });
            } else if (key === iconsKey) {
                let icons = [];
                fromValue.forEach(icon => {
                    icons.push(super.parseImage(icon));
                });
                return this.createPromiseValue(key, icons);
            } else if (key === tags) {
                let tagArray = [];
                fromValue.forEach(tag => {
                    tagArray.push(super.parseValue(tag, context));
                });
                return this.createPromiseValue(key, tagArray);
            } else if (key === queryOptions) {
                if (fromValue && typeof fromValue === 'string') {
                    let startPos: number = fromValue.indexOf('{');
                    let endPos: number = fromValue.indexOf('}');
                    if (startPos !== -1) {
                        if (!context || !context.binding) {
                            console.error('Failed to parse value of ' + fromValue + 'Context does not have an object');
                        }
                        let sProperty = fromValue.substring(startPos + 1, endPos);
                        let bindValue = context.binding[sProperty];
                        let newValue =   fromValue.substring(0, startPos) 
                                       + bindValue 
                                       + fromValue.substring(endPos + 1, fromValue.length);
                        return this.createPromiseValue(key, newValue);
                    }
                } 
            } else if (key === geometry) {
                try {
                    return this.createPromiseValue(key, 
                                                   this.parseGeometry(context.binding, 
                                                                    fromValue));
                } catch (e) {
                    // TODO: handle this error more appropriately
                    // Not printing because we expect it to happen a lot right now
                }
                return this.createPromiseValue(key, '');
            }
            return this.createPromiseValue(key, super.parseValue(fromValue, context));
        }
        return this.createPromiseValue(key, '');
    }

    protected parseGeometry(object, geometryPath) {
        
        let keyArr = geometryPath.split('/');

        if (keyArr.length === 0) {
            // Return as is
            return geometryPath;
        }

        let workingVal = object;
        let lastKey = keyArr[keyArr.length - 1];

        for (let key of keyArr) {
            workingVal = workingVal[key];
            if (key === lastKey) {
                return workingVal;
            }

            if (Array.isArray(workingVal)) {
                // Grab the first element of an array
                workingVal = workingVal[0];
            }

            if (workingVal === undefined || typeof workingVal !== 'object') {
                // This is a fail condition
                break;
            }
        }
        return '';
    }

    protected getFolderName(): string {
        return 'extension-MapFramework';
    }
};
