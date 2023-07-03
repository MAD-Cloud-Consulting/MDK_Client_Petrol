import prtItemCounter from './PRTItemCounter';

/**
* Generates ItemCounterChar
* @param {IClientAPI} context
*/
export default function PRTItemCounterChar(context) {

    return prtItemCounter(context).then((itemCounter) => {
        if (itemCounter) {
            return `C${itemCounter}`;
        } else {
            return '';
        }
    });
}
