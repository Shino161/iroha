import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import './style.less'
const Home = () => {
  const canvas = useRef(null)
  const input = useRef(null)
  const [ctx, setCtx] = useState(null)
  const [rgb, setRgb] = useState('RGB值')
  const [hex, setHex] = useState('HEX值')
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
    let rgb = color.split(',')
    let r = parseInt(rgb[0].split('(')[1])
    let g = parseInt(rgb[1])
    let b = parseInt(rgb[2].split(')')[0])
    let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    return hex
  }
  const handlePickColor = (e) => {
    if (!ctx) {
      console.log('请截图！')
      return
    }
    let onePixel = ctx.getImageData(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY,
      1,
      1
    ).data
    // this.rgba = 'rgba(' + onePixel[0] + ',' + onePixel[1] + ',' + onePixel[2] + ',' + (onePixel[3] / 255) + ')'
    let rgbValue =
      'rgb(' + onePixel[0] + ',' + onePixel[1] + ',' + onePixel[2] + ')'
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
      let ratio = image.width / image.height
      if (ratio > 1) {
        context.drawImage(image, 0, 0, cvsDisplayWidth, image.height)
      } else {
        context.drawImage(image, 0, 0, image.width, cvsDisplayHeight)
      }
    }
  }
  const handlePaste = () => {
    
    input.current.addEventListener('paste', (e) => {
      let items
      if (e.clipboardData && e.clipboardData.items) {
        items = e.clipboardData.items
        if (items) {
          items = Array.prototype.filter.call(items, (element) => {
            return element.type.indexOf('image') >= 0
          })
          Array.prototype.forEach.call(items, (item) => {
            let blob = item.getAsFile()
            let reader = new FileReader()
            reader.onloadend = (event) => {
              createCanvas(event.target.result)
            }
            reader.readAsDataURL(blob)
          })
        }
      }
    })
  }
  const handleGetInputFocus = () => {
    input.current.focus()
  }
  useEffect(() => {
    handlePaste()
    handleGetInputFocus()
  }, [])
  return (
    <div>
      <div className="container">
        <div className="top">
          <div className="title">
            <span style={{ color: '#cf1322' }}>I</span>
            <span style={{ color: '#d48806' }}>r</span>
            <span style={{ color: '#7cb305' }}>o</span>
            <span style={{ color: '#096dd9' }}>h</span>
            <span style={{ color: '#531dab' }}>a</span>
          </div>
          <div className="sub-title">
            <input
              placeholder="粘贴截图"
              ref={input}
              className="screenshot-input"
              onBlur={handleGetInputFocus}
            ></input>
          </div>
        </div>
        <div className="content">
          <section className="left-side">
            <div className="imgage-block">
              <div className="canvas-bg"></div>
              <canvas
                ref={canvas}
                className="canvas"
                onClick={(e) => {
                  handlePickColor(e)
                }}
              ></canvas>
            </div>
          </section>
          <div className="right-side">
            <div className="color-block" style={{ backgroundColor: rgb }}>
              <span className="color-block-text">Background</span>
            </div>
            <div className="color-display">
              <span>{hex}</span>
              <span>{rgb}</span>
            </div>
            <span style={{ color: '#bfbfbf'}}>Right click and copy</span>
          </div>
        </div>
      </div>
      <div className="line-block" style={{ backgroundColor: rgb }}>
        <div>Just paste your screenshot</div>
      </div>
    </div>
  )
}

export default Home
