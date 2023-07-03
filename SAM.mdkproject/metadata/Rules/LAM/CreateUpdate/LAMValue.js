
import libLocal from '../../Common/Library/LocalizationLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function(context, value) {

    return (!libVal.evalIsEmpty(value)) ? libLocal.toNumber(context,value,'',false).toString() : '';
}
