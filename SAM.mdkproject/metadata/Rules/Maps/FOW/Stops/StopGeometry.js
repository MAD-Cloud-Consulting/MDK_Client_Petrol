import {DoGeometryValuesExist} from '../GeometryValue';

export default function StopGeometry(context) {
    let bindingObj = context.binding;
    if (DoGeometryValuesExist(bindingObj, 'FuncLoc', 'FuncLocGeometries')) {
        return bindingObj.FuncLoc.FuncLocGeometries[0].Geometry.GeometryValue;
    } else {
        return DoGeometryValuesExist(bindingObj, 'Equipment', 'EquipGeometries') ? 
            bindingObj.Equipment.EquipGeometries[0].Geometry.GeometryValue : '';
    }
}

