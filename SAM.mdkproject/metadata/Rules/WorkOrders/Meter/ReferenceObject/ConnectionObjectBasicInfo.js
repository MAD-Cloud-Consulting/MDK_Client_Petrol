

export default function ConnectionObjectBasicInfo(context) {
    return context.binding.FuncLocation_Nav.FuncLocId + ' - ' + context.binding.FuncLocation_Nav.Address.Street;
}
