/*:
 * @target MZ
 * @plugindesc Plugin de Barra de Progreso Circular Personalizable
 * 
 *
 * @help
 * Este plugin permite al usuario mostrar una barra de progreso circular en el mapa con personalizaciones básicas.
 *
 * hp : Puntos de salud actuales.
 * mhp : Puntos de salud máximos.
 * mp : Puntos de magia actuales.
 * mmp : Puntos de magia máximos.
 * atk : Ataque.
 * def : Defensa.
 * mat : Ataque mágico.
 * mdf : Defensa mágica.
 * agi : Agilidad.
 * luk : Suerte.
 * level : Nivel actual.
 * exp : Experiencia actual.
 * nextLevelExp : Experiencia necesaria para el próximo nivel.
 * name : Nombre del personaje.
 * 
 * @command showProgressBar
 * @text Mostrar Barra de Progreso
 * @desc Muestra una barra de progreso con los parámetros especificados.
 *
 * @arg id
 * @type number
 * @text ID
 * @desc ID único de la barra de progreso.
 *
 * 
 * @arg type
 * @type select
 * @text Tipo de Barra
 * @desc Elige el tipo de barra de progreso.
 * @option Círculo Completo
 * 
 * 
 * @arg actualValue
 * @type variable
 * @text Valor Actual
 * @desc Valor actual de la barra de progreso.
 *
 * @arg minValue
 * @type number
 * @text Valor mínimo
 * @desc Valor mínimo de la barra de progreso.
 *
 * @arg maxValue
 * @type number
 * @text Valor máximo
 * @desc Valor máximo de la barra de progreso.
 *
 * @arg posX
 * @type number
 * @text Posición X
 * @desc Posición horizontal de la barra de progreso en la pantalla.
 *
 * @arg posY
 * @type number
 * @text Posición Y
 * @desc Posición vertical de la barra de progreso en la pantalla.
 *
 * @arg radius
 * @type number
 * @text Radio
 * @desc Radio de la barra de progreso.
 *
 * @arg lineWidth
 * @type number
 * @text Ancho de línea
 * @desc Ancho de la línea de progreso.
 *
 * @arg color
 * @type number
 * @text Color de Relleno
 * @desc Color de relleno de la barra de progreso (valor del 0 al 31).
 *
 * @arg backgroundColor
 * @type number
 * @text Color de Fondo
 * @desc Color de fondo de la barra de progreso (valor del 0 al 31).
 *
 * @arg fontColor
 * @type number
 * @text Color de Fuente
 * @desc Color de la fuente del texto (valor del 0 al 31).
 *
 * @arg text
 * @type text
 * @text Texto personalizado
 * @desc Texto para mostrar junto a la barra de progreso.
 *
 * @arg textPosX
 * @type number
 * @text Posición X del texto
 * @desc Posición horizontal del texto en la pantalla.
 *
 * @arg textPosY
 * @type number
 * @text Posición Y del texto
 * @desc Posición vertical del texto en la pantalla.
 *
 * @arg font
 * @type text
 * @text Fuente
 * @desc Fuente del texto.
 *
 * @arg fontSize
 * @type number
 * @text Tamaño de la Fuente
 * @desc Tamaño de la fuente del texto.
 *
 */



class ProgressBar {
    constructor(id, sprite, actualValue, minValue, maxValue, posX, posY, radius, lineWidth, color, backgroundColor, text, textPosX, textPosY, font, fontSize, fontColor, type) {
        this.id = id;
        this.actualValue = actualValue;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.lineWidth = lineWidth;
        this.color = ColorManager.textColor(color);
        this.backgroundColor = ColorManager.textColor(backgroundColor);
        this.text = text;
        this.textPosX = textPosX;
        this.textPosY = textPosY;
        this.font = font;
        this.fontSize = fontSize;
        this.fontColor = ColorManager.textColor(fontColor);
        this.sprite = sprite;
        this.sprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this.type = type; // añade esto al final de tu constructor

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

PluginManager.registerCommand('ProgressBar', 'showProgressBar', args => {
    const { id, actualValue, minValue, maxValue, posX, posY, radius, lineWidth, color, backgroundColor, text, textPosX, textPosY, font, fontSize, fontColor } = args;
    let sprite = ProgressBars.list[id] ? ProgressBars.list[id].sprite : new Sprite();
    ProgressBars.list[id] = new ProgressBar(id, sprite, actualValue, minValue, maxValue, posX, posY, radius, lineWidth, color, backgroundColor, text, textPosX, textPosY, font, fontSize, fontColor);
});



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


PluginManager.registerCommand('ProgressBar', 'removeProgressBar', args => {
    const { id } = args;
    if (ProgressBars.list[id]) {
        ProgressBars.list[id].remove();
        delete ProgressBars.list[id];
    }
});

const ProgressBars = {
    list: {}
};
