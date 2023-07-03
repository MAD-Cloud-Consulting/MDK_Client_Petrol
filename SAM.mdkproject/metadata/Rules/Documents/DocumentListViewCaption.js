import documentEntitySet from './DocumentsBDSListEntitySet';
import documentFilter from './DocumentFilter';
export default function DocumentListViewCaption(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', documentEntitySet(context.getControls()[0]),'$expand=Document&$filter=' + documentFilter(context)).then(count => {
        let params=[count];
        context.setCaption(context.localizeText('documents_x', params));
    });
   
}
