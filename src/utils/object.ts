import Vue from 'vue';
import Datamodel from "@/datamodels/base/datamodel";
import MessageDM from "@/datamodels/messageDM";
import cloneDeep from 'lodash.clonedeep';
// Partial:, it can have either all key/values, or few or none

export type OmittedKeys<T, U = Partial<T>> = Extract<keyof U, String>;

// export function isEmpty(object: any): boolean {

//     if (object instanceof Datamodel) {
//         return object.isEmpty();
//     } else if (Array.isArray(object)){
//         return object.length == 0;
//     } else if (object instanceof String) {
//         if(object.length === 0) {
//             return true
//         } else {
//             return false;
//         }
//     } else if (typeof object === 'object' && object !== null && Object.keys(object).length === 0) {
//         return true;
//     } else if (object === undefined || object === null) {
//         return true
//     }

//     return false;
// }

// Use latest EMCA features to simplify logic, effective way
export function isEmpty(value: any): boolean {
    if (value instanceof Datamodel) return value.isEmpty();
    // Just case below checks for 1. undefned 2. null 3. empty string ''
    if (!value) return true;
    // Case below check for empty object {}
    if (value.constructor === Object && Object.keys(value).length === 0) return true;
    // Case below checkfs for Emprty Array []
    if (value.constructor === Array && value.length === 0) return true;
    if (value === undefined || value === null) {
        return true
    }
    return false;
}

export function isMessageDMEqual(message1: MessageDM, message2: MessageDM) {
    let isEqual = true;
    isEqual = (message1.id === message2.id) && isEqual
    if(message1.temporaryId !== null && message2.temporaryId !== null) {
        isEqual = (message1.temporaryId === message2.temporaryId) && isEqual
    }
    isEqual = (message1.content === message2.content) && isEqual
    isEqual = (message1.deleted === message2.deleted) && isEqual
    isEqual = (message1.seenAt === message2.seenAt) && isEqual
    isEqual = (message1.isSeen === message2.isSeen) && isEqual
    return isEqual
}

export function updateObject<T>(original: T, updated: Partial<T>, excludeKeys = [] as OmittedKeys<T>[]): T {

    const updatedObject = cloneDeep<T>(original);

    Object.keys(updated)
        .filter((key: string) => !key.contains(...excludeKeys) && updated[key] !== undefined)
        .forEach((activeKey: string) => {
            updatedObject[activeKey] = updated[activeKey];
        });

    return updatedObject;
}

export function updateObjectReactive<T>(original: T, updated: T, excludeKeys: (keyof T)[]) {
    Object.keys(original).forEach(key => {
        if(!excludeKeys.includes(key as keyof T)) Vue.set(original as unknown as object, key, updated[key]);
    })
    return original;
}

export function isEquivalent<T>(a: T, b: T) {
    const aProps = Object.getOwnPropertyNames(a)
    const bProps = Object.getOwnPropertyNames(b)
    if (aProps.length !== bProps.length) return false
    for (let i = 0; i < aProps.length; i++) {
        const propName = aProps[i]
        if (a[propName] !== b[propName]) {
            return false
        }
    }
    return true
}

export function getDifference<T>(original: T, updated: T) {
    const difference: {[key: string]: {old: any, new: any}} = {}
    for(const field in original) {
        if(field.includes('jsonconvert') || field.includes('__class')) continue;
        if(original[field] && updated[field] && original[field] !== updated[field]) {
            if(original[field] !== null && typeof original[field] === 'object' && !Array.isArray(original[field]) && !Array.isArray(updated[field])) {
                const objDiff = getDifference(original[field], updated[field]);
                for(const objField in objDiff) {
                    difference[field + objField.capitalize()] = objDiff[objField]
                }
            } else if (Array.isArray(original[field])) {
                let isDifferent = false;
                for (let index = 0; index < (original[field] as unknown as unknown[]).length; index++) {
                    if(original[field][index] !== updated[field][index]) isDifferent = true;
                }
                if(isDifferent) difference[field] = {old: [...original[field] as unknown as unknown[]], new: [...updated[field] as unknown as unknown[]]}
            } else {
                difference[field] = {old: original[field], new: updated[field]}
            }
        } else if((!original[field] || !updated[field]) && original[field] !== updated[field]) {
            difference[field] = {old: original[field], new: updated[field]}
        }
    }
    return difference;
}

export function createModelObject(modelName, modelClass) {
    const model = {}
    Object.keys(modelClass).forEach(item => {
      if(item.match(new RegExp(modelName,'gm'))) {
        const name = item.replace(RegExp(modelName,'gm'), '')
        const lowerCaseName = name.charAt(0).toLowerCase()+ name.slice(1)
        model[lowerCaseName] = modelClass[item]
      }
    });
    return model
}

export const hasSomeProperty = <T>(obj: T extends Object ? never : any, props: PropertyKey[]): boolean => props?.some(prop => Object.prototype.hasOwnProperty.call(obj, prop));