import { Debug } from "./debug.js";

class VegitoError extends Error {
  override readonly name: string;

  constructor(name: string, why: string, options?: any) {
    super(why, options);
    this.name = name;
  }

  public report() {
    Debug.error(this.name, this.message, this.cause);
  }
}

export class TransactionVegitoError extends VegitoError {}
export class NullChannelVegitoError extends VegitoError {}
export class JobNotSetupVegitoError extends VegitoError {}
export class QueryOptionsVegitoError extends VegitoError {}
export class DatabaseSetupVegitoError extends VegitoError {}
export class DatabaseFetchVegitoError extends VegitoError {}
export class CommandExecutionVegitoError extends VegitoError {}
export class NestedSubCommandVegitoError extends VegitoError {}
export class NotSchedulableJobVegitoError extends VegitoError {}
export class DatabaseConnectionVegitoError extends VegitoError {}
export class InvalidContextViewVegitoError extends VegitoError {}
export class IncorrectEnvironmentVegitoError extends VegitoError {}
export class RuntimeJobVegitoError extends VegitoError {}
