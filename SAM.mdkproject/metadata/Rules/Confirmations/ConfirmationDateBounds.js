import ODataDate from '../Common/Date/ODataDate';

export default function ConfirmationDateBounds(date) {
    /**
     * We need to set offset the filter by the number of hours the client time is offset from system time
     * then set lower and upper bounds for the filter.  PostingDate contains the local Date.  Converting to
     * the DB Date applies the offset and creates the lowerbound for our query.  Upperbound is created by
     * adding 1 day (24 hours) to the lower bound. 
     */
    let bounds = [];
    let odataDate = new ODataDate(date);
    let lowerBound = odataDate.toDBDateTimeString();
    let pt = new Date(odataDate.date());
    let tmp = (new Date(pt)).setDate(pt.getDate()+1);
    let upperBound = (new ODataDate(tmp)).toDBDateTimeString();
    bounds.push(lowerBound);
    bounds.push(upperBound);
    return bounds;
}
