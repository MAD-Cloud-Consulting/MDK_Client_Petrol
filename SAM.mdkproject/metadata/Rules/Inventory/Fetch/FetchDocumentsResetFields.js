import defaultDocTypes from './DefaultDocumentTypes';
import defaultPlant from './SetDefaultPlant';

export default function FetchDocumentsResetFields(context) { //Reset the fetch screen fields to default values
    let formCellContainer = context.getPageProxy().getControl('FormCellContainer') ;  
    let documentId = formCellContainer.getControl('DocumentId');
    let documentTypeListPicker = formCellContainer.getControl('DocumentTypeListPicker');
    let dateRangeSwitch = formCellContainer.getControl('DateRangeSwitch');
    let startDate = formCellContainer.getControl('StartDate');
    let endDate = formCellContainer.getControl('EndDate');
    let plantLstPkr = formCellContainer.getControl('PlantLstPkr');

    documentId.setValue('');
    documentTypeListPicker.setValue(defaultDocTypes(context));
    dateRangeSwitch.setValue(false);
    startDate.setValue(new Date());
    endDate.setValue(new Date());
    plantLstPkr.setValue(defaultPlant(context));
}
