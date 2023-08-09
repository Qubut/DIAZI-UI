export interface DataState {
  json: { [k: string]: any } |null;
  error: any;
  machines:{ [k: string]: any } |null;
  machinesChanged: boolean
}
