import MaterialHeaderButtonVisible from './MaterialHeaderButtonVisible';

export default function MaterialDocItemEditVisible(context) {
    const item = context.getPageProxy().getClientData().item || context.binding;
    return MaterialHeaderButtonVisible(context, true) && item['@sap.isLocal'];
}
