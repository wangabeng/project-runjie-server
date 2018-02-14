module.exports = () => {
  var randomName = ''
  for (var i = 0; i < 4; i++) {
    randomName += String.fromCharCode(97 + Math.ceil(Math.random() * 25));
  }
  return randomName + (Math.random() + '').slice(-5, -1);
}  
