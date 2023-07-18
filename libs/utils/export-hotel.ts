import { excel_to_json, json_to_file } from "./excel-utils";

const data = excel_to_json(`${__dirname}/global-data/hotel.xlsx`);

json_to_file(`${__dirname}/global-data/hotel.json`, data);