import { SQLStore } from "./interface";
import { log_add, log_error, log_warn } from "./log";

const now = new Date();
const strNow = `${now.getDate() > 9 ? now.getDate() : '0' + now.getDate()}/${now.getMonth() + 1 > 9 ? now.getMonth() + 1 : '0' + (now.getMonth())}/${now.getFullYear()} ${now.getHours() > 9 ? now.getHours() : '0' + now.getHours()}:${now.getMinutes() > 9 ? now.getMinutes() : '0' + now .getMinutes()}:${now.getSeconds() > 9 ? now.getSeconds() : '0' + now.getSeconds()}`;

export function extract_stores(content: string): SQLStore[]{
  const reg = /\/\*\*\*\*\*\* Object:\s*StoredProcedure\s*\[dbo\]\.\[[a-z0-9_\- ]+\]\s*Script\s+Date:\s*\d+\/\d+\/\d+\s*\d+:\d+:\d+\s*\*\*\*\*\*\*\//i;

  log_add(`extract_stores content length: ${content.length}`);

  const parts: string[] = content.split(reg);
  if(!parts.length){
    log_error(`extract_stores: Failed to split`)
    return []
  }
  log_add(`extract_stores estimate store: ${parts.length}`)
  const stores: SQLStore[] = [];

  parts.forEach((part, i) => {
    const store = parse_store(part, content);
    if(store){
      stores.push(store);
    }
  })

  return stores;
}

function parse_store_name(content: string): string | null{
  const reg = /^\s*CREATE\s+PROCEDURE\s+\[dbo\]\.\[([a-z0-9_\- ]+)\]/im;

  if(!reg.test(content)) {
    log_add(`parse_store_name failed parse name`)
    return null;
  }

  const match = reg.exec(content);
  if(!match) {
    log_error(`parse_store_name: Match is null.`)
    return null;
  }
  return match[1].trim();
}

function parse_store_topics(name: string, content: string): string[] | undefined{
  // -- Topics: ROP-1952, WSH-2022
  var reg = /(Topics)\s*:\s*(.*)$/im;
  if(!reg.test(content)) {
    // log_error(`parse_store_topics: ${name} => no topic`)
    return;
  }

  const match = reg.exec(content);
  if(!match) return;

  const strTopics = match[2].trim();
  if(!strTopics) {
    // log_error(`parse_store_topics: ${name} => empty topic text`)
    return;
  }

  var topicReg = /((WSH|ROP|BCS|RSP)-\d+)/ig;
  let results: string[] = [];
  let topicMatch = topicReg.exec(strTopics);
  while(topicMatch){
    results.push(topicMatch[1]);
    topicMatch = topicReg.exec(strTopics);
  }
  return results;
}

function parse_store(content: string, fullContent: string): SQLStore | undefined{
  if(!content) {
    log_error(`parse_store: content is empty`)
    return;
  }
  content = content.trim();
  if(!content) {
    log_error(`parse_store: content is empty`)
    return;
  }

  const storeName = parse_store_name(content);
  if(!storeName) {
    log_add(`Failed to parse store: ${content}`);
    return;
  }

  // log_warn(`parse_store name: ${storeName}`);

  // const strDate = parse_store_date(storeName, fullContent);
  const storeContent = build_store(storeName, content);
  const topics = parse_store_topics(storeName, content);

  const result: SQLStore = {
    name: storeName,
    content: storeContent,
    topics: topics,
    // date: strDate
  };

  return result;
}

function parse_store_date(name: string, content: string): string{
  // 19/06/2023 08:59:34
  const reg = new RegExp(`StoredProcedure\\s+\\[dbo\\]\\.\\[${name}\\]\\s+Script\\s+Date:\\s*(\\d{2}\\/\\d{2}\\/\\d{4}\\s+\\d{2}:\\d{2}:\\d{2})`);
  if(!reg.test(content)) {
    log_add(`Failed to parse date`)
    return '';
  }

  const match = reg.exec(content);
  if(!match) return '';
  return match[1];
}

function build_store(name: string, content: string, date?: string){
  let result = `
/****** Object:  StoredProcedure [dbo].[${name}]    Script Date: ${strNow} ******/
IF exists (SELECT * FROM dbo.sysobjects WHERE id = object_id(N'[dbo].[${name}]') and OBJECTPROPERTY(id, N'IsProcedure') = 1)
DROP procedure [dbo].[${name}]
GO

${content}
  `;

  return result.trim();
}

export function compare_store(str1: string, str2: string): boolean{
  // Deep compare
  const s1 = str1.replace(/\s+/g, ' ').trim();
  const s2 = str2.replace(/\s+/g, ' ').trim();
  const result = s1 === s2;
  return result;
}