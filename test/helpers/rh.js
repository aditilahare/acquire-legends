const shouldHaveIdCookie = function (res) {
  let keys = Object.keys(res.headers);
  let key = keys.find((header)=>header.match(/set-cookie/i));
  let playerId=res.headers[key].find(header=>header.match(/playerId/));
  if(!playerId) {
    throw new Error('Does not have player Id as cookie');
  }
};

exports.shouldHaveIdCookie = shouldHaveIdCookie;
