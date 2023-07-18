import colors from 'colors';

colors.green

export function date_to_str_from_ddmmyyyy(str: string | number): string{
  const d = str_to_date(str);
  if(!d) return '';

  return date_to_yyymmdd(d);
}

export function str_to_date(str: string | number | Date): Date | null{
  if(!str) return null;

  if(str instanceof Date) return str;

  // 31/07/2022
  if(typeof str === 'string'){
    var reg = /(\d+)\/(\d+)\/(\d{4})/;
    if(reg.test(str)){
      const match: any = reg.exec(str);

      const day = parseInt(match[1]);
      const d = new Date(parseInt(match[3]), parseInt(match[2]) - 1, day);
      const result = date_to_yyymmdd(d);

      if(day !== d.getDate()){
        console.log(`WRONG date: ${str} => ${result}`.red);
        d.setDate(d.getDate() - 1);
      }

      return d;
    }

    // 13-07-2022
    var reg = /(\d+)-(\d+)-(\d{4})/;
    if(reg.test(str)){
      const match: any = reg.exec(str);

      const day = parseInt(match[1]);
      const d = new Date(parseInt(match[3]), parseInt(match[2]) - 1, day);
      const result = date_to_yyymmdd(d);

      if(day !== d.getDate()){
        console.log(`WRONG date: ${str} => ${result}`.red);
        d.setDate(d.getDate() - 1);
      }

      return d;
    }

    // 31.09.2022
    var reg = /(\d+)\.(\d+)\.(\d{4})/;
    if(reg.test(str)){
      const match: any = reg.exec(str);

      const day = parseInt(match[1]);
      const d = new Date(parseInt(match[3]), parseInt(match[2]) - 1, day);

      const result = date_to_yyymmdd(d);

      if(day !== d.getDate()){
        console.log(`WRONG date: ${str} => ${result}`.red);
        d.setDate(d.getDate() - 1);
      }

      return d;
    }

    // 01/07/22
    var reg = /(\d{2})\/(\d{2})\/(\d{2})/i;
    if(reg.test(str)){
      const match: any = reg.exec(str);

      const day = parseInt(match[1]);
      const d = new Date(parseInt(`20${match[3]}`), parseInt(match[2]) - 1, day);

      const result = date_to_yyymmdd(d);

      if(day !== d.getDate()){
        console.log(`WRONG date: ${str} => ${result}`.red);
        d.setDate(d.getDate() - 1);
      }

      return d;
    }

    return null;
  }

  const days = parseInt(str as any);
  if(days){
    const d = new Date(1900, 0, 1);
    d.setDate(d.getDate() + days - 2);

    if(d.getDate() > 12){
      return d;
    }

    // date = 1 is always correct
    if(d.getDate() === 1){
      return d;
    }

    return d;

    // fix wrong date, date in excel => dd/mm/yy (format) => but it's mm/dd/yy
    //const result = new Date(d.getFullYear(), d.getDate() - 1, d.getMonth() + 1);
    
    // return result;
  }
  
  return null;
}

export function date_to_yyymmdd(d: Date): string{
  const m = d.getMonth() + 1;
  const dd = d.getDate();
  return `${d.getFullYear()}-${m > 9 ? m : '0' + m}-${dd > 9 ? dd : '0' + dd}`;
}

export function date_to_yyymmddhhmmss(d: Date): string{
  const m = d.getMonth() + 1;
  const dd = d.getDate();
  const h = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  return `${d.getFullYear()}-${m > 9 ? m : '0' + m}-${dd > 9 ? dd : '0' + dd} ${h > 9 ? h : '0' + h}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds: '0' + seconds}`;
}

export function excel_date_to_jsdate(serial: number): Date {
  var utc_days  = Math.floor(serial - 25569);
  var utc_value = utc_days * 86400;                                        
  var date_info = new Date(utc_value * 1000);

  var fractional_day = serial - Math.floor(serial) + 0.0000001;

  var total_seconds = Math.floor(86400 * fractional_day);

  var seconds = total_seconds % 60;

  total_seconds -= seconds;

  var hours = Math.floor(total_seconds / (60 * 60));
  var minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

export function date_last_month_next_year(date: Date, totalYear = 1): Date{
  let d = new Date(date);

  if(d.getDate() === 1){
    // end date of the month of next year
    d.setFullYear(d.getFullYear() + totalYear);

    // => move to 1st date
    d.setDate(1);
    // => next month
    d.setMonth(d.getMonth() + 1);
    d.setDate(d.getDate() - 1);

    return d;
  }
  
  d.setFullYear(d.getFullYear() + totalYear);

  return d;
}