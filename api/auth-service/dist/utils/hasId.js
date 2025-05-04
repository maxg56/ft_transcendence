"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasId = hasId;
function hasId(value) {
    return typeof value === 'object' && value !== null && 'id' in value;
}
