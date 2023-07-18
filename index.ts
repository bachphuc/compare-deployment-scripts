import colors from 'colors';
import fs, { write } from 'fs';

import { dir_create, dir_create_and_empty, json_to_file, str_to_file, text_from_file } from "./libs/utils/excel-utils";
import { compare_store, extract_stores } from "./libs/export_change_utils";
import { log_all, log_error, log_success, log_warn } from './libs/log';
import { SQLStore } from './libs/interface';

colors.enable();

const folderPath = __dirname
const sourcePath = `${folderPath}/data/source.sql`;
const targetPath = `${folderPath}/data/target.sql`;
const now = new Date();
const strDate = `${now.getDate() > 9 ? now.getDate() : '0' + now.getDate()}/${now.getMonth() + 1 > 9 ? now.getMonth() + 1 : '0' + (now.getMonth())}/${now.getFullYear()} ${now.getHours() > 9 ? now.getHours() : '0' + now.getHours()}:${now.getMinutes() > 9 ? now.getMinutes() : '0' + now .getMinutes()}:${now.getSeconds() > 9 ? now.getSeconds() : '0' + now.getSeconds()}`
const outputPath = `${folderPath}/output/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

main();

function main(){
  const strSource = text_from_file(sourcePath);
  if(!strSource){
    log_error(`Source text is empty. STOP`)
    return;
  }

  const strTarget = text_from_file(targetPath);
  if(!strTarget){
    log_error(`Target text is empty. STOP`);
    return;
  }
  
  const sourceStores = extract_stores(strSource);
  if(!sourceStores.length) {
    log_error(`Failed to parse source stores. STOP`);
    return;
  }

  const targetStores = extract_stores(strTarget);

  if(!targetStores.length) {
    log_error(`Failed to parse target stores. STOP`);
    return;
  }
  
  const newStores: SQLStore[] = [];
  const modifyStores: SQLStore[] = [];
  const missingSourceStores: SQLStore[] = [];

  sourceStores.forEach((source, i) => {
    const target = targetStores.find(e => e.name?.toLowerCase() == source.name?.toLowerCase());
    if(!target){
      // New stores
      log_warn(`New store: ${source.name}`)
      newStores.push(source);
    }
    else{
      // Check if this store is modified
      if(!compare_store(source.content, target.content)){
        modifyStores.push(source);
        log_warn(`Modify store: ${source.name}`)
      }
    }
  });

  targetStores.forEach((target, i) => {
    const source = sourceStores.find(e => e.name.toLowerCase() == target.name.toLowerCase());
    if(!source){
      missingSourceStores.push(target);
      log_error(`Missing source store: ${target.name}`)
    }
  })

  console.log(`==============================================================`)
  
  log_success(`RESULT: Total source stores=${sourceStores.length}, target stores=${targetStores.length}. New stores: ${newStores.length}, modify stores=${modifyStores.length}. ${missingSourceStores.length ? `Store in target without source=${missingSourceStores.length}` : ''}`)

  dir_create(`${folderPath}/output`);
  dir_create_and_empty(outputPath);
  dir_create_and_empty(`${outputPath}/detail/`);
  dir_create_and_empty(`${outputPath}/detail/all/`);
  dir_create_and_empty(`${outputPath}/detail/new/`);
  dir_create_and_empty(`${outputPath}/detail/modify/`);
  dir_create_and_empty(`${outputPath}/detail/have-target-missing-source/`);

  const updateStores: SQLStore[] = [...modifyStores, ...newStores];
  const all: SQLStore[] = [...modifyStores, ...newStores, ...missingSourceStores];

  // Write sql bundle
  const sqlBundleUpdate = updateStores.map(e => `
/****** Object:  StoredProcedure [dbo].[${e.name}]    Script Date: ${strDate} ******/
${e.content}
  `.trim()).join("\n\n");
  str_to_file(`${outputPath}/new_and_modify_bundle.sql`, sqlBundleUpdate);

  // Check topics
  const topics: string[] = [];
  updateStores.forEach(e => {
    if(e.topics && e.topics.length){
      e.topics.forEach(f => {
        if(!topics.includes(f)){
          topics.push(f);
        }
      })
    }
  });

  if(topics.length){
    dir_create_and_empty(`${outputPath}/topics/`);
    topics.forEach(topic => {
      dir_create_and_empty(`${outputPath}/topics/${topic}/`);
      const stores = updateStores.filter(e => e.topics && e.topics.length && e.topics.includes(topic));
      if(stores && stores.length){
        // Write file
        stores.forEach(store => {
          const path = `${outputPath}/topics/${topic}/${store.name}.sql`;
          str_to_file(path, store.content || '');
        })
      }
    })
  }
  
  // Write files 
  if(all.length){
    all.forEach(store => {
      const path = `${outputPath}/detail/all/${store.name}.sql`;
      str_to_file(path, store.content || '');
    })
  }

  if(modifyStores.length){
    modifyStores.forEach(store => {
      const path = `${outputPath}/detail/modify/${store.name}.sql`;
      str_to_file(path, store.content || '');
    })
  }

  if(newStores.length){
    newStores.forEach(store => {
      const path = `${outputPath}/detail/new/${store.name}.sql`;
      str_to_file(path, store.content || '');
    })
  }

  if(missingSourceStores.length){
    missingSourceStores.forEach(store => {
      const path = `${outputPath}/detail/have-target-missing-source/${store.name}.sql`;
      str_to_file(path, store.content || '');
    })
  }
  
  writeLog();

  console.log(`================================================================`)

  
}

function writeLog(){
  const logs = log_all();
  json_to_file(`${folderPath}/output/log.json`, logs);
}