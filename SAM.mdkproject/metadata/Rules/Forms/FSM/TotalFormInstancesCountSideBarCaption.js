import libCom from '../../Common/Library/CommonLibrary';

export default function TotalFormInstancesCountSideBarCaption(context) {
    return libCom.getEntitySetCount(context, 'FSMFormInstances', '').then((result) => {
        return context.localizeText('smart_forms_x', [result]);
    });
}
