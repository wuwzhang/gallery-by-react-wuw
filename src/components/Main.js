require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'

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


/*
*获取区间内的值
 */
let getRangeRandom = function (low, high) {
  return Math.floor(Math.random() * (high - low)) + low;
}

/*
* 获取正负范围内的旋转角度值
 */
let getDegRandom = function (range) {
  return (Math.random() < 0.5 ? '' : '-') + Math.floor(Math.random() * range);
}

class ImageFigure extends React.Component {
  constructor(props) {
    super(props);

    this.state ={};
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    this.props.inverse();
    event.preventDefault();
    event.stopPropagation();
  }
  render() {
    let styleObj = {},
        imgMsg = this.props.imgMsg;

    if (imgMsg.pos) {
      styleObj = imgMsg.pos;
    }
    if (imgMsg.rotate) {
      (['Moz', 'Webkit', 'Ms', '']).forEach(function (value) {
        styleObj[value + 'Transform'] = 'rotate(' + imgMsg.rotate +'deg)';
      }.bind(this));
    }

    let imageFigureClassName = 'img-figure';
        imageFigureClassName += imgMsg.isInverse ? ' is-inverse' : '';
    return (
      <figure className={imageFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.description}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class GalleryByReactApp extends React.Component {
  Constant = {
    centerPos: {    //居中图片取值范围
      left: 0,
      top: 0
    },
    hPosRange: {   //两侧图片取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {   //上方图片取值范围
      leftX: [0, 0],
      topY: [0, 0]
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      imagesArrageArr: [
        /*{
          pos: {                     //图片相对位置
            left: 0,
            yop: 0
          },
          rotate: 0,                 //图片旋转角度
          isInverse: false           //图片是否翻转
        }*/
      ]
    };
  }

  inverse(index) {
    return function () {
      let imagesArrageArr = this.state.imagesArrageArr;

      imagesArrageArr[index].isInverse = !imagesArrageArr[index].isInverse;

      this.setState({
        imagesArrageArr: imagesArrageArr
      });
    }.bind(this);
  }


  /**
   * 排布图片信息
   * @param  {number} centerIndex 位于中心的图片位置
   * @return {}
   */
  _reArrage(centerIndex) {
    var imagesArrageArr = this.state.imagesArrageArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        hPosRangeLeftX = hPosRange.leftSecX,
        hPosRangeRightX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRange = Constant.vPosRange,
        vPosRangeX = vPosRange.leftX,
        vPosRangeY = vPosRange.topY;

    var centerImageArrageArr = imagesArrageArr.splice(centerIndex, 1),
        topImageArragerArr = [],
        topImageSpliceIndex = 0,
        topImageNum = Math.floor(Math.random() * 2);

        // console.log(topImageNum);

    //居中图片的状态信息
    centerImageArrageArr[0] = {
      pos: centerPos,
      rotate: 0,          //居中图片不旋转
      isInverse: false
    }

    //上方图片信息
    topImageSpliceIndex = Math.floor(Math.random() * (imagesArrageArr.length - topImageNum));
    topImageArragerArr = imagesArrageArr.splice(topImageSpliceIndex, topImageNum);

    topImageArragerArr.forEach(function(value, index) {
      topImageArragerArr[index] = {
        pos: {
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
          top: getRangeRandom(vPosRangeY[0], vPosRangeY[1])
        },
        rotate: getRangeRandom(30),           //图片旋转角度为正负30度
        isInverse: false
      }
    });

    //两侧图片信息
    for (let i = 0, len = imagesArrageArr.length, halfLen = len / 2; i < len; i++) {
      let hPosRangeX = null;

      if (i < halfLen) {
        hPosRangeX = hPosRangeLeftX;
      } else {
        hPosRangeX = hPosRangeRightX;
      }

      imagesArrageArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeX[0], hPosRangeX[1])
        },
        rotate: getDegRandom(30),
        isInverse: false
      }
    }

    //合并上方图片
    if (topImageArragerArr && topImageArragerArr[0]) {
      imagesArrageArr.splice(topImageSpliceIndex, 0, topImageArragerArr[0]);
    }

    imagesArrageArr.splice(centerIndex, 0, centerImageArrageArr[0]);

    this.setState({
      imagesArrageArr: imagesArrageArr
    });
  }
  //组建加载后计算每张图片的位置和大小
  componentDidMount() {
    //获取舞台大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    //拿到一个imageFigure大小
    var imgDOM = ReactDOM.findDOMNode(this.refs.imageFigure0),
        imgW = imgDOM.scrollWidth,
        imgH = imgDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //计算两侧图片的取值范围
    this.Constant.hPosRange.leftSecX = [-halfImgW, halfStageW - halfImgW * 3];
    this.Constant.hPosRange.rightSecX = [halfStageW + halfImgW, stageW - halfImgW];
    this.Constant.hPosRange.y = [-halfImgH, stageH - halfImgH];

    //计算上方图片的取值范围
    this.Constant.vPosRange.leftX = [halfStageW - imgW, halfStageW];
    this.Constant.vPosRange.topY = [-halfImgH, halfStageH - halfImgH * 3];

    this._reArrage(0);

  }
  render() {

    let controllers = [],
        imageFiguers = [];

    imagesData.forEach(function (value, index) {

      if (!this.state.imagesArrageArr[index]) {
        this.state.imagesArrageArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false
        };
      }

      imageFiguers.push(<ImageFigure data={value} key={index}
                          ref={'imageFigure' + index} imgMsg={this.state.imagesArrageArr[index]}
                          inverse={this.inverse(index)}/>);
    }.bind(this));

    return (
      <section className="stage" ref="stage">
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
