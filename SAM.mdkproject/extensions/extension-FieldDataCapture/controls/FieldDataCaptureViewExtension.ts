import { BaseControl } from 'mdk-core/controls/BaseControl';
import { FormCellContainer } from 'mdk-core/controls/FormCellContainer';
import { FormCellContainerView } from 'mdk-sap';
import { BaseFormCell } from 'mdk-core/controls/formCell/BaseFormCell';
import { ControlFactorySync } from 'mdk-core/controls/ControlFactorySync';
import { EventHandler } from 'mdk-core/EventHandler';
import { I18nHelper } from 'mdk-core/utils/I18nHelper';
import { PropertyTypeChecker } from 'mdk-core/utils/PropertyTypeChecker';
import { ClientSettings } from 'mdk-core/storage/ClientSettings';
import { FieldDataCaptureDefinition } from './FieldDataCaptureDefinition';
import { asService } from 'mdk-core/data/EvaluateTarget';
import { TargetPathInterpreter } from 'mdk-core/targetpath/TargetPathInterpreter';
import { IDataService } from 'mdk-core/data/IDataService';
import { IFormCellProxy } from 'mdk-core/context/IClientAPI';
import { ListPickerFormCellProxy, FormCellControlProxy} from 'mdk-core/context/ClientAPI';
import { MDKPage } from 'mdk-core/pages/MDKPage';
import { IDefinitionProvider } from 'mdk-core/definitions/IDefinitionProvider';
import { FieldDataCaptureChangeSetActionRunner, IFieldDataCaptureChangeSetActionRunnerDelegate }
  from './FieldDataCaptureChangeSetActionRunner';
import { IActionFactory } from 'mdk-core/actions/IActionFactory';
import { IAction } from 'mdk-core/actions/IAction';
import { Context } from 'mdk-core/context/Context';
import { Application } from '@nativescript/core';

