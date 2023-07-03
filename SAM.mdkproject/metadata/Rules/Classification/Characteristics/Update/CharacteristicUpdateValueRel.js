/**
   * Get the ValueRel value from the appropriate control.
   * 
   * @param {} context
   * 
   * @returns {string} returns the appropriate value.
   * 
   */
  import libCom from '../../../Common/Library/CommonLibrary';
  import libVal from '../../../Common/Library/ValidationLibrary';

  import deAssembleReturnValues from '../CharacteristicDeAssembleReturnValue';

  export default function CharacteristicUpdateValueRel(context) {
    var controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    let isListPicker = libCom.getStateVariable(context,'ListPicker');
    let isMultiListPicker = libCom.getStateVariable(context,'MultiListPicker');
    var control = libCom.getControlProxy(context, controlName);
    if (controlName !== 'CharacterSingleValue' && controlName !== 'CharacterMultipleValue' && controlName !== 'CharacterFreeForm' ) {
      if (isListPicker) {
        return deAssembleReturnValues(control.getValue()[0].ReturnValue, 'ValueRel');
      } else if (isMultiListPicker) {
        let multiPickerIndex = libCom.getStateVariable(context,'ListPickerLoopIndex');
        return deAssembleReturnValues(control.getValue()[multiPickerIndex-1].ReturnValue, 'ValueRel');
      } else {
        return libVal.evalIsEmpty(context.binding.ValueRel) ? '1' : context.binding.ValueRel;
      }
    } else {
      return '1';
    }
  }

