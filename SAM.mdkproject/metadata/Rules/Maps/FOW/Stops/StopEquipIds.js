import {getTechObjIds} from './GetTechObjIds';

export default function StopEquipIds(context) {
    return getTechObjIds(context, 'Equipment');
}

