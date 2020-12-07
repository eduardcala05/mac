const Positioner = require('electron-positioner')

getTrayPosition = (trayWindow)=>{
    const positioner = new Positioner(trayWindow)
    positioner.move('topRight')
    const {x,y} = positioner.calculate('trayCenter', trayWindow.getBounds())
    return {x,y}
}

module.exports = {
    getTrayPosition
}
