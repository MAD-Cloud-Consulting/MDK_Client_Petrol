/**
   * Get the characteristics default values
   * 
   * @param {} context
   * 
   * @returns {Array} returns an array of all the characteristic
   * 
   */
  import libVal from '../../Common/Library/ValidationLibrary';

  
  export default function CharacteristicsDefaultValues(context) {
      //if the context is EquipClass
      return libVal.evalIsEmpty(context.binding.Characteristic.ClassCharacteristics) ? context.binding.Characteristic.CharacteristicValues : context.binding.Characteristic.ClassCharacteristics[0].Characteristic.CharacteristicValues;
  }
