import libVal from '../../Common/Library/ValidationLibrary';

export default function CharacteristicsUOMVisible(formCellContainerProxy) {
   return !libVal.evalIsEmpty(formCellContainerProxy.binding.Characteristic.UoM);
}
