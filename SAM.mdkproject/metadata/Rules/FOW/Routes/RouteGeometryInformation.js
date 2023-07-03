import {DoGeometryValuesExist} from '../../Maps/FOW/GeometryValue';

export default function GetTechObjectGeometryInformationForRoute(context, routeID) {
    let queryOptions = `$expand=FuncLoc/FuncLocGeometries/Geometry,Equip/EquipGeometries/Geometry&$filter=RouteID eq '${routeID}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyTechObjects', [], queryOptions).then(function(results) {
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

export function GetStopGeometryInformationForRoute(binding, context) {
    let queryOptions = '$expand=FuncLoc/FuncLocGeometries/Geometry,Equipment/EquipGeometries/Geometry,TechObjects,Operation/OperationMobileStatus_Nav&$filter=FuncLoc/FuncLocGeometries/any(fg:sap.entityexists(fg/Geometry)) or Equipment/EquipGeometries/any(eg:sap.entityexists(eg/Geometry))';
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/Stops', [], queryOptions).then(function(results) {
        let stops = [];
        results.forEach((stop) => {
            stops.push(stop);
        });
        return stops;
    });
}

export function GetRouteGeometryInformationForDetails(context) {
    var binding = context.binding;
    return GetRouteGeometryInformation(binding, context);
}

export function GetRouteGeometryInformation(binding, context) {
    let queryOptions = '$expand=Stops,WorkOrder/OrderMobileStatus_Nav,WorkOrder/WOPriority';
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], queryOptions).then(function(routes) {
        let busObjs = [];
        let route = routes.getItem(0);
        return GetStopGeometryInformationForRoute(binding, context).then((stops) => {
            busObjs = busObjs.concat(stops);
            return GetTechObjectGeometryInformationForRoute(context, route.RouteID).then((techObjs) => {
                if (techObjs.length > 0) {
                    busObjs.push(route);
                }
                return busObjs.concat(techObjs);
            });
        });
    });
}