export class FieldDataCaptureViewExtension
  extends FormCellContainer
  implements IFieldDataCaptureChangeSetActionRunnerDelegate {

  private _cells: BaseFormCell[] = [];
  private _sectionCells: any[] = [];
  private nuiStyleClass: string;
  private fieldDataCaptureDefinition: FieldDataCaptureDefinition;

  private sectionsContexts = [];
  private parentPage: MDKPage;
  private bindingStash: any[];
  private activeCells: BaseFormCell[] = [];
  private firstSectionIndex: number;
  private lastSectionIndex: number;
  private changeSetGroupIndex: number;
  private addedCells: number = 0;
  private isInPopover: boolean;
  private visibleCells: any[] = [];
  private isOnLoaded: boolean;  // From BCP 2070177644
  private filteredItemsCounter: number;  

  private allControlsAreBuiltInExt: Promise<any>;

  public initialize(props) {
    super.initialize(props);

    this.parentPage = this.page() as MDKPage;
    // As this control mimics the FormCellContainer, we reuse its definition
    let fieldDataCaptureDefinitionData = props.definition.data.ExtensionProperties;
    this.fieldDataCaptureDefinition = new FieldDataCaptureDefinition(
      '',
      fieldDataCaptureDefinitionData,
      props.definition.data.ExtensionProperties.parent);
  }

  public bind(): Promise<any> {
    this.bindingStash =  this.parentPage.context.binding;

    return this.readEntities().then(readResults => {
      return this.configureModel(readResults).then(() => {
        return this.createUI();  // From BCP 2070177644
      });
    });
  }

  public executeChangeSet(changeSetPath: string, groupIndex: number = -1) {
    this.changeSetGroupIndex = groupIndex;
    let changeSetRunner = new FieldDataCaptureChangeSetActionRunner(this);
    let definition = IDefinitionProvider.instance().getDefinition(changeSetPath);
    return definition.then(data => {
      let changeSet: IAction = IActionFactory.Create(data);
      return changeSetRunner.run(changeSet).then(result => {
        this.cleanup(this.getChangeSetBeginIndex() + this.getChangeSetEntityCount() - 1);
      }).catch(error => {
        // TODO: check if actions need to be taken here
      });
    })
  }

  public executeActionOnEverySection(actionPath: string) {
    this.firstSectionIndex = 0;
    this.lastSectionIndex = this.sectionsContexts.length - 1;
    this.executeRecursive(actionPath, 0);
  }

  public executeActionOnGroup(actionPath: string, groupIndex: number): Promise<any> {
    let skippedSections = this.fieldDataCaptureDefinition.entityCounts
      .slice(0, groupIndex)
      .reduce((previous, current) => previous + current, 0);
    let entityCount = this.fieldDataCaptureDefinition.entityCounts[groupIndex];
    this.firstSectionIndex = skippedSections;
    this.lastSectionIndex = skippedSections + entityCount - 1;
    return this.executeRecursive(actionPath, skippedSections);
  }

  public willExecuteAction(sectionIndex: number) {
    this.performPreActionSetup(sectionIndex);
  }

  public didExecuteAction(sectionIndex: number) {
    this.cleanup(sectionIndex);
  }

  public getChangeSetEntityCount(): number {
    let actionsCount = this.sectionsContexts.length;
    if (this.changeSetGroupIndex >= 0) {
      actionsCount = this.fieldDataCaptureDefinition.entityCounts[this.changeSetGroupIndex];
    }
    return actionsCount;
  }

  public getChangeSetBeginIndex(): number {
    let beginIndex = 0;
    if (this.changeSetGroupIndex >= 0) {
      beginIndex = this.fieldDataCaptureDefinition.entityCounts
        .slice(0, this.changeSetGroupIndex)
        .reduce((previous, current) => previous + current, 0);
    }
    return beginIndex;
  }

  public getCellProxyWithName(name: string): IFormCellProxy {
    let foundCell = this.activeCells.find((cell) => cell.definition().getName() === name);
    if (!foundCell) {
      foundCell = this._cells.find((cell) => cell.definition().getName() === name);
    }

    if (foundCell && foundCell.definition().getType() === 'Control.Type.FormCell.ListPicker') {
      return new ListPickerFormCellProxy(foundCell.context);
    }
    return new FormCellControlProxy(foundCell.context);
  }

  public viewIsNative() {
    return true;
  }

  public setStyle(style: string) {
    this.nuiStyleClass = style;
  }

  public getFilteredItemsCount() {
    return this.filteredItemsCounter;
  }

  public getTotalItemsCount() {
    return this._sectionCells.length;
  }

  public applyFilter(filters) {
    var counter = 0;
    this.filteredItemsCounter = 0;
    if (filters != null && filters.length > 0) {
      for (let i = 0; i < this._sectionCells.length; i++) {
        let cellCounter = counter;
        let propertyVisibility = true;
        let controlvisibility = true;
        let validationErrorVisibility = true;
        var unionFilter =  this.getFilterTypes(filters, 'AND');
        var propertyFilters = this.getFilterTypes(filters, 'Property');
        var controlFilters = this.getFilterTypes(filters, 'Control');
        var validationErrorFilters = this.getFilterTypes(filters, 'ValidationError');
        if (propertyFilters.length > 0) {
          propertyVisibility = this.applyPropertyFilter(propertyFilters, this._sectionCells[i][0]);
        }
        if (controlFilters.length > 0) {
          controlvisibility = this.applyControlFilter(controlFilters[0], this._sectionCells[i], cellCounter);
        }
        if (validationErrorFilters.length > 0) {
          validationErrorVisibility= this.applyPropertyFilter(validationErrorFilters, this._sectionCells[i][0]);
        } 
        let visibility = (propertyVisibility && (controlvisibility || validationErrorVisibility));

        if (unionFilter.length > 0) {
          let unionProperty = this.applyPropertyFilter(unionFilter, this._sectionCells[i][0]);
           visibility = unionProperty && visibility;
        }

        if (visibility) {
          this.filteredItemsCounter++;
        }
   
        for (let j = 0; j < this._sectionCells[i].length; j++) {
          if (this.visibleCells[counter] === false) {
            this._sectionCells[i][j].setVisible(false, false);
          } else {
            this._sectionCells[i][j].setVisible(visibility, false);
          }
          counter++;
        }
      }
    } else {
      for (let i = 0; i < this._sectionCells.length; i++) {
        for (let j = 0; j < this._sectionCells[i].length; j++) {
          if (this.visibleCells[counter] === false) {
            this._sectionCells[i][j].setVisible(false, false);
          } else {
            this._sectionCells[i][j].setVisible(true, false);
          }
          counter++
        }
      }
      this.filteredItemsCounter = this._sectionCells.length;
    }
    this.redraw();
  }

  public applyPropertyFilter(propertyFilters, cell) {
    let visibility = false;
    for (let j = 0; j < propertyFilters.length; j++) {
    if (this.checkProperty(cell.binding, propertyFilters[j].FilterProperty) && this.findPropertyMatch(cell.binding,propertyFilters[j].FilterProperty,propertyFilters[j].FilterValue)) {
        visibility = true;
        break;
      }     
    }
    return visibility;
  }
  /**
   * Checks for if property is defined on the binding object
   * @param binding 
   * @param filterProperties 
   */
  public checkProperty(binding, filterProperties) {
      var properties = filterProperties.split('/');
    if (properties.length>1){
      return binding.hasOwnProperty(properties[0]);
    } else {
      return binding.hasOwnProperty(filterProperties);
    }
  }
  
  /**
   * Checks if there is a property with a particular value in a binding object even if it is in a nav link ex: WorkOrder/Operation/OperationDesc
   * @param binding 
   * @param filterProperties 
   * @param value 
   */
  public findPropertyMatch(binding, filterProperties, value) {
    var properties = filterProperties.split('/');
    let result = false;

    if (properties.length>1) {
      ///Check if there is a property with a particular value even if that property is in a nav link
      for (let i = 0; i < properties.length -1; i++) {
          if (Array.isArray(binding[properties[i]])) { //If nav link is an array then loop over to find the matching property value
            if (binding[properties[i]].length>0) {
              try{
              result = (binding[properties[i]].find(o => o[properties[i+1]] === value)[properties[i+1]]) === value;
              } catch{
              result = false;
              }
          } else {
            result = false;
            break;
          }  
        } else { //if nav link is an object then just look for the matching value in the first object
          result = binding[properties[i]][properties[i+1]] === value;
        }
             
      }
      return result;
    } else {
      ///if property is not in a nav link just compare the binding property with the value
      return binding[filterProperties] === value;
    }
  }

  public applyControlFilter(controlFiltersObject, sectionCells, cellCounter) {
    let switchControls = [];
    let readingControls = [];

    if (controlFiltersObject.Controls.length > 0) {
      switchControls = controlFiltersObject.Controls.filter(control => control.ControlType === 'Control.Type.FormCell.Switch')
      readingControls = controlFiltersObject.Controls.filter(control => control.ControlType !== 'Control.Type.FormCell.Switch')
    }

    let switchVisibility = this.checkControlVisibility(switchControls, sectionCells, cellCounter);
    let readingVisibility = this.checkControlVisibility(readingControls, sectionCells, cellCounter);

    return switchVisibility || readingVisibility;
  }

  public checkControlVisibility(controls, sectionCells, cellCounter) {
    let visibility = false;
    for (let i = 0; i < controls.length; i++) {
      let controlCell = this.findCellInSectionCells(sectionCells, controls[i].ControlName, cellCounter);
      if (controlCell !== undefined) {
        visibility = this.checkControlValueExists(controlCell, sectionCells, cellCounter, controls[i]);
      }
    }
    return visibility;
  }

  public getFilterTypes(filters, type) {
    var filteredFilters = []
    for (let j = 0; j < filters.length; j++) {
      if (filters[j].FilterType === type) {
        filteredFilters.push(filters[j]);
      }
    }
    return filteredFilters;
  }

  public checkControlValueExists(controlCell, sectionCells, cellCounter, controlObject) {
    if (controlCell.type === 'Control.Type.FormCell.Switch') {
      if (controlCell.getValue() && controlObject.ControlValueExits) {
        return true;
      }
    } else {
      if (controlObject.ControlValueExits) {
        if (controlCell.getValue().length > 0) {
          return true
        }
      } else { //Emtpy flag is set

        //if the skip switch is on then don't go further and hide it regardless of whether a value exists or not
        let switchCell = sectionCells.filter(cell => cell.type === 'Control.Type.FormCell.Switch')
        if (switchCell.length > 0 && switchCell[0].getValue()) {
          return false;
        }

        if (controlCell.binding.hasOwnProperty(controlObject.RequiredFieldsProperty) && controlCell.binding[controlObject.RequiredFieldsProperty].length > 0) {
          
          let requiredFieldsObject = controlCell.binding[controlObject.RequiredFieldsProperty][0];
          let requiredFieldsArray = requiredFieldsObject.Fields;

          if (requiredFieldsArray.length > 0 && requiredFieldsObject.NumberOfFieldsRequired) {
              
            if (requiredFieldsObject.NumberOfFieldsRequired === requiredFieldsArray.length) { //all the fields in the array need to be populated

              let controlValuesExist = this.buildArrayOfValues(requiredFieldsArray, sectionCells, cellCounter);

              //if any of the required fields doesn't have a value then show the field
              return controlValuesExist.indexOf('false') > -1 ? true : false;

            } else if (requiredFieldsObject.NumberOfFieldsRequired < requiredFieldsArray.length) { //a certain number of the fields need to be populated. It doesn't matter which one(s)
              
              let controlValuesExist = this.buildArrayOfValues(requiredFieldsArray, sectionCells, cellCounter);

              //if at least one value exists then hide the field
              let count = controlValuesExist.filter(value => value === 'true').length;
              return count >= requiredFieldsObject.NumberOfFieldsRequired ? false : true;
            }
          }
        }

        if (controlCell.getValue() == 0) {
          return true
        }
      }
    }
    return false;

  }

  public buildArrayOfValues(requiredFieldsArray: string[], sectionCells, cellCounter): string[] {
    let controlValuesExist = [];

    for (let field of requiredFieldsArray) {
      let control = this.findCellInSectionCells(sectionCells, field, cellCounter);

      if (control.type === 'Control.Type.FormCell.SimpleProperty') {
        if (control.getValue()) {
          controlValuesExist.push('true');
        } else {
          controlValuesExist.push('false');
        }
      }

      if (control.type === 'Control.Type.FormCell.ListPicker') {
        if (control.getValue().length > 0)  {
          controlValuesExist.push('true');
        } else {
          controlValuesExist.push('false');
        }
      }
    }

    return controlValuesExist;
  }

  public findCellInSectionCells(sectionCells, controlName, counter) {
    for (let i = 0; i < sectionCells.length; i++) {
      if (sectionCells[i]._props.definition.name.indexOf(controlName) != -1) {
        if (this.visibleCells[counter] === undefined || this.visibleCells[counter]) {
          return sectionCells[i];
        }
      }
      counter++;
    }
  }

  public findFilterType(FilterTypes, type) {
    for (let i = 0; i < FilterTypes.length; i++) {
      if (FilterTypes[i].FilterType === type) {
        return true;
      }
    }
    return false;
  }

  public redraw(builtData: any = undefined) {
    if (builtData) {
      // We just built and are being given the latest builtData, so just use it
      this.view().updateCells(builtData, this.nuiStyleClass);
    } else {
      // No data? That means we are coming here from a rule where redraw() was
      // called on the API or some other control setter that resulted on that,
      // so we need to make sure we use newly built data for all properties
      //
      // Also, in this situation specially when redraw() is called in the OnLoaded
      // handler of the page, this could be called before the initial build
      // of all controls. This will cause a crash on the native side because we
      // would be calling to updateCells() before _buildControls() is finished and
      // hence before populate() is done in which case some cells will not exist yet.
      return this.allControlsAreBuiltInExt.then(() => {
        return Promise.all(this.cells.map((control: BaseFormCell) => {
          return control.updateFormCellModel();
        })).then((newBuiltData) => {
          this.view().updateCells(newBuiltData, this.nuiStyleClass);
        });
      });
    }
  }

  public get cells() {
    return this._cells;
  }

  public get controls() {
    return this._cells;
  }

  public bindValue(value: any): Promise<any> {
    // Nothing to bind...move on.
    return Promise.resolve();
  }

  public updateCell(control: BaseFormCell) {
    let indexPath = this.fieldDataCaptureDefinition.indexPath(control.getName());
    if (this._isValidIndexPathExt(indexPath)) {
      if (Application.android) {
        control.updateFormCellModel();
      } else {
        control.build().then(data => {
          // For Android...and eventually iOS, we update the native form cell directly instead of through
          // the container
          this.view().updateCell(data, indexPath.row, indexPath.section);
        });
      }
    }
  }

  // Workaround to BCP 1880677511
  // update cell by input data without fetching entire dataset from obeservable for the cell
  public updateCellByProperties(control: BaseFormCell, data: any) {
    // From BCP 2070177644
    let indexPath = this.fieldDataCaptureDefinition.indexPath(control.getName());
    if (this._isValidIndexPathExt(indexPath)) {
      if (Application.ios) {
        this.view().updateCell(data, indexPath.row, indexPath.section);
      } else {
        control.redraw();
      }
    }
  }

  public onLoaded() {
    // Run formcell controls onLoaded
    let formcellOnLoadedPromises = [];
    for (let formcell of this.cells) {
        let promise = formcell.onLoaded();
        formcellOnLoadedPromises.push(promise);
    }
    Promise.all(formcellOnLoadedPromises).then((onLoadedResults) => {
      let redrawNeeded = false;
      for (let onLoadedResult of onLoadedResults) {
        if (onLoadedResult) {
          redrawNeeded = true;
          break;
        }
      }

      // From BCP 2070177644
      if (this.isOnLoaded) {
        if (redrawNeeded) {
          this.redraw();
        }
      } else {
        this.isOnLoaded = true;

        let promiseRunner = (sections, index): Promise<any> => {
          if (index >= sections.length) {
            return Promise.resolve();
          }
          if (sections[index].OnLoaded) {
            return this.executeActionOnGroup(sections[index].OnLoaded, index).then(() => {
              return promiseRunner(sections, index + 1);
            });
          }
          return promiseRunner(sections, index + 1);
        };

        return promiseRunner(this.fieldDataCaptureDefinition.sections, 0).then(() => {
          for (let formcell of this.cells) {
            this.visibleCells.push(formcell.visible);
          }
          this.redraw();
        });
      }
    });

    // Run definition OnLoaded event
    this.page().runOnLoadedEvent();
  }

  public getContext(sectionIndex: number) {
    let binding = this.sectionsContexts[sectionIndex].binding;
    binding.pageBinding = this.bindingStash;
    return new Context(binding, this.page());
  }

  // TODO: This is temporary, to be removed once the changeSets get implemented
  private executeRecursive(actionPath: string, sectionIndex: number): Promise<any> {
    this.performPreActionSetup(sectionIndex);

    let context = this.getContext(sectionIndex);

    let eventHandler = new EventHandler();
    return eventHandler.executeActionOrRule(actionPath, context).then(value => {
      this.cleanup(sectionIndex);

      if (sectionIndex < this.lastSectionIndex) {
        return this.executeRecursive(actionPath, ++sectionIndex);
      }
      return Promise.resolve();
    }).catch(error => {
      return this.cleanup(sectionIndex);
    });
  }

  private readEntities(): Promise<any> {
    let sectionReadPromises = this.fieldDataCaptureDefinition.sections.map((section) => {
      if (section.Target) {
        if (PropertyTypeChecker.isTargetPath(section.Target)) {
          let interpreter = new TargetPathInterpreter(this.context);
          const data = interpreter.evaluateTargetPathForValue(section.Target);
          return Promise.resolve(data);
        } else {
          return asService(section, this.context).then(service => {
            return IDataService.instance().read(service);
          });
        }
      } else {
        return Promise.resolve([this.context.binding]);
      }
    });
    return Promise.all(sectionReadPromises);
  }

  private configureModel(readResults: any): Promise<any> {
    let entityCounts = readResults.map((entities) => {return entities.length; });
    this.fieldDataCaptureDefinition.entityCounts = entityCounts;

    for (let readResult of readResults) {
      let sectionContexts = readResult.map((entity) => {return {binding: entity}; });
      this.sectionsContexts.push(...sectionContexts);
    }
    return Promise.resolve();
  }

  private createUI(): Promise<any> {
    const bridge = new FormCellContainerView(this.page(), this, this.formcellDataExt);
    this.setView(bridge);

    this._createControls();
    this.allControlsAreBuiltInExt = this._buildControls();
    return this.allControlsAreBuiltInExt;
  }

  private _createControls() {
    let promises = [];
    let definitionIndex = 0;
    this.cells.length = 0;

    this.fieldDataCaptureDefinition.numberOfRowsInSection.forEach((rowCount: number, index: number) => {
      let cellContext = this.sectionsContexts[index];
      let sectionCells = [];
      for (let j = 0; j < rowCount; j++) {
        let cellDefinition = this.fieldDataCaptureDefinition.getControlDefs()[definitionIndex];
        const cell: any = ControlFactorySync.Create(this.page(), cellContext, null, cellDefinition);
        this.cells.push(cell);
        sectionCells.push(cell);
        cell.parent = this;
        definitionIndex++;
      }
      this._sectionCells.push(sectionCells);
    });
  }

  private _buildControls(): Promise<any> {
    return Promise.all(this.cells.map(control => {
      control.parent = this;
      return control.build().then(() => {
        return control.bind();
      });
    })).then(() => {
      // Create native views after all of the form cells are bound.  Since the promises in the control
      // binding above can resolve out of order, we can end up with form cells created out of order.
      return Promise.all(this.cells.map(control => {
        return control.createFormCellModel(control.builder.builtData).then((mdkFormCell) => {
          this.view().addFormCell(mdkFormCell);
          return control.builder.builtData;
        });
      }));
    });
  }

  private performPreActionSetup(sectionIndex: number) {
    this.activeCells = this.getCellsForSection(sectionIndex);
    this.replacePageBindingWithBindingFromSection(sectionIndex);
    this.updateCellsNamesForSection(sectionIndex, false);
    this.setCellsFromSectionAsChildControlsOfPage(sectionIndex);
  }

  private cleanup(sectionIndex: number) {
    this.updateCellsNamesForSection(sectionIndex, true);
    this.parentPage.context.binding = this.bindingStash;
    this.removeCellsFromPage();
  }

  private replacePageBindingWithBindingFromSection(sectionIndex: number) {
    this.parentPage.context.binding = this.sectionsContexts[sectionIndex].binding;
  }

  private setCellsFromSectionAsChildControlsOfPage(sectionIndex: number) {
    for (let cell of this.activeCells) {
      this.parentPage.addChildControl(cell);
      this.addedCells++;
    }
  }

  private updateCellsNamesForSection(sectionIndex: number, isNeedSuffix: boolean) {
    let cellIndexBegin = this.fieldDataCaptureDefinition.numberOfRowsInSection
      .slice(0, sectionIndex)
      .reduce((previous, current) => previous + current, 0);

    return this.getCellsForSection(sectionIndex).map((cell, index) => {
      let cellName: string;

      if (isNeedSuffix) {
        cellName = this.fieldDataCaptureDefinition.getControlNamesWithSuffixes()[cellIndexBegin + index];
      } else {
        cellName = this.fieldDataCaptureDefinition.getControlNamesWithoutSuffixes()[cellIndexBegin + index];
      }

      cell.definition().data._Name = cellName;
      return cell;
    });
  }

  private getCellsForSection(sectionIndex: number): BaseFormCell[] {
    let cellIndexBegin = this.fieldDataCaptureDefinition.numberOfRowsInSection
      .slice(0, sectionIndex)
      .reduce((previous, current) => previous + current, 0);

    let nbRowsInSection = this.fieldDataCaptureDefinition.numberOfRowsInSection[sectionIndex];
    let cellIndexEnd = cellIndexBegin + nbRowsInSection;
    return this.cells.slice(cellIndexBegin, cellIndexEnd);
  }

  private isFirstSection(sectionIndex: number): Boolean {
    return sectionIndex === this.firstSectionIndex;
  }

  private isLastSection(sectionIndex: number): Boolean {
    return sectionIndex === this.lastSectionIndex;
  }

  private removeCellsFromPage() {
    for (let i = 0; i < this.addedCells; i++) {
      this.parentPage.controls.pop();
    }
    this.addedCells = 0;
  }

  private _isValidIndexPathExt(indexPath: {row, section}): boolean {
    return indexPath.row !== -1 &&  indexPath.section !== -1;
  }

  /**
   * This method is to localize section names
   *
   * @param sectionNames string array of section names to be localized
   * @return {string[]} localized section names
   *
   */
  private _localizeSectionNames(sectionNames: string[]): string[] {
    let localizedSectionNames: string[] = [];
    sectionNames.map((name) => {
      if (PropertyTypeChecker.isLocalizableString(name)) {
        localizedSectionNames.push(I18nHelper.parseLocalizableString(name, this.context));
      } else {
        localizedSectionNames.push(name);
      }
    });

    return localizedSectionNames;
  }

  private get formcellDataExt(): any {
    let isInPopover = this._props.page.isPopover ? this._props.page.isPopover : false;
    let localizedSectionNames = this._localizeSectionNames(this.fieldDataCaptureDefinition.sectionNames);

    const formcellData = {
      isInPopover,
      locale: ClientSettings.getAppLocale(),
      numberOfRowsInSection: this.fieldDataCaptureDefinition.numberOfRowsInSection,
      numberOfSections: this.fieldDataCaptureDefinition.sectionCount,
      sectionNames: localizedSectionNames,
    };

    return formcellData;
  }
}
