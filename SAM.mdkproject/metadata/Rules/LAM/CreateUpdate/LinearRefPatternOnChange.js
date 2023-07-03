
import libCom from '../../Common/Library/CommonLibrary';


export default function LinearRefPatternOnChange(context) {

        let pageProxy = context.getPageProxy();
        let formCellContainer = pageProxy.getControl('FormCellContainer');

        let lrpPickerValue = libCom.getListPickerValue(formCellContainer.getControl('LRPLstPkr').getValue());
        let startMarkerControl = formCellContainer.getControl('StartMarkerLstPkr');
        let startMarkerSpecifier = startMarkerControl.getTargetSpecifier();
        let endMarkerControl = formCellContainer.getControl('EndMarkerLstPkr');
        let endMarkerSpecifier = endMarkerControl.getTargetSpecifier();

        startMarkerSpecifier.setQueryOptions("$orderby=Marker&$filter=(LRPId eq '" + `${lrpPickerValue}` + "')");
        startMarkerControl.setTargetSpecifier(startMarkerSpecifier);

        endMarkerSpecifier.setQueryOptions("$orderby=Marker&$filter=(LRPId eq '" + `${lrpPickerValue}` + "')");
        endMarkerControl.setTargetSpecifier(endMarkerSpecifier);

}
