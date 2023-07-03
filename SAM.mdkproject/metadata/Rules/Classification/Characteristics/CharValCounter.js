/**
 * CharValueCounter
 * Generate Charactertisic value counter and increment it by +1 everytime
 * it's being called. This will be used in Create action and sequentially
 * assign counter to the characteristics starting from '001'. CharValCountIndex
 * is set to 0 in cleanup function
 * @param context
 * @return CharValueCounter
 */

import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function CharValCounter(context) {
    let charValCountIndex = libCom.getStateVariable(context,'CharValCountIndex');
    let existingCounters = libCom.getStateVariable(context,'ExistingCounters');

    charValCountIndex++;
    libCom.setStateVariable(context,'CharValCountIndex', charValCountIndex);
    //* CharValCounter is a three digit string so we have to convert it from 1 to 001, 19 to 019 etc
    let charValCount = (charValCountIndex < 10) ? '00' + charValCountIndex.toString() : (charValCountIndex < 100) ? '0' + charValCountIndex.toString() : charValCountIndex.toString();
    // If we are creating new values ExistingCounters will be undefined since it's only being set for multiple list picker
    if (!libVal.evalIsEmpty(existingCounters)) {
        while (existingCounters.includes(charValCount)) {
            return CharValCounter(context);
        }
    }
    
    return charValCount;
}
