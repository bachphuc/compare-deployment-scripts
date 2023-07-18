let _turnOnLog = true;

let _logs: string[] = [];

export function log_enable(status: boolean){
  _turnOnLog = status;
}

export function log_add(str: string){
  if(!str) return;
  _logs.push(str);
}

export function log_error(str: string){
  if(!str) return;
  _logs.push(str);
  if(!_turnOnLog) return;
  
  console.log(str.red);
}

export function log_warn(str: string){
  if(!str) return;
  _logs.push(str);
  if(!_turnOnLog) return;
  console.log(str.yellow)
}

export function log_success(str: string){
  if(!str) return;
  _logs.push(str);
  if(!_turnOnLog) return;
  console.log(str.green);
}

export function log_all(){
  return _logs;
}