/*:
 * @target MZ
 * @plugindesc Create circular progress bars with lots of customization! (DEMO VERSION!)
 * @url https://undermax.itch.io/
 * @author Maxii1996 | Undermax Games
 *
 * 
 * 
    * @command showProgressBar
    * @text Show Progress Bar
    * @desc Displays a progress bar with the specified parameters.
    * 
    * @arg id
    * @type number
    * @text ID
    * @desc Unique ID of the progress bar.
    *
    * @arg type
    * @type select
    * @text Type of Bar
    * @desc Choose the type of progress bar.
    * @option Full Circle
    * @default Full Circle
    * 
    * @arg actualValue
    * @type variable
    * @text Current Value
    * @desc Current value of the progress bar.
    *
    * @arg minValue
    * @type number
    * @text Minimum Value
    * @desc Minimum value of the progress bar.
    *
    * @arg maxValue
    * @type number
    * @text Maximum Value
    * @desc Maximum value of the progress bar.
    *
    * @arg posX
    * @type number
    * @text Position X
    * @desc Horizontal position of the progress bar on the screen.
    *
    * @arg posY
    * @type number
    * @text Position Y
    * @desc Vertical position of the progress bar on the screen. 
    *
    * @command hideAllProgressBars
    * @text Hide All Progress Bars
    * @desc This disable the bar system. If you want to hide a specific bar, use Hide by ID.
    *
    * @command showAllProgressBars
    * @text Show All Progress Bars
    * @desc This enables the bar system. If you want to show a specific bar, use Show by ID.
    *
  
    * 
    */


class ProgressBar {
  constructor(
    id,
    sprite,
    actualValue,
    minValue,
    maxValue,
    posX,
    posY
  ) {
    this.id = id;
    this.targetOpacity = sprite.opacity;
    this.actualValue = actualValue;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.posX = posX;
    this.posY = posY;
    this.radius = 55;
    this.lineWidth = 6;
    this.color = ['#3335a3', '#4b00fa', '#c700d9'];
    this.backgroundColor = '#24263044';
    this.sprite = sprite;
    this.sprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
    this.progressBarValue = $gameVariables.value(this.actualValue);
    SceneManager._scene.addChild(this.sprite);
  }

  draw() {
    let targetValue = $gameVariables.value(this.actualValue);
    targetValue = Math.min(Math.max(targetValue, this.minValue), this.maxValue);
    $gameVariables.setValue(this.actualValue, targetValue);

    let percentage = (targetValue - this.minValue) / (this.maxValue - this.minValue);
    let angle = percentage * Math.PI * 2;

    this.sprite.bitmap.clear();
    this.sprite.bitmap.drawCircle(this.posX, this.posY, this.radius, this.backgroundColor);

    let context = this.sprite.bitmap.context;
    context.strokeStyle = this.color[0];
    context.lineWidth = this.lineWidth;
    context.beginPath();
    context.arc(this.posX, this.posY, this.radius, 0, angle);
    context.stroke();
}



  hide() {
      this.targetOpacity = 0;
  }

  show() {
      this.targetOpacity = 255;
  }

  update() {
      this.sprite.opacity += (this.targetOpacity - this.sprite.opacity) * 0.1;
      if (this.sprite.opacity > 0) {
          this.draw();
      }
  }
}

let $progressBars = [];

PluginManager.registerCommand('CircleBarMZDemo', 'showProgressBar', args => {
  let id = 1;
  let actualValue = Number(args.actualValue);
  let minValue = Number(args.minValue);
  let maxValue = Number(args.maxValue);
  let posX = Number(args.posX);
  let posY = Number(args.posY);

  let sprite = new Sprite();
  let progressBar = new ProgressBar(id, sprite, actualValue, minValue, maxValue, posX, posY);
  $progressBars.push(progressBar);
});

PluginManager.registerCommand('CircleBarMZDemo', 'hideAllProgressBars', args => {
  $progressBars.forEach(progressBar => {
      progressBar.hide();
  });
});

PluginManager.registerCommand('CircleBarMZDemo', 'showAllProgressBars', args => {
  $progressBars.forEach(progressBar => {
      progressBar.show();
  });
});



const _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  _Scene_Map_update.call(this);
  $progressBars.forEach(progressBar => {
      progressBar.update();
  });
};

