

export function DoGeometryValuesExist(bindingObj, techObjName, techObjGeoPropertyName) {
    return (bindingObj && bindingObj[techObjName] &&
        bindingObj[techObjName][techObjGeoPropertyName] &&
        bindingObj[techObjName][techObjGeoPropertyName].length > 0 &&
        bindingObj[techObjName][techObjGeoPropertyName][0] &&
        bindingObj[techObjName][techObjGeoPropertyName][0].Geometry &&
        bindingObj[techObjName][techObjGeoPropertyName][0].Geometry.GeometryValue) ?
        true : false;
}
