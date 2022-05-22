import { ContractData } from './ContractData';
export class ContractModel {
  constructor(
    public ApiKey: string = '',
    public ActionType: string = '',
    public UserId: string = '',
    public Data: Array<ContractData> = [],
    public WorkflowProcessId: number = 0,
    public CurrentProcessStatusId: number = 0,
    public Status: string = '',
    public Message: string = '',
    public WfpActionObjects: number = 0,
    public FormTag: string = ''
  ) {}

  static create(contract: ContractModel) {
    const newCustomer = Object.assign(new ContractModel(), {
      ApiKey: contract.ApiKey,
      ActionType: contract.ActionType,
      UserId: contract.UserId,
      Data: contract.Data,
      WorkflowProcessId: contract.WorkflowProcessId,
      CurrentProcessStatusId: contract.CurrentProcessStatusId,
      Status: contract.Status,
      Message: contract.Message,
      WfpActionObjects: contract.WfpActionObjects,
      FormTag: contract.FormTag,
    });
    return newCustomer;
  }
}
