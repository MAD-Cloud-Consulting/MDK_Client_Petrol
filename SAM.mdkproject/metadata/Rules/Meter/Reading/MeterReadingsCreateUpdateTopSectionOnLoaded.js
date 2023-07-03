import Stylizer from '../../Common/Style/Stylizer';
import updateCaption from './MeterReadingUpdateCaption';
import libCom from '../../Common/Library/CommonLibrary';

export default function MeterReadingsCreateUpdateTopSectionOnLoaded(pageProxy) {

    if (libCom.getStateVariable(pageProxy, 'METERREADINGOBJ')) {
        pageProxy._context.binding = libCom.getStateVariable(pageProxy, 'METERREADINGOBJ');
    }

    let stylizer = new Stylizer(['GrayText']);

    let serialNumber = pageProxy.getControl('SerialNumber');
    let deviceCategory = pageProxy.getControl('DeviceCategory');

    stylizer.apply(serialNumber, 'Value');
    stylizer.apply(deviceCategory, 'Value');

    updateCaption(pageProxy);
}
