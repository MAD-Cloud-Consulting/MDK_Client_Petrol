import libCommon from '../../Library/CommonLibrary';

export default function CopyFrom(context) {
    return libCommon.getControlValue(libCommon.getControlProxy(context, 'TemplateLstPkr')) || 
        libCommon.getControlValue(libCommon.getControlProxy(context, 'ReferenceLstPkr'));
}
