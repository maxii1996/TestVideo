/*:
 * @target MZ
 * @plugindesc Customizable Circular Progress Bar Plugin 2
 * 
 *
 * @help
 * This plugin allows the user to display a circular progress bar on the map with basic customizations.
 *
 * hp : Current health points.
 * mhp : Maximum health points.
 * mp : Current magic points.
 * mmp : Maximum magic points.
 * atk : Attack.
 * def : Defense.
 * mat : Magic attack.
 * mdf : Magic defense.
 * agi : Agility.
 * luk : Luck.
 * level : Current level.
 * exp : Current experience.
 * nextLevelExp : Experience needed for the next level.
 * name : Character's name.
 * 
 * 
 * 
 * @command generateNewCircularBar
 * @text Generate New Circular Bar
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
 * 
 * @arg actualValue
 * @type variable
 * @text Current Value
 * @desc Current value of the progress bar.
 *
 * @arg minValue
 * @type variable
 * @text Minimum Value
 * @desc Minimum value of the progress bar.
 *
 * @arg maxValue
 * @type variable
 * @text Maximum Value
 * @desc Maximum value of the progress bar.
 *
 * @arg posX
 * @type variable
 * @text Position X
 * @desc Horizontal position of the progress bar on the screen.
 *
 * @arg posY
 * @type variable
 * @text Position Y
 * @desc Vertical position of the progress bar on the screen.
 *
 * @arg radius
 * @type variable
 * @text Radius
 * @desc Radius of the progress bar.
 *
 * @arg lineWidth
 * @type variable
 * @text Line Width
 * @desc Width of the progress line.
 *
 * @arg color
 * @type variable
 * @text Fill Color
 * @desc Fill color of the progress bar.
 *
 * @arg backgroundColor
 * @type variable
 * @text Background Color
 * @desc Background color of the progress bar.
 *
 * @arg fontColor
 * @type variable
 * @text Font Color
 * @desc Font color of the text.
 *
 * @arg text
 * @type text
 * @text Custom Text
 * @desc Text to display alongside the progress bar.
 *
 * @arg textPosX
 * @type variable
 * @text Text Position X
 * @desc Horizontal position of the text on the screen.
 *
 * @arg textPosY
 * @type variable
 * @text Text Position Y
 * @desc Vertical position of the text on the screen.
 *
 * @arg font
 * @type text
 * @text Font
 * @desc Font of the text.
 *
 * @arg fontSize
 * @type variable
 * @text Font Size
 * @desc Font size of the text.
 *
 * @arg switchId
 * @type switch
 * @text Switch ID
 * @desc ID of the switch that controls the visibility of the progress bar.
 *
 * @command hideAllProgressBars
 * @text Hide All Progress Bars
 * @desc Hides all existing progress bars.
 *
 * @command showAllProgressBars
 * @text Show All Progress Bars
 * @desc Shows all existing progress bars if they have already been initialized.
 *
 */


class ProgressBar {
    constructor(id, sprite, actualValue, minValue, maxValue, posX, posY, radius, lineWidth, color, backgroundColor, text, textPosX, textPosY, font, fontSize, fontColor, switchId) {
        this.id = id;
        this.actualValue = actualValue;
        this.minValue = $gameVariables.value(minValue);
        this.maxValue = $gameVariables.value(maxValue);
        this.switchId = switchId;
        this.posX = $gameVariables.value(posX);
        this.posY = $gameVariables.value(posY);
        this.radius = $gameVariables.value(radius);
        this.lineWidth = $gameVariables.value(lineWidth);
        this.color = ColorManager.textColor($gameVariables.value(color));
        this.backgroundColor = ColorManager.textColor($gameVariables.value(backgroundColor));
        this.text = text;
        this.textPosX = $gameVariables.value(textPosX);
        this.textPosY = $gameVariables.value(textPosY);
        this.font = font;
        this.fontSize = $gameVariables.value(fontSize);
        this.fontColor = ColorManager.textColor($gameVariables.value(fontColor));
        this.sprite = sprite;
        this.sprite.bitmap = new Bitmap(Graphics.width, Graphics.height);

        SceneManager._scene.addChild(this.sprite);
    }

