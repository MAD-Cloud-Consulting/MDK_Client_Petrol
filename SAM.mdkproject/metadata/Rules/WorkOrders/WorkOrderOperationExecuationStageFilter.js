export default function WorkOrderOperationExecuationStageFilter(context) {
    return { name: 'OperationCategory', 
            values: [{ReturnValue: 'PRE', DisplayValue: context.localizeText('pre')},
            {ReturnValue: 'MAIN', DisplayValue: context.localizeText('main')},
            {ReturnValue: 'POST', DisplayValue: context.localizeText('post')}],
        };
}
