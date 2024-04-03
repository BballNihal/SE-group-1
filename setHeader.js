function setHeader(resMsg){
    if (!resMsg.headers || resMsg.headers === null) {
        resMsg.headers = {};
      }
      if (!resMsg.headers["Content-Type"]) {
        resMsg.headers["Content-Type"] = "application/json";
      }
  
  }
  module.exports = setHeader;