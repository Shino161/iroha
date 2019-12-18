import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'

const Home = () => {
  const canvas = useRef(null);
  const input = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [rgb, setRgb] = useState(null);
  const [hex, setHex] = useState(null);
  const rgb2Hex = (color) => {
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
  }
  const handlePickColor = (e) => {
    let onePixel = ctx.getImageData(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 1, 1).data
    // this.rgba = 'rgba(' + onePixel[0] + ',' + onePixel[1] + ',' + onePixel[2] + ',' + (onePixel[3] / 255) + ')'
    let rgbValue = 'rgb(' + onePixel[0] + ',' + onePixel[1] + ',' + onePixel[2] + ')';
    let hexValue = rgb2Hex(rgbValue)
    setRgb(rgbValue)
    setHex(hexValue)
  }
  const createCanvas = (imgData) => {
    let cvsDOM = canvas.current
    let context = cvsDOM.getContext('2d')
    setCtx(context)
    let cvsDisplayWidth = cvsDOM.offsetWidth
    let cvsDisplayHeight = cvsDOM.offsetHeight
    cvsDOM.width = cvsDisplayWidth
    cvsDOM.height = cvsDisplayHeight
    let image = new Image()
    image.src = imgData
    image.onload = () => {
      context.drawImage(image, 0, 0, cvsDisplayWidth, cvsDisplayHeight)
    }
  }
  const handlePaste = () => {
    input.current.addEventListener('paste', (e) => {
      var items;
      if (e.clipboardData && e.clipboardData.items) {
        items = e.clipboardData.items;
        if (items) {
          items = Array.prototype.filter.call(items, (element) => {
            return element.type.indexOf("image") >= 0;
          });
          Array.prototype.forEach.call(items, (item) => {
            var blob = item.getAsFile();
            var reader = new FileReader();
            reader.onloadend = (event) => {
              createCanvas(event.target.result)
            };
            reader.readAsDataURL(blob);
          });
        }
      }
    })
  }
  // useEffect(() => {
  //   // ctx变动后触发的effect
  // }, [ctx])
  useEffect(() => {
    handlePaste()
  }, []);
  return (
    <div>
      <div className="hero">
        <div className="container">
          <div className="imgage-block">
            <canvas ref={canvas} className="canvas" onClick={(e) => { handlePickColor(e) }}></canvas>
            <input placeholder="粘贴截图" ref={input} className="input-image"></input>
          </div>
          <div className="color-block">
            <span className="color" style={{ backgroundColor: rgb }}></span>
            <section className="color-code">
              <p>{rgb}</p>
              <p>{hex}</p>
            </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          width: 600px;
          height: 600px;
          box-shadow: 0px 0px 10px 2px #ddd;
          border-radius: 2px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          padding: 5px;
          box-sizing: border-box;
        }
        .imgage-block {
          width: 100%;  
        }
        .canvas {
          width: 100%;
          height: 300px;
          cursor: crosshair;
        }
        .input-image {
          margin-top: 30px;
          width: 200px;
        }
        .color-block {
          margin-top: 30px;
          display: flex;
        }
        .color {
          width: 60px;
          height: 60px;
          color: #fff;
          border-radius: 2px;
          display: block

        }
        .color-code {
          color: #3d3d3d;
          margin-left: 10px;
        }
      `}</style>
    </div>
  )
}

export default Home
