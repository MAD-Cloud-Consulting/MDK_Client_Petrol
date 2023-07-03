import { BaseControl } from 'mdk-core/controls/BaseControl';
import { ButtonStack } from './ButtonStackPlugin/ButtonStack'
import { Application, Device } from '@nativescript/core';

export class ButtonStackClass extends BaseControl {
  private _buttonContainer: ButtonStack;

  public initialize(props) {
    super.initialize(props);
    this.definition().data.OnPress = undefined;

    this.createButtons();
    this.setView(this._buttonContainer.getView());
  }

  private createButtons() {    
    this._buttonContainer = new ButtonStack(this.androidContext());

    let buttonData = [];

    //Set the button stack's properties if "ExtensionProperties" is defined
    let extProps = this.definition().data.ExtensionProperties;
    if (extProps) {
      if (extProps.Buttons) {
        for (let index = 0; index < extProps.Buttons.length; index++) {
          let button = extProps.Buttons[index];
          buttonData.push(JSON.parse(JSON.stringify(button)));
        }

        let titlePromises = [];
        let editablePromises = [];

        for (let index = 0; index < buttonData.length; index++) {
          let button = buttonData[index];
          // Resolve title's value
          titlePromises.push(this.valueResolver().resolveValue(button.Title, this.context, true));
          editablePromises.push(this.valueResolver().resolveValue(button.IsEditable, this.context, true));
        }

        Promise.all(titlePromises).then(results => {
          for (let index = 0; index < results.length; index++) {
            const title = results[index];
            buttonData[index].Title = title;
          }
          Promise.all(editablePromises).then(results=> {
            for (let index = 0; index < results.length; index++) {
              const isEditable = results[index];
              buttonData[index].IsEditable = isEditable;
            }
            for (let index = 0; index < buttonData.length; index++) {
              this._buttonContainer.addButton(buttonData[index]);
            }
            if (Application.ios && Device.deviceType === 'Tablet') {
              // add a dummy button for iPad- workaroud for spacing
              let data = {"Title": "", "IsEditable": true};
              this._buttonContainer.addButton(data);
            }
          });
        });
      }
    }

    this._buttonContainer.initNativeView();

    //Set up listener for ButtonStack's OnMyButtonClick event that will be triggered when user clicks one of the buttons
    this._buttonContainer.on("OnMyButtonClick", function(eventData){
      //We will call the setValue
      if (eventData.value.OnPress) {
        return this.executeAction(eventData.value.OnPress);
      }      
    }.bind(this));
  }
  
  // Override
  protected createObservable() {
    let extProps = this.definition().data.ExtensionProperties;
    //Pass ExtensionProperties.OnValueChange to BaseControl's OnValueChange
    if (extProps && extProps.OnValueChange) {
      this.definition().data.OnValueChange = extProps.OnValueChange;
    }
    return super.createObservable();
  }

  public setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any> {
    //Check the value
    if (value != null && value != undefined) {
      return this.observable().setValue(value, notify, isTextValue);
    } else {
      return Promise.reject("Error: Invalid value");
    }
    return Promise.resolve();
  }

  public viewIsNative() {
    return true;
  }
}
