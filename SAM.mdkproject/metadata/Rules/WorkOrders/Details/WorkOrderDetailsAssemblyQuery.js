import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderDetailsAssemblyQuery(context) {
    let binding = context.binding ? context.binding.Assembly : undefined;
    if (libVal.evalIsEmpty(binding)) {
        return '$filter=MaterialNum eq ';
    } else {
        return `$filter=MaterialNum eq '${binding}'`;
    }
}
