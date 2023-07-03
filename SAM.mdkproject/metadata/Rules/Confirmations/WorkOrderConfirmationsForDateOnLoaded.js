export default function WorkOrderConfirmationsForDateOnLoaded(pageProxy) {

    let date = pageProxy.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:PostingDate');
    pageProxy.getClientData().PostingDate = date;
}
