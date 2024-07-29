import {SettingProps} from '../types'

export const DefaultGptModelSettings : SettingProps
= {
    temperature: 0.5,
    model: "gpt-4o-mini",
    topp: 1,
    maxtokens: 4000,
    presencePenalty: 0,
    frequencyPenalty: 0,
    historyCompression: 1000,
    sendMemory: true
}