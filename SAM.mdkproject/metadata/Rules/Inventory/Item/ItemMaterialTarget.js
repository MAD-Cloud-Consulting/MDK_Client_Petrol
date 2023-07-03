export default function ItemMaterialTarget(context) {
    const item = context.getPageProxy().getClientData().item || context.binding;

    return item.MaterialDocItem_Nav;
}
