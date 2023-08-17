import * as fs from 'fs';
import * as path from 'path';
import { json_to_file } from './libs/utils/excel-utils';

const folderPath = 'D:\\WORK\\xnprotel\\xps.xms.webapi\\XPS.XMS.WebApiCore.UnitTests\\ReportTemplate\\Store';

function getFilesInFolder(folderPath: string): string[] {
  try {
    const fileNames = fs.readdirSync(folderPath);
    return fileNames;
  } catch (error) {
    console.error('Error reading folder:', error);
    return [];
  }
}

const fileNames = getFilesInFolder(folderPath);

console.log('File names in folder:', fileNames);

json_to_file(`./exclude_store_name.json`, fileNames)