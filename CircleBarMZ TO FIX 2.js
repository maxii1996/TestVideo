/*:
 * @target MZ
 * @plugindesc Customizable Circular Progress Bar Plugin (Version 1)
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
 * Color 0: Red
 * Color 1: Orange
 * Color 2: Amber
 * Color 3: Yellow
 * Color 4: Lime
 * Color 5: Chartreuse
 * Color 6: Green
 * Color 7: Spring Green
 * Color 8: Cyan
 * Color 9: Azure
 * Color 10: Blue
 * Color 11: Navy
 * Color 12: Indigo
 * Color 13: Purple
 * Color 14: Violet
 * Color 15: Magenta
 * Color 16: Pink
 * Color 17: Salmon
 * Color 18: Peach
 * Color 19: Coral
 * Color 20: Gold
 * Color 21: Silver
 * Color 22: Gray
 * Color 23: Dark Gray
 * Color 24: Brown
 * Color 25: Maroon
 * Color 26: Olive
 * Color 27: Beige
 * Color 28: Ivory
 * Color 29: Cream
 * Color 30: White
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
 * @arg radius
 * @type number
 * @text Radius
 * @desc Radius of the progress bar.
 *
 * @arg lineWidth
 * @type number
 * @text Line Width
 * @desc Width of the progress line.
 *
 * @arg color1
 * @type number
 * @text Fill Color 1
 * @desc First fill color of the progress bar (value from 0 to 31).
 *
 * @arg color2
 * @type number
 * @text Fill Color 2
 * @desc Second fill color of the progress bar (value from 0 to 31).
 *
 * @arg color3
 * @type number
 * @text Fill Color 3
 * @desc Third fill color of the progress bar (value from 0 to 31).
 *
 * @arg backgroundColor
 * @type number
 * @text Background Color
 * @desc Background color of the progress bar (value from 0 to 31).
 *
 * @arg fontColor
 * @type number
 * @text Font Color
 * @desc Font color of the text (value from 0 to 31).
 *
 * @arg text
 * @type text
 * @text Custom Text
 * @desc Text to display alongside the progress bar.
 *
 * @arg textPosX
 * @type number
 * @text Text Position X
 * @desc Horizontal position of the text on the screen.
 *
 * @arg textPosY
 * @type number
 * @text Text Position Y
 * @desc Vertical position of the text on the screen.
 *
 * @arg font
 * @type text
 * @text Font
 * @desc Font of the text.
 *
 * @arg fontSize
 * @type number
 * @text Font Size
 * @desc Font size of the text.
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
    constructor(id, sprite, actualValue, minValue, maxValue, posX, posY, radius, lineWidth, color1, color2, color3, backgroundColor, text, textPosX, textPosY, font, fontSize, fontColor, type) {
        this.id = id;
        this.actualValue = actualValue;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.lineWidth = lineWidth;
        this.color = [this.parseColor(color1), this.parseColor(color2), this.parseColor(color3)];
        this.backgroundColor = this.parseColor(backgroundColor);
        this.text = text;
        this.textPosX = textPosX;
        this.textPosY = textPosY;
        this.font = font;
        this.fontSize = fontSize;
        this.fontColor = this.parseColor(fontColor);
        this.sprite = sprite;
        this.sprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this.type = type;

        SceneManager._scene.addChild(this.sprite);
    }

   
    
    draw() {
  
        let value = $gameVariables.value(this.actualValue);
        value = Math.min(Math.max(value, this.minValue), this.maxValue);
        $gameVariables.setValue(this.actualValue, value);
        let progress = (value - this.minValue) / (this.maxValue - this.minValue);
        progress = Math.max(0, Math.min(1, progress));

        this.sprite.bitmap.clear();
        const context = this.sprite.bitmap.context;
        context.imageSmoothingEnabled = true; // Habilitar antialiasing

        context.beginPath();
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.backgroundColor;
        context.stroke();

        context.beginPath();
        context.arc(this.posX, this.posY, this.radius, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
        context.lineWidth = this.lineWidth;
        const gradient = context.createLinearGradient(0, 0, this.posX, this.posY);
        gradient.addColorStop(0, this.color[0]);
        gradient.addColorStop(0.5, this.color[1]);
        gradient.addColorStop(1, this.color[2]);
        context.strokeStyle = gradient;
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



    parseColor(colorNumber) {
        // Define your famous colors here
        const colors = [
            '#FF0000',  // Color 0: Red
            '#FFA500',  // Color 1: Orange
            '#FFFF00',  // Color 2: Yellow
            '#00FF00',  // Color 3: Green
            '#0000FF',  // Color 4: Blue
            '#800080',  // Color 5: Purple
            '#FF00FF',  // Color 6: Magenta
            '#008080',  // Color 7: Teal
            '#FFC0CB',  // Color 8: Light Pink
            '#FF8C00',  // Color 9: Dark Orange
            '#FFFFE0',  // Color 10: Light Yellow
            '#008000',  // Color 11: Dark Green
            '#00FFFF',  // Color 12: Cyan
            '#000080',  // Color 13: Navy
            '#FF69B4',  // Color 14: Hot Pink
            '#FFD700',  // Color 15: Gold
            '#FF4500',  // Color 16: Orange Red
            '#FF6347',  // Color 17: Coral
            '#7FFFD4',  // Color 18: Aquamarine
            '#000000',  // Color 19: Black
            '#808080',  // Color 20: Gray
            '#C0C0C0',  // Color 21: Silver
            '#FF1493',  // Color 22: Deep Pink
            '#008B8B',  // Color 23: Dark Cyan
            '#00008B',  // Color 24: Dark Blue
            '#FF7F50',  // Color 25: Coral
            '#F08080',  // Color 26: Light Coral
            '#CD5C5C',  // Color 27: Dark Red
            '#6A5ACD',  // Color 28: Slate Blue
            '#B8860B',  // Color 29: Dark Goldenrod
            '#D2691E',  // Color 30: Chocolate
            '#8B4513',  // Color 31: Dark Brown
            '#2E8B57',  // Color 32: Sea Green
            '#FF8C69',  // Color 33: Light Salmon
            '#BDB76B',  // Color 34: Dark Khaki
            '#A0522D',  // Color 35: Sienna
            '#FFDAB9',  // Color 36: Peach Puff
            '#DC143C',  // Color 37: Crimson
            '#00CED1',  // Color 38: Dark Turquoise
            '#4682B4',  // Color 39: Steel Blue
            '#FFFFFF',  // Color 40: White
            '#000000',  // Color 41: Black
        ];
    
        return colors[Number(colorNumber) % colors.length] || '#FFFFFF'; // Make sure to return a default value
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

PluginManager.registerCommand('ProgressBar', 'showProgressBar', args => {
    const { id, actualValue, minValue, maxValue, posX, posY, radius, lineWidth, color1, color2, color3, backgroundColor, text, textPosX, textPosY, font, fontSize, fontColor } = args;
    let sprite = ProgressBars.list[id] ? ProgressBars.list[id].sprite : new Sprite();
    ImageManager.loadSystem('Window').addLoadListener(() => {
        ProgressBars.list[id] = new ProgressBar(id, sprite, actualValue, minValue, maxValue, posX, posY, radius, lineWidth, color1, color2, color3, backgroundColor, text, textPosX, textPosY, font, fontSize, fontColor);
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
