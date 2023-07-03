import libVal from '../Common/Library/ValidationLibrary';

export default function ServiceOrderServiceContract(context) {

    if (!libVal.evalIsEmpty(context.binding.ContractDesc)) {
        return context.binding.ContractDesc;
    }
    return '-';

}
