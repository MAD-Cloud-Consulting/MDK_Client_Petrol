import issuedSerialNumberQuery from '../../Issue/SerialParts/SerialNumbersIssuedQuery';

/**
* Retuns the list of issued serial numbers if already exists from the action binding
* @param {IClientAPI} context
*/
export default function PartReturnSerialNumbersList(context) {

    let binding = context.binding;

    if (binding && binding.serialNumsArray) {
        return binding.serialNumsArray;
    } else {
        return issuedSerialNumberQuery(context);
    }
}
