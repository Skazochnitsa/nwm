/**
 * This is a hot loadable layout for nwm. See module.exports 
 * at end of the file for details.
 *
 * Bottom Stack Tiling (a.k.a. wide)
 *
 *  +----------+----------+ +----------+----------+
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  +---------------------+ +---------------------+
 *  |                     | |          |          |
 *  |                     | |          |          |
 *  |                     | |          |          |
 *  +---------------------+ +---------------------+
 *        2 windows               3 windows
 *
 *  +---------------------+ +---------------------+
 *  |                     | |                     |
 *  |                     | |                     |
 *  |                     | |                     |
 *  +------+-------+------+ +----+-----+-----+----+
 *  |      |       |      | |    |     |     |    |
 *  |      |       |      | |    |     |     |    |
 *  |      |       |      | |    |     |     |    |
 *  +------+-------+------+ +----+-----+-----+----+
 *        4 windows               5 windows
 */
function wide(workspace) {
  // the way DWM does it is to reserve half the screen for the first screen,
  // then split the other half among the rest of the screens
  var windows = workspace.visible();
  var screen = workspace.monitor;
  var window_ids = Object.keys(windows);
  if(window_ids.length < 1) {
    return;
  }
  var mainId = workspace.mainWindow;
  if(window_ids.length == 1) {
    windows[mainId].move(0, 0);
    windows[mainId].resize(screen.width, screen.height);
  } else {
    // when main scale = 50, the divisor is 2
    var mainScaleFactor = (100 / workspace.getMainWindowScale() );
    var halfHeight = Math.floor(screen.height / mainScaleFactor);
    windows[mainId].move(0, 0);
    windows[mainId].resize(screen.width, halfHeight);
    // remove from visible
    window_ids = window_ids.filter(function(id) { return (id != mainId); });
    var remainHeight = screen.height - halfHeight;
    var sliceWidth = Math.floor(screen.width / (window_ids.length) );
    window_ids.forEach(function(id, index) {
      windows[id].move(index*sliceWidth, halfHeight);
      windows[id].resize(sliceWidth, remainHeight);
    });
  }
};

// Hot loading works like this:
// You export a callback function, which gets called every time 
// a hot load needs to occur. 
// The function gets the running instance of nwm, and does it's thing
// e.g. adds a new layout etc.
module.exports = function(nwm) {
  nwm.addLayout('wide', wide);
};