import libVal from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function LAMObjectFromControls(controls) {
    let PointSim = Object.keys(controls).find(control => control.includes('PointSim'));
    let LRPLstPkr = Object.keys(controls).find(control => control.includes('LRPLstPkr'));
    let StartPoint = Object.keys(controls).find(control => control.includes('StartPoint'));
    let EndPoint = Object.keys(controls).find(control => control.includes('EndPoint'));
    let Length = Object.keys(controls).find(control => control.includes('Length'));
    let UOMLstPkr = Object.keys(controls).find(control => control.includes('UOMLstPkr'));
    let MarkerUOMLstPkr =Object.keys(controls).find(control => control.includes('MarkerUOMLstPkr'));
    let Offset1TypeLstPkr = Object.keys(controls).find(control => control.includes('1TypeLstPkr'));
    let Offset1 = Object.keys(controls).find(control => control.includes('offset1'));
    let Offset1UOMLstPkr = Object.keys(controls).find(control => control.includes('Offset1UOMLstPkr'));
    let Offset2TypeLstPkr = Object.keys(controls).find(control => control.includes('2TypeLstPkr'));
    let Offset2 = Object.keys(controls).find(control => control.includes('offset2'));
    let Offset2UOMLstPkr = Object.keys(controls).find(control => control.includes('Offset2UOMLstPkr'));
    let DistanceFromEnd = Object.keys(controls).find(control => control.includes('DistanceFromEnd'));
    let DistanceFromStart = Object.keys(controls).find(control => control.includes('DistanceFromStart'));
    let StartMarkerLstPkr = Object.keys(controls).find(control => control.includes('StartMarkerLstPkr'));
    let EndMarkerLstPkr =Object.keys(controls).find(control => control.includes('EndMarkerLstPkr'));

    if (!libVal.evalIsEmpty(controls[StartPoint].getValue()) && !libVal.evalIsEmpty(controls[EndPoint].getValue())) {
        var lamObj = {
            Point: controls[PointSim].getValue(),
            LRPId: controls[LRPLstPkr].getValue(),
            StartPoint: controls[StartPoint].getValue(),
            EndPoint: controls[EndPoint].getValue(),
            Length: controls[Length].getValue(),
            UOM: libCom.getListPickerValue(controls[UOMLstPkr].getValue()),
            StartMarker: libCom.getListPickerValue(controls[StartMarkerLstPkr].getValue()),
            EndMarker: libCom.getListPickerValue(controls[EndMarkerLstPkr].getValue()),
            DistanceFromStart: controls[DistanceFromStart].getValue(),
            DistanceFromEnd: controls[DistanceFromEnd].getValue(),
            MarkerUOM: libCom.getListPickerValue(controls[MarkerUOMLstPkr].getValue()),
            Offset1Type: libCom.getListPickerValue(controls[Offset1TypeLstPkr].getValue()),
            Offset1: controls[Offset1].getValue(),
            Offset1UOM: libCom.getListPickerValue(controls[Offset1UOMLstPkr].getValue()),
            Offset2Type: libCom.getListPickerValue(controls[Offset2TypeLstPkr].getValue()),
            Offset2: controls[Offset2].getValue(),
            Offset2UOM: libCom.getListPickerValue(controls[Offset2UOMLstPkr].getValue()),
        };
        return lamObj;
    } else {
        return false;
    }
}
