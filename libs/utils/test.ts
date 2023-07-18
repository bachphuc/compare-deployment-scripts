import { hotel_from, hotel_from_MerchantAccountCode, hotel_from_ref, hotel_from_room_confirmationNumber, hotel_id_from } from "./hotel_utils";


const testCases: {
  input: string | number,
  correct_hotel_id: number
}[] = [{
  input: 'KAT',
  correct_hotel_id: 6
}, {
  input: 'CPH310853',
  correct_hotel_id: 3
}, {
  input: 'BaseCampLodzI',
  correct_hotel_id: 4
}, {
  input: 'fuck',
  correct_hotel_id: 0
}, {
  input: 'BaseCampLyngby',
  correct_hotel_id: 2
}, {
  input: 'ldz132853',
  correct_hotel_id: 4
}]

testCases.forEach(testCase => {
  const hotel = hotel_from(testCase.input);

  if(!hotel){
    if(!testCase.correct_hotel_id){
      console.log(`Case ${testCase.input} => Not found => expected: ${testCase.correct_hotel_id} => Passed`.green)
    }
    else{
      console.log(`Case ${testCase.input} => Not found => expected: ${testCase.correct_hotel_id} => Failed`.red)
    }
  }
  else{
    if(hotel.id === testCase.correct_hotel_id){
      console.log(`Case ${testCase.input} => ${hotel.refid} => expected: ${testCase.correct_hotel_id} => Passed`.green)
    }
    else{
      console.log(`Case ${testCase.input} => ${hotel.refid} => expected: ${testCase.correct_hotel_id} => Failed`.green)
    }
  }
})
