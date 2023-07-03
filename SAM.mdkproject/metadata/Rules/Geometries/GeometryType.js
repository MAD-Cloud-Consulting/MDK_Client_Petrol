
import libVal from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';

export default function GeometryType(context) {
    try {
        let geometry = JSON.parse(context.nativescript.appSettingsModule.getString('Geometry'));
        if (geometry && !libVal.evalIsEmpty(geometry.geometryType)) {
            return geometry.geometryType;
        }
        return '';
    } catch (error) {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMaps.global').getValue(), error);
        return '';
    }
}
