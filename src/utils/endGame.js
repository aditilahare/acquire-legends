const hasEveryHotelStable=function(hotels){
  return hotels.every(hotel=>{
    return hotel.getSize()>10;
  });
};
const isAnyAboveFourty=function(hotels){
  return hotels.some(hotel=>{
    return hotel.getSize()>40;
  });
};
const isGameOver=function(activeHotels){
  if (activeHotels.length>0) {
    return hasEveryHotelStable(activeHotels)||isAnyAboveFourty(activeHotels);
  }
  return false;
};

module.exports={
  isGameOver,
};
