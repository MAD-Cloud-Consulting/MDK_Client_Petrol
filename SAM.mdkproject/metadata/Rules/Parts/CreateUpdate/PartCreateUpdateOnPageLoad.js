import libCom from '../../Common/Library/CommonLibrary';
import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';

export default function PartCreateUpdateOnPageLoad(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    hideCancel(context);
    style(context, 'DiscardButton');

    let isMultipleTechnician = EnableMultipleTechnician(context);
    const textCategory = libCom.getAppParam(context, 'PART', 'TextItemCategory');
    const partCategoryValue = context.evaluateTargetPath('#Control:PartCategoryLstPkr').getValue()[0].ReturnValue;
    const caption = context.localizeText(libCom.IsOnCreate(context) ? 'add_part' : 'edit_part');

    context.setCaption(caption);

    if (partCategoryValue === textCategory) {
        // Disable Stock Item pickers
        context.evaluateTargetPath('#Control:MaterialLstPkr').setVisible(false);
        context.evaluateTargetPath('#Control:MaterialUOMLstPkr').setVisible(false);
        if (!isMultipleTechnician) {
            context.evaluateTargetPath('#Control:StorageLocationLstPkr').setVisible(false);
            context.evaluateTargetPath('#Control:UOMSim').setVisible(false);
    
            // Enable Text Picker items
            context.evaluateTargetPath('#Control:TextItemSim').setVisible(true);
        }
        
    }
    libCom.saveInitialValues(context);
}
