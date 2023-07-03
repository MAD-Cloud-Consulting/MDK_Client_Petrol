import {getTechObjIds} from './GetTechObjIds';

export default function StopFuncLocIds(context) {
    return getTechObjIds(context, 'FuncLocID');
}
