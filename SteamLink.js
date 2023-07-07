/*:
 * @target MZ
 * @plugindesc Integrate your game with the Steamworks SDK - 1.00.01
 * <pluginName:SteamLink>
 * @author Maxii1996 (Based on Hudell Base)
 * @url 
 *
 * @help
*/
(function () {
'use strict';

globalThis.SteamLinkPatcher = class {
  static initialize(t) {
      this.pluginName = t, this.superClasses = new Map;
  }
  static _descriptorIsProperty(t) {
      return t.get || t.set || !t.value || "function" != typeof t.value
  }
  static _getAllClassDescriptors(t, e = !1) {
      if (t === Object) return {};
      const r = Object.getOwnPropertyDescriptors(e ? t.prototype : t);
      let s = {};
      if (t.prototype) {
          const r = Object.getPrototypeOf(t.prototype).constructor;
          r !== Object && (s = this._getAllClassDescriptors(r, e));
      }
      return Object.assign({}, s, r)
  }
  static _assignDescriptor(t, e, r, s, a = !1) {
      if (this._descriptorIsProperty(r)) r.get || r.set ? Object.defineProperty(t, s, {
          get: r.get,
          set: r.set,
          enumerable: r.enumerable,
          configurable: r.configurable
      }) : Object.defineProperty(t, s, {
          value: r.value,
          enumerable: r.enumerable,
          configurable: r.configurable
      });
      else {
          let r = s;
          if (a)
              for (; r in t;) r = `_${r}`;
          t[r] = e[s];
      }
  }
  static _applyPatch(t, e, r, s, a = !1) {
      const n = this._getAllClassDescriptors(t, a),
          i = a ? t.prototype : t,
          o = a ? e.prototype : e,
          l = Object.getOwnPropertyDescriptors(o);
      let u = !1;
      for (const t in l) {
          if (s.includes(t)) continue;
          if (t in n) {
              u = !0;
              const e = n[t];
              this._assignDescriptor(r, i, e, t, !0);
          }
          const e = l[t];
          this._assignDescriptor(i, o, e, t);
      }
      return u
  }
  static patchClass(t, e) {
      const r = this.superClasses && this.superClasses[t.name] || {},
          s = {},
          a = {},
          n = e(a, s);
      if ("function" != typeof n) throw new Error(`Invalid class patch for ${t.name}`);
      const i = Object.getOwnPropertyNames(class {}),
          o = Object.getOwnPropertyNames(class {}.prototype),
          l = this._applyPatch(t, n, r, i),
          u = this._applyPatch(t, n, s, o, !0);
      if (l) {
          const t = Object.getOwnPropertyDescriptors(r);
          for (const e in t) this._assignDescriptor(a, r, t[e], e);
          u && (a.$prototype = s);
      } else Object.assign(a, s);
      this.superClasses && (this.superClasses[t.name] = a);
  }
};
const t = Object.freeze(["TRUE", "ON", "1", "YES", "T", "V"]);
class e extends SteamLinkPatcher {
  static initialize(t) {
      super.initialize(t), this.fileName = void 0, this.params = {}, this.structs = new Map, this.eventListeners = new Map, this.structs.set("Dictionary", {
          name: {
              type: "string",
              defaultValue: ""
          },
          value: {
              type: "string",
              defaultValue: ""
          }
      });
  }
  static register(t = {}) {
      const e = this.loadAllParams();
      this.params = this.loadParamMap(t, e);
  }
  static loadAllParams() {
      for (const t of globalThis.$plugins) {
          if (!t || !t.status) continue;
          if (!t.description || !t.description.includes(`<pluginName:${this.pluginName}`)) continue;
          this.fileName = t.name;
          const e = new Map;
          for (const r in t.parameters) r && !r.startsWith("-") && e.set(r, t.parameters[r]);
          return e
      }
  }
  static loadParamMap(t, e) {
      const r = {};
      for (const s in t)
          if (t.hasOwnProperty(s)) try {
              r[s] = this.parseParam(s, t, e);
          } catch (t) {
              console.error(`SteamLinkEngine crashed while trying to parse a parameter value (${s}). Please report the following error to Hudell:`), console.log(t);
          }
      return r
  }
  static registerEvent(t, e) {
      this.eventListeners.has(t) || this.eventListeners.set(t, new Set);
      this.eventListeners.get(t).add(e);
  }
  static removeEventListener(t, e) {
      if (!this.eventListeners.has(t)) return;
      this.eventListeners.get(t).delete(e);
  }
  static shouldReturnCallbackResult(t, {
      abortOnTrue: e,
      abortOnFalse: r,
      returnOnValue: s
  }) {
      return !(!1 !== t || !r) || (!(!0 !== t || !e) || !(void 0 === t || !s))
  }