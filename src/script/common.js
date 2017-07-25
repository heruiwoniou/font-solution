(function () {
  $(document).ready(() => {
    const src = 'style/image/background-high.jpg'
    let background = new Image()
    background.onload = () => {
      document.documentElement.style.backgroundImage = src
      background = null
    }
    background.src = src
  })
})()