    draw() {
        if (this.switchId && $gameSwitches.value(this.switchId)) {
            return;
        }
    
        let value = $gameVariables.value(this.actualValue);
        value = Math.min(Math.max(value, this.minValue), this.maxValue);
        $gameVariables.setValue(this.actualValue, value);
        let progress = (value - this.minValue) / (this.maxValue - this.minValue);
        progress = Math.max(0, Math.min(1, progress));
    
        this.sprite.bitmap.clear();
        const context = this.sprite.bitmap.context;
        context.beginPath();
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.backgroundColor;
        context.stroke();
    
        context.beginPath();
        context.arc(this.posX, this.posY, this.radius, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.color;
        context.stroke();
    
        let processedText = this.processText(this.text);
        context.font = `${this.fontSize}px ${this.font}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = this.fontColor;
        context.fillText(processedText, this.textPosX, this.textPosY);
    }
    
    

    remove() {
        SceneManager._scene.removeChild(this.sprite);
    }

    processText(text) {
        text = text.replace(/\\v\[(\d+)\]/g, (_, p1) => $gameVariables.value(Number(p1)));
        text = text.replace(/\\c\[(\d+)\]/g, (_, p1) => `\\c[${Number(p1)}]`);
        text = text.replace(/\\party1\[(\w+)\]/g, (_, p1) => $gameParty.members()[0] ? (typeof $gameParty.members()[0][p1] === "function" ? $gameParty.members()[0][p1]() : $gameParty.members()[0][p1]) : 0);
        text = text.replace(/\\party2\[(\w+)\]/g, (_, p1) => $gameParty.members()[1] ? (typeof $gameParty.members()[1][p1] === "function" ? $gameParty.members()[1][p1]() : $gameParty.members()[1][p1]) : 0);
        text = text.replace(/\\party3\[(\w+)\]/g, (_, p1) => $gameParty.members()[2] ? (typeof $gameParty.members()[2][p1] === "function" ? $gameParty.members()[2][p1]() : $gameParty.members()[2][p1]) : 0);
        text = text.replace(/\\party4\[(\w+)\]/g, (_, p1) => $gameParty.members()[3] ? (typeof $gameParty.members()[3][p1] === "function" ? $gameParty.members()[3][p1]() : $gameParty.members()[3][p1]) : 0);
        return text;
    }
}



const _Scene_Base_start = Scene_Base.prototype.start;
Scene_Base.prototype.start = function() {
    _Scene_Base_start.call(this);
    for (let id in ProgressBars.list) {
        ProgressBars.list[id].draw();
    }
};

const _Scene_Base_terminate = Scene_Base.prototype.terminate;
Scene_Base.prototype.terminate = function() {
    _Scene_Base_terminate.call(this);
    for (let id in ProgressBars.list) {
        ProgressBars.list[id].remove();
    }
};

const _Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    for (let id in ProgressBars.list) {
        if (!this.children.includes(ProgressBars.list[id].sprite)) {
            this.addChild(ProgressBars.list[id].sprite);
        }
        ProgressBars.list[id].draw();
    }
};

const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    for (let id in ProgressBars.list) {
        if (!this.children.includes(ProgressBars.list[id].sprite)) {
            this.addChild(ProgressBars.list[id].sprite);
        }
        ProgressBars.list[id].draw();
    }
};

const _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    for (let id in ProgressBars.list) {
        ProgressBars.list[id].draw();
    }
};

PluginManager.registerCommand('ProgressBar', 'generateNewCircularBar', args => {
    const { id, actualValue, minValue, maxValue, posX, posY, radius, lineWidth, color, backgroundColor, text, textPosX, textPosY, font, fontSize, fontColor, switchId } = args;
    let sprite = ProgressBars.list[id] ? ProgressBars.list[id].sprite : new Sprite();
    ImageManager.loadSystem('Window').addLoadListener(() => {
        ProgressBars.list[id] = new ProgressBar(id, sprite, actualValue, minValue, maxValue, posX, posY, radius, lineWidth, color, backgroundColor, text, textPosX, textPosY, font, fontSize, fontColor, switchId);
    });
});



PluginManager.registerCommand('ProgressBar', 'removeProgressBar', args => {
    const { id } = args;
    if (ProgressBars.list[id]) {
        ProgressBars.list[id].remove();
        delete ProgressBars.list[id];
    }
});



PluginManager.registerCommand('ProgressBar', 'hideAllProgressBars', args => {
    for (let id in ProgressBars.list) {
        ProgressBars.list[id].sprite.visible = false;
    }
});


PluginManager.registerCommand('ProgressBar', 'showAllProgressBars', args => {
    for (let id in ProgressBars.list) {
        ProgressBars.list[id].sprite.visible = true;
    }
});



const ProgressBars = {
    list: {}
};
