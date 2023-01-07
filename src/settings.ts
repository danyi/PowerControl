import { JsonObject, JsonProperty, JsonSerializer } from 'typescript-json-serializer';
import { DEFAULT_APP } from './util';

const SETTINGS_KEY = "PowerControl";

const serializer = new JsonSerializer();

@JsonObject()
export class AppSetting {
  @JsonProperty()
  smt?: boolean;
  @JsonProperty()
  cpuNum?: number;
  @JsonProperty()
  cpuboost?: boolean;
  @JsonProperty()
  tdp?:number;
  @JsonProperty()
  tdpEnable?:boolean
  @JsonProperty()
  gpuManual?:boolean
  @JsonProperty()
  gpuFreq?:number

  hasSettings(): boolean {
    if (this.smt != undefined)
      return true;
    if (this.cpuNum != undefined)
      return true;
    if (this.cpuboost != undefined)
      return true;
    if (this.tdp != undefined)
      return true;
    if (this.tdpEnable != undefined)
      return true;
    if (this.gpuManual != undefined)
      return true;
    if (this.gpuFreq != undefined)
      return true;
    return false;
  }
}

@JsonObject()
export class Settings {
  @JsonProperty()
  enabled: boolean = true;
  @JsonProperty({ isDictionary: true, type: AppSetting })
  perApp: { [appId: string]: AppSetting } = {};

  ensureApp(appId: string): AppSetting {
    if (!(appId in this.perApp)) {
      this.perApp[appId] = new AppSetting();
    }
    return this.perApp[appId];
  }

  appSmt(appId: string): boolean {
    if (this.perApp[appId]?.smt != undefined)
      return this.perApp[appId].smt!!;
    if (this.perApp[DEFAULT_APP]?.smt != undefined)
      return this.perApp[DEFAULT_APP].smt!!;
    return true;
  }

  appCpuNum(appId: string) {
    if (this.perApp[appId]?.cpuNum != undefined)
      return this.perApp[appId].cpuNum!!;
    if (this.perApp[DEFAULT_APP]?.cpuNum != undefined)
      return this.perApp[DEFAULT_APP].cpuNum!!;
    return 4;
  }

  appCpuboost(appId: string): boolean {
    if (this.perApp[appId]?.cpuboost != undefined)
      return this.perApp[appId].cpuboost!!;
    if (this.perApp[DEFAULT_APP]?.cpuboost != undefined)
      return this.perApp[DEFAULT_APP].cpuboost!!;
    return true;
  }

  appTDP(appId: string) {
    if (this.perApp[appId]?.tdp != undefined)
      return this.perApp[appId].tdp!!;
    if (this.perApp[DEFAULT_APP]?.tdp != undefined)
      return this.perApp[DEFAULT_APP].tdp!!;
    return 15;
  }

  appTDPEnable(appId: string){
    if (this.perApp[appId]?.tdpEnable != undefined)
      return this.perApp[appId].tdpEnable!!;
    if (this.perApp[DEFAULT_APP]?.tdpEnable != undefined)
      return this.perApp[DEFAULT_APP].tdpEnable!!;
    return false;
  }

  appGPUManual(appId: string){
    if (this.perApp[appId]?.gpuManual != undefined)
      return this.perApp[appId].gpuManual!!;
    if (this.perApp[DEFAULT_APP]?.gpuManual != undefined)
      return this.perApp[DEFAULT_APP].gpuManual!!;
    return false;
  }

  appGPUFreq(appId: string){
    if (this.perApp[appId]?.gpuFreq != undefined)
      return this.perApp[appId].gpuFreq!!;
    if (this.perApp[DEFAULT_APP]?.gpuFreq != undefined)
      return this.perApp[DEFAULT_APP].gpuFreq!!;
    return 1600;
  }
}

export function loadSettingsFromLocalStorage(): Settings {
  const settingsString = localStorage.getItem(SETTINGS_KEY) || "{}";
  const settingsJson = JSON.parse(settingsString);
  const settings = serializer.deserializeObject(settingsJson, Settings);
  return settings || new Settings();
}

export function saveSettingsToLocalStorage(settings: Settings) {
  const settingsJson = serializer.serializeObject(settings) || {};
  const settingsString = JSON.stringify(settingsJson);
  localStorage.setItem(SETTINGS_KEY, settingsString);
}