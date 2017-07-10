require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//导入图片信息的JSON文件
let imagesData = require('../data/imagesData.json');

/**
 * 将图片名转换为相应的URL
 * @param  {array} imagesDataArr) {             for (let i 每张图片的数据
 * @return {array}                具有图片的URL的对象数组
 */
imagesData = (function getImagesURL(imagesDataArr) {

  for (let i = 0, len = imagesDataArr.length; i < len; i++) {

    let thisImageData = imagesDataArr[i];
    thisImageData.imageURL = require('../images/' + thisImageData.fileName);

    imagesDataArr[i] = thisImageData;
  }

  return imagesDataArr;
})(imagesData);


class ImageFigure extends React.Component {
  render() {
    return (
      <figure className="img-firgue">
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class GalleryByReactApp extends React.Component {
  render() {

    let controllers = [],
        imageFiguers = [];

    imagesData.forEach(function (value, index) {
      imageFiguers.push(<ImageFigure data={value} key={index} />);
    });

    return (
      <section className="stage">
        <section className="image-sec">
          {imageFiguers}
        </section>
        <nav className="controller-nav">
          {controllers}
        </nav>
      </section>

    );
  }
}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
