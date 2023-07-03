/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import libBase64 from '../Common/Library/Base64Library';
import isAndroid from '../Common/IsAndroid';
import libDigSig from '../DigitalSignature/DigitalSignatureLibrary';

export default function AddPasscodeOnLoaded(context) {
    var aPromises = [];
    let noteId = '';
    let noteDesc = '';
    if (context.evaluateTargetPath('#Page:CreateDigitalSignature/#Control:remark/#Value').length > 0) {
        noteId = context.evaluateTargetPath('#Page:CreateDigitalSignature/#Control:remark/#SelectedValue');
        aPromises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'DigitalSignatureNotes', [], "$filter=NoteId eq '" + noteId + "'"));
    } 

    if (aPromises.length > 0) {
        return Promise.all(aPromises).then(results => {
            if (results) {
                if (results[0]) {
                    noteId = results[0].getItem(0).NoteId;
                    noteDesc = results[0].getItem(0).NoteDescription;
                }
                saveSignatureParamsInClientData(context, noteDesc, noteId);
            }
        });
    } else {
        return saveSignatureParamsInClientData(context, noteDesc, noteId);
    }
}

export function saveSignatureParamsInClientData(context, noteDesc, noteId) {
    let clientData = context.getClientData();

    return libDigSig.readConfiguration(context).then(config =>{
        let objectConfig = config.ObjectConfig;
        let tableFields = objectConfig ? objectConfig.TableFields : '';
        let fields = tableFields.split(',');
        let objson = '{';
        for (var i = 0; i < fields.length; i++) {
            if (fields[i] === 'OBJNR') {
                objson = objson.concat('\"OBJNR\":\"' + context.binding.ObjectNumber + '\"');
                clientData.DigitalSignatureDocumentBin = context.binding.ObjectNumber;
            } else if (fields[i] === 'QMART') { // NotificationType
                objson = objson.concat('\"QMART\":\"' + context.binding.NotificationType + '\"');
            } else if (fields[i] === 'QMNUM') { // NotificationNumber
                objson = objson.concat('\"QMNUM\":\"' + context.binding.NotificationNumber + '\"');
                clientData.DigitalSignatureDocumentBin = context.binding.NotificationNumber;
            }
            if (i === fields.length-1) {
                objson = objson.concat('}');
            } else {
                objson = objson.concat(', ');
            }
        }
        var objBase64encoded = libBase64.transformStringToBase64(isAndroid(context), objson);
    
        // set properties that are coming from configuration
        clientData.SigningApplication = objectConfig ? objectConfig.Application : '';//'EAM_OP';
        clientData.SigningApplicationSubObject = objectConfig ? objectConfig.Object : '';//'EAM_OB';
        clientData.DigitalSignatureStrategy = config.Strategy;//'TOTP_2E';
        clientData.DigitalSignatureType = config.SignatureType;//'A';
        clientData.SigningApplicationMetadataBin = objBase64encoded;
        clientData.DigitalSignatureProcessID = '';
        //concatenate application, object (application object), strategy and timestamp
        clientData.ApplicationObjectSignKey = clientData.SigningApplication + 
                                                    clientData.SigningApplicationSubObject + 
                                                    clientData.DigitalSignatureStrategy + 
                                                    clientData.DigitalSignatureType +
                                                    Date.now(); 
        
        clientData.DigitalSignatureUser = libCom.getSapUserName(context);
        clientData.DSgntrAuthorizationGroup = 'TOTP_2E';
        /* eslint-disable no-unused-expressions */ //fix for checkmarx scan issue on Client_server_empty_password
        clientData.DSgntrUserPassword;
        clientData.DigitalSignatureMethod = config.Method;//'T';
        
        clientData.DigitalSignatureNoteDesc = noteDesc;
        clientData.DigitalSignatureNoteID = noteId;
        clientData.DSgntrDocContentType = 'T';
        var comment = context.evaluateTargetPath('#Page:CreateDigitalSignature/#Control:comment/#Value');
        if (libVal.evalIsEmpty(comment)) {
            comment = '';
        }
        clientData.DSgntrSignatoryComment = comment;
    });
}
