export default function WorkOrderOperationListViewCaption(context) {

    let caption = context.getClientData();
 
    //If you can't find the PageCaption stored in the clientdata, then use default
    if (!caption || !caption.PageCaption) {
      return context.localizeText('operations');
    } else {
      return caption.PageCaption;
    }
}
