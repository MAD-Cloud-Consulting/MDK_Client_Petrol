import libVal from '../../../Common/Library/ValidationLibrary';
export default function CharacteristicsCountDecimal(value) {
    if (Math.floor(value) === value) return 0;
    return (!libVal.evalIsEmpty(value.toString().split('.')[1])) ? value.toString().split('.')[1].length || 0 : 0; 
}
