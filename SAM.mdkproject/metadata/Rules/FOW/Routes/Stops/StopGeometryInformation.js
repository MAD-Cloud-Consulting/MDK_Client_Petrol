import {DoGeometryValuesExist} from '../../../Maps/FOW/GeometryValue';

export default function GetTechObjGeometryInformationForStopDetails(context) {
    var binding = context.binding;
    return GetTechObjGeometryInformationForStop(binding, context);
}

export function GetStopOnlyGeometryInformation(context) {
    var binding = context.binding;
    let queryOptions = '$expand=Operation/OperationMobileStatus_Nav,FuncLoc/FuncLocGeometries/Geometry,Equipment/EquipGeometries/Geometry,TechObjects';
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], queryOptions).then(function(stops) {
        return stops.getItem(0);
    });
}

export function GetTechObjGeometryInformationForStop(binding, context) {
    let queryOptions = '$expand=Equip/EquipGeometries/Geometry,FuncLoc/FuncLocGeometries/Geometry';
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/TechObjects', [], queryOptions).then(function(results) {
        let techObjs = [];
        results.forEach((busObj) => {
            if (DoGeometryValuesExist(busObj, 'Equip', 'EquipGeometries')) {
                techObjs.push(busObj.Equip);
            } else if (DoGeometryValuesExist(busObj, 'FuncLoc', 'FuncLocGeometries')) {
                techObjs.push(busObj.FuncLoc);
            }
        });
        return techObjs;
    });
}

export function GetStopGeometryInformation(context) {
    return GetStopOnlyGeometryInformation().then(function(stop) {
        return GetTechObjGeometryInformationForStopDetails(context).then((techObjs) => {
            // if there is no techObjs with Geometries, route stop doesn't need to be added.
            if (techObjs.length > 0) {
                techObjs.push(stop);
            }
            return techObjs;
        });
    });
}
