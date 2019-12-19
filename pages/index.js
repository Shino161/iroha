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
  // const handleCopy = (text) => {
  //   const input = document.createElement('input')
  //   document.body.appendChild(input)
  //   input.setAttribute('value', text)
  //   input.select()
  //   if (document.execCommand('copy')) {
  //     document.execCommand('copy');
  //     console.log('复制成功');
  //   }
  // }
  const rgb2Hex = (color) => {
    let rgb = color.split(',');
    let r = parseInt(rgb[0].split('(')[1]);
    let g = parseInt(rgb[1]);
    let b = parseInt(rgb[2].split(')')[0]);
    let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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
      let items;
      if (e.clipboardData && e.clipboardData.items) {
        items = e.clipboardData.items;
        if (items) {
          items = Array.prototype.filter.call(items, (element) => {
            return element.type.indexOf("image") >= 0;
          });
          Array.prototype.forEach.call(items, (item) => {
            let blob = item.getAsFile();
            let reader = new FileReader();
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
    <div >
      <Nav></Nav>
      <div className="container">
        <section className="left-side">
          <p>1.使用一些带有截图功能的工具，Windows 下 Ctrl + Shift + A，Mac OS 下 CMD + Shift + A </p>
          <p>2.粘贴截图到输入框<input placeholder="粘贴截图" ref={input} className="screenshot-input"></input></p>
          <p>3.在右侧的图片选取取色的点</p>
        </section>
        <div className="right-side">
          <div className="imgage-block">
            <div className="canvas-bg"></div>
            <canvas ref={canvas} className="canvas" onClick={(e) => { handlePickColor(e) }}></canvas>
          </div>
          <div className="color-block">
            <span className="color" style={{ backgroundColor: rgb }}></span>
            <div className="color-code">
              <span>{rgb}</span>
              <span>{hex}</span>
            </div>
            <span className="tips" style={{ backgroundColor: rgb }}>&nbsp;COLOR</span>
          </div>
        </div>
      </div>


      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 50px 50px 0px 50px
        }
        .left-side {
          flex:1;
          margin-right: 50px;
          color: #0d1a26;
          line-height: 30px;
        }
        .screenshot-input {
          width: 100px;
          height: 32px;
          margin-left: 10px;
          font-size: 18px;
          padding-left: 5px;
        }
        .right-side {
          flex:1;
          margin-left: 50px;
        }
        .imgage-block {
          height: 300px;
          box-shadow: 0px 0px 10px 2px #ddd;
          border-radius: 2px;
          flex-direction: column;
          padding: 5px;
          box-sizing: border-box;
        }
        .canvas {
          width: 100%;
          height: 100%;
          cursor: crosshair;
        }
        .color-block {
          margin-top: 30px;
          display: flex;
          box-shadow: 0px 0px 10px 2px #ddd;
          border-radius: 2px;
          justify-content: space-between
        }
        .color {
          width: 64px;
          height: 64px;
          color: #fff;
          border-radius: 2px;
          display: block
        }
        .color-code {
          color: #000000a6;
          margin-left: 30px;
        }
        .color-code span{
          line-height: 32px;
          display:block;
          cursor: text;
        }
        .tips {
          user-select: none;
          color: #fff;
          width: 20px;
          height: 64px;
          writing-mode: vertical-lr;
        }
        
      `}</style>
    </div>
  )
}

export default Home
