import GeometryValue from './GeometryValue';

export default function GeometryValueFromPage(context) {
    let clientData = context.getPageProxy().getClientData();
    clientData.GeometryValue = GeometryValue(context);
    return '{#ClientData/GeometryValue}';
}
