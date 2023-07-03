import {CreateUpdateFunctionalLocationEventLibrary as libFLOC} from '../../FunctionalLocationLibrary'; 

export default function FLOCHierarchyListPickerOnLoaded(control) {
    let context = control.getPageProxy();
    let superiorId = context.binding ? context.binding.SuperiorFuncLocInternId : '';
    libFLOC.setSuperioir(context, superiorId);
}
