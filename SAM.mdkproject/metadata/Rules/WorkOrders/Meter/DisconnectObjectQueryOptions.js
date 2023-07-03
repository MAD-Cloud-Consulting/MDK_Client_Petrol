import libVal from '../../Common/Library/ValidationLibrary';

export default function DisconnectObjectQueryOptions(context) {
    let searchString = context.searchString;
    let qob = context.dataQueryBuilder();
    let type = context.binding.OrderISULinks[0].ISUProcess;
    let titleSearch = '';
    let footnoteSearch = '';
    
    if (!libVal.evalIsEmpty(searchString)) {
        titleSearch = 'substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/Device)) or substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/DeviceCategory_Nav/Description))';
        footnoteSearch = 'substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/RegisterGroup_Nav/Division)) or substringof(\'' + searchString.toLowerCase() + '\', tolower(Device_Nav/RegisterGroup_Nav/Division_Nav/Description))';
    }

    qob.expand('DisconnectDoc_Nav,DisconnectActivity_Nav/WOHeader_Nav/OrderISULinks,Device_Nav/DeviceCategory_Nav/Material_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,Device_Nav/DeviceLocation_Nav');

    let filterString = `DisconnectActivity_Nav/OrderId eq '${context.binding.OrderId}' and DisconnectActivity_Nav/ActivityType eq '${type === 'DISCONNECT' ? '01' : type === 'RECONNECT' ? '03' : '00'}'`;
    if (!libVal.evalIsEmpty(searchString)) {
        filterString += `and (${titleSearch} or ${footnoteSearch})`;
    }
    qob.filter(filterString);

    return qob;
}
