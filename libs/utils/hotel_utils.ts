import { excel_to_json } from "./excel-utils";
import { Hotel } from "./global-interface";

const MerchantAccountCode_Hotel_Mapping: {[key: string]: any} = {
  'BaseCampSolvgade': 1,
  'BaseCampLyngby': 2,
  'BaseCampSouthCampus': 3,
  'BaseCampLodzI': 4,
  'BaseCampLodzII': 5,
  'BaseCampKatowice': 6,
  'BaseCampWroclaw': 7,
  'BaseCampPotsdam': 8,
  'BaseCampLeipzig': 9,
  'BaseCampDortmundStudent': 10,
  'BaseCampGoettingen': 12,
}

let hotels: Hotel[] = excel_to_json(`${__dirname}/global-data/hotel.xlsx`);

export function hotel_from_id(id: number): Hotel | null | undefined {
  return hotels.find(e => e.id === id);
}

export function hotel_from_MerchantAccountCode(str: string): Hotel | null | undefined{
  if(MerchantAccountCode_Hotel_Mapping[str] !== undefined) {
    const hotelId = MerchantAccountCode_Hotel_Mapping[str];

    return hotel_from_id(hotelId);
  }

  return null;
}

export function hotel_from_ref(ref: string): Hotel | undefined | null{
  if(!ref) return undefined;
  const hotel = hotels.find(e => e.refid?.toLowerCase() === ref.toLowerCase());

  return hotel;
}

export function hotel_from_room_confirmationNumber(str: string): Hotel | undefined | null{
  let ref: string = '';
  hotels.forEach(hotel => {
    if(!ref){
      const reg = new RegExp(`^(${hotel.refid})`, 'i');
      if(reg.test(str)){
        ref = (reg.exec(str) as any)[1];
      }
    }
    
  })

  if(!ref) return null;

  const hotel = hotel_from_ref(ref);

  return hotel;
}

export function hotel_from(str: string | number | Hotel): Hotel | null | undefined{
  if(!str) return null;

  if(typeof str === 'object' && (str as any)['id'] !== undefined) return str;

  if(typeof str === 'number'){
    let hotel = hotel_from_id(str);
    if(hotel) return hotel;
  }

  let hotel = hotel_from_MerchantAccountCode(str as string);
  if(hotel) return hotel;

  hotel = hotel_from_room_confirmationNumber(str as string);
  if(hotel) return hotel;

  hotel = hotel_from_ref(str as string);
  if(hotel) return hotel;


  return null;
}

export function hotel_id_from(str: string | number | Hotel): Number{
  if(!str) return 0;

  const hotel = hotel_from(str);
  if(hotel) return hotel.id;

  return 0;
}