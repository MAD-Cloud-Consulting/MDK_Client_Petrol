import IsAndroid from '../Common/IsAndroid';

/**
 * Adds page elements to the user profile page based on the platform.
 * @param {IClientAPI} clientAPI
 */

export default function AddPlatformBasedElements(clientAPI) {
    var page = clientAPI
        .getPageProxy()
        .getPageDefinition(
            '/SAPAssetManager/Pages/User/UserProfileSettings.page'
        );
    if (IsAndroid(clientAPI)) {
        addAndroidOnlyElements(page);
    } else {
        addIOSOnlyElements(page);
    }
    return page;
}

function addAndroidOnlyElements(page) {
    addAndroidButtonTable(page);
    addAndroidToolbar(page);
}

function addAndroidToolbar(page) {
    var toolbar = page.ToolBar;
    toolbar.Items = [];
    toolbar.Items.push(
        {
            _Name: 'LogOutButton',
            _Type: 'Control.Type.ToolbarItem',
            Caption: '$(L,logout)',
            ItemType: 'Normal',
            OnPress: '/SAPAssetManager/Rules/Common/LogOutAlertAction.js',
            Visible: '/SAPAssetManager/Rules/UserProfile/IsLogOutVisible.js',
        },
        {
            _Name: 'FlexibleSpacCenterTbI',
            _Type: 'Control.Type.ToolbarItem',
            SystemItem: 'FlexibleSpace',
        },
        {
            _Name: 'ProfileResetButton',
            _Type: 'Control.Type.ToolbarItem',
            ItemType: 'Button',
            Caption: '$(L,reset)',
            OnPress: '/SAPAssetManager/Rules/Common/ResetAlertAction.js',
        }
    );
}

function addAndroidButtonTable(page) {
    page.Controls[0].Sections.push({
        Header: {
            UseTopPadding: false,
            Caption: '/SAPAssetManager/Rules/Sync/LastSyncCaption.js',
        },
        Buttons: [
            {
                Title: '$(L,sync)',
                Style: 'FormCellButton',
                OnPress:
                    '/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnSync.js',
                TextAlignment: 'right',
            },
            {
                Title: '$(L,check_app_update)',
                Style: 'FormCellButton',
                OnPress: '/SAPAssetManager/Rules/Common/BeforeAppUpdate.js',
                TextAlignment: 'right',
            },
        ],
        _Type: 'Section.Type.ButtonTable',
    });
}

function addIOSOnlyElements(page) {
    page.Controls[0].Sections.push(
        {
            Footer: {
                Caption: '/SAPAssetManager/Rules/Sync/LastSyncCaption.js',
                FooterStyle: 'help',
                UseBottomPadding: false,
            },
            Buttons: [
                {
                    Title: '$(L,sync)',
                    Style: 'FormCellButton',
                    OnPress:
                        '/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnSync.js',
                    TextAlignment: 'center',
                },
            ],
            _Type: 'Section.Type.ButtonTable',
        },
        {
            Header: {
                UseTopPadding: false,
            },
            Buttons: [
                {
                    Title: '$(L,check_app_update)',
                    Style: 'FormCellButton',
                    OnPress:
                        '/SAPAssetManager/Rules/Common/BeforeAppUpdate.js',
                    TextAlignment: 'center',
                },
            ],
            _Type: 'Section.Type.ButtonTable',
        },
        {
            Header: {
                UseTopPadding: false,
            },
            Buttons: [
                {
                    Title: '$(L,logout)',
                    Style: 'FormCellButton',
                    OnPress:
                        '/SAPAssetManager/Rules/Common/LogOutAlertAction.js',
                    Visible:
                        '/SAPAssetManager/Rules/UserProfile/IsLogOutVisible.js',
                    TextAlignment: 'center',
                },
            ],
            _Type: 'Section.Type.ButtonTable',
        },
        {
            Header: {
                UseTopPadding: false,
            },
            Buttons: [
                {
                    Title: '$(L,reset)',
                    Style: 'ResetRed',
                    OnPress:
                        '/SAPAssetManager/Rules/Common/ResetAlertAction.js',
                    TextAlignment: 'center',
                },
            ],
            _Type: 'Section.Type.ButtonTable',
        }
    );
}
