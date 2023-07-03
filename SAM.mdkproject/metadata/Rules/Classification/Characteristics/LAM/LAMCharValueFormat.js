
export default function LAMCharValueFormat(context) {
    let binding = context.binding;

    let expand;
    if (binding.Table.includes('EQUI')) {
        expand = 'MyEquipClassCharValue_Nav';
    } else {
        expand = 'MyFuncLocClassCharValue_Nav';
    }

    return binding[expand].CharValDesc;
}
