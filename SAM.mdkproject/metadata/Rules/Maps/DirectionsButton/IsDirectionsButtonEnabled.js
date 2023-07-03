/**
* Set enabled for directions button
* @param {IClientAPI} context
* @returns {Boolean}
*/
export default function IsDirectionsButtonEnabled(context) {   
    return context.binding['@odata.type'] !== '#sap_mobile.MyRoute';
}
