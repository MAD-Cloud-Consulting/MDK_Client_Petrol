import issuedSerialNumberQuery from './SerialNumbersIssuedQuery';

export default function SerialNumbersCount(context) {

    return issuedSerialNumberQuery(context).then((serialNumsArray) => {
        if (serialNumsArray && serialNumsArray.length > 0) {
            return serialNumsArray.length;
        } else {
            return Promise.resolve(0);
        }
    });

}
