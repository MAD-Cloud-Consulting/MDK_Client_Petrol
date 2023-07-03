import validation from './Library/ValidationLibrary';

/**
 * @param {Number} value Integer number to be padded
 * @param {String} padString a string with which the output will be padded. For instance: a 6-digit zero-padded output will require the string "000000" in this field
 * @param {String?} prefix an optional prefix to prepend to the output
 */

function PadNumber(value, padString, prefix = '') {
    let valueStr = value.toString();
    return prefix + padString.substring(0, padString.length - valueStr.length) + valueStr;
}

/**
 * Generates a given local ID according to given parameters
 * @param {*} context a SEAM context - used for read() operations
 * @param {String} entitySet the Entity Set we are generating a temp ID for. This can be a proper set (MyWorkOrderHeaders, MyNotificationHeaders) or a ReadLink (binding['odata.id']/Operations)
 * @param {String} property the key property containing the ID for the given Entity Set. For instance: OrderID, NotificationNumber
 * @param {String} padString a string of zeros for padding the resulting ID.
 * @param {String?} queryOpts additional query options, i.e. $filter=startswith(NotificationNumber,'LOCAL') eq true
 * @param {String?} prefix optional prefix for generated ID, i.e. 'LOCAL_'
 * @param {String?} sortProperty optional alternate orderby property
 * @param {Number?} increment increment over the last existing ID
 */

export function GenerateLocalIDWithChangeSetIncrement(context, entitySet, property, padString, queryOpts = '', prefix, sortProperty, increment) {
    if (!validation.evalIsEmpty(queryOpts)) {
        queryOpts = '&' + queryOpts;
    }
    if (validation.evalIsEmpty(sortProperty)) {
        sortProperty = property;
    }
    return context
        .read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], `$select=${property}&$orderby=${sortProperty} desc&$top=1` + queryOpts)
        .then(function(result) {
            // If we have more than zero entries already...
            if (!validation.evalIsEmpty(result)) {
                let newID = parseInt(result.getItem(0)[property].substring(prefix.length));
                // Pad the output. Prepend LOCAL_ if it's a header, and use appropriate padding based on whether or not this is a header
                return PadNumber(newID + increment, padString, prefix);
                // Else we have zero entries and we're adding the first one
            } else {
                // Pad the output. Prepend LOCAL_ if it's a header, and use appropriate padding based on whether or not this is a header
                return PadNumber(increment, padString, prefix);
            }
        });
}
