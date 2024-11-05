const defaultImages = [
  require('./../assets/images/1.jpg'),
  require('./../assets/images/2.jpg'),
  require('./../assets/images/3.jpg'),
  require('./../assets/images/4.jpg'),
  require('./../assets/images/5.jpg'),
  require('./../assets/images/6.jpg'),
  require('./../assets/images/7.jpg'),
  require('./../assets/images/8.jpg'),
  require('./../assets/images/9.jpg'),
  require('./../assets/images/10.jpg'),
  require('./../assets/images/11.jpg'),
  require('./../assets/images/12.jpg'),
  require('./../assets/images/13.jpg'),
  require('./../assets/images/14.jpg'),
  require('./../assets/images/15.jpg'),
  require('./../assets/images/16.jpg'),
  require('./../assets/images/17.jpg'),
  require('./../assets/images/18.jpg')
]

const getDefaultImage = () => {
  const randomIndex = Math.floor(Math.random() * defaultImages.length);
  return defaultImages[randomIndex];
};

module.exports = { getDefaultImage }