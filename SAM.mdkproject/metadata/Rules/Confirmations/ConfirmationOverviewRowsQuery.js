import ODataDate from '../Common/Date/ODataDate';

/**
* Describe this function...
* Returns query to display Time Records in a range of 14 days with a local Time records included
* @param {IClientAPI} context
*/
export default function ConfirmationOverviewRowsQuery(context) {
    let date = new Date();
    // Add offset to next Sunday
    let offset = 7 - date.getDay();
    let firstDate = date.setDate(date.getDate() + offset);
    let lastDate = date.setDate(date.getDate() - 14);
    let odataFirstDate = new ODataDate(firstDate);
    let odataLastDate = new ODataDate(lastDate);
    return `$filter=PostingDate le ${odataFirstDate.queryString(context, 'date')} and PostingDate ge ${odataLastDate.queryString(context, 'date')} or sap.islocal()&$orderby=PostingDate desc`;
}
