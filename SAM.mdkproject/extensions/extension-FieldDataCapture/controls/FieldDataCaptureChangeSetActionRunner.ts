import { ChangeSetActionRunner } from 'mdk-core/actions/runners/ChangeSetActionRunner';
import { ActionResultBuilder } from 'mdk-core/builders/actions/ActionResultBuilder';
import { ChangeSetActionDefinition } from 'mdk-core/definitions/actions/ChangeSetActionDefinition';
import { EventHandler } from 'mdk-core/EventHandler';
import { IAction } from 'mdk-core/actions/IAction';
import { IActionResult } from 'mdk-core/context/IClientAPI';
import { ActionExecutionStatus } from 'mdk-core/ClientEnums';
import { IDataService } from 'mdk-core/data/IDataService';
import { DataEventHandler } from 'mdk-core/data/DataEventHandler';
import { asService } from 'mdk-core/data/EvaluateTarget';
import { ITargetServiceSpecifier } from 'mdk-core/data/ITargetSpecifier';

export class FieldDataCaptureChangeSetActionRunner extends ChangeSetActionRunner {
  public actions: string[] = [];
  public actionRule: string;
  public entityCount: number;
  // This is a copy the the parent class _servicePromise, waiting for SEAM to mark it protected
  private servicePromise: Promise<ITargetServiceSpecifier>;
  private delegate: IFieldDataCaptureChangeSetActionRunnerDelegate;

  constructor(delegate: IFieldDataCaptureChangeSetActionRunnerDelegate) {
    super();
    this.delegate = delegate;
  }

  public run(action: IAction): Promise<IActionResult> {
    this._showIndicator(action);
    const definition = action.definition as ChangeSetActionDefinition;

    const actionDefinition = definition.data.Actions;
    if (Array.isArray(actionDefinition)) {
      this.actions = definition.actions;
    } else {
      this.actionRule = actionDefinition;
    }

    this.entityCount = this.delegate.getChangeSetEntityCount();
    let beginIndex = this.delegate.getChangeSetBeginIndex();

    this.servicePromise = asService(definition.data, action.context());
    let changeSetCancelled = false;
    DataEventHandler.getInstance().activateChangesetQueue();

    let returnResult: Promise<IActionResult>;
    return this.beginChangeSet().then(() => {
      returnResult = this._processChangeSetsFDC(this.actions, beginIndex, action.context());
      return returnResult;
    }).then(() => {
      returnResult = this.commitChangeSet(action);
      return returnResult;
    }).catch(error => {
      this._dismissIndicator(action);
      changeSetCancelled = true;
      returnResult = this.cancelChangeSet(action, error);
      return returnResult;
    }).then((result) => {
        this._dismissIndicator(action);
        if (!changeSetCancelled) {
          DataEventHandler.getInstance().publishChangesetResults();
        }
        return returnResult;
      });
  }

  protected _processChangeSetsFDC(changeSets: string[], beginIndex: number = 0, context: any
    ): Promise<IActionResult> {
    let index = 0;
    let errorCount = 0;
    let nextChangeSet = () => {
      if (index < this.entityCount) {
        this.delegate.willExecuteAction(index + beginIndex);
        let setActionsForEntityPromise = Promise.resolve(this.actions);
        if (this.actionRule) {
          let eventHandler = new EventHandler();
          let context = this.delegate.getContext(index + beginIndex);
          setActionsForEntityPromise = eventHandler.executeActionOrRule(this.actionRule, context);
        }
        return setActionsForEntityPromise.then((actions) => {
          this.actions = actions;
          return super._processChangeSets(actions, context).then((result) => {
            this.delegate.didExecuteAction(index + beginIndex);
            index++;
            // process the next change set action
            return nextChangeSet();
          }).catch((error) => {
            this.delegate.didExecuteAction(index + beginIndex);
            errorCount++;
            index++;
            return nextChangeSet();
          });
        });
      }
      if (errorCount > 0) {
        return Promise.reject(errorCount);
      }
      return Promise.resolve();
    };
    // process the first change set action
    return nextChangeSet();
  }

  // This a copy of the parent class function. Waiting for SEAM to mark it protected
  private beginChangeSet(): Promise<IActionResult> {
    return this.servicePromise.then((service) => {
      return IDataService.instance().beginChangeSet(service).then(() => {
        return new ActionResultBuilder().build();
      });
    });
  }

  // This a copy of the parent class function. Waiting for SEAM to mark it protected
  private cancelChangeSet(action: IAction, error: any): Promise<IActionResult> {
    return this.servicePromise.then((service) => {
      return IDataService.instance().cancelChangeSet(service).then((result) => {
        DataEventHandler.getInstance().resetChangesetQueue();
        return this._runFailure(action);
      });
    });
  }

  // This a copy of the parent class function. Waiting for SEAM to mark it protected
  private commitChangeSet(action: IAction) {
    return this.servicePromise.then((service) => {
      return IDataService.instance().commitChangeSet(service).then((result) => {
        return this._runSuccess(action);
      });
    });
  }
}

export interface IFieldDataCaptureChangeSetActionRunnerDelegate {    
    getChangeSetEntityCount(): number;
    willExecuteAction(sectionIdx: number);
    didExecuteAction(sectionIdx: number);
    getChangeSetBeginIndex(): number;
    getContext(sectionIdx: number);
  }
