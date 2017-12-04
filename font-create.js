import fontCarrier from 'font-carrier'
import fs from 'fs'
import mkdir from 'make-dir'

export default {
  createFont (urls, font, out) {
    const transFont = fontCarrier.transfer(font)
    return new Promise((resolve) => {
      var fonts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

      urls.forEach(url => {
        var str = fs.readFileSync(url, 'utf-8')
        var reg = /[0-9,\u4E00-\u9FA5\uF900-\uFA2D]/ig, match
        while ((match = reg.exec(str))) {
          fonts.push(match[0])
        }
      })
      transFont.min(fonts.join(''))
      if (!fs.existsSync(out)) {
        var path = out.split('\\')
        path.pop()

        mkdir.sync(path.join('\\'))
      }
      transFont.output({
        path: out
      })

      resolve()
    })
  }
}
