"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PlanSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    type: {
        type: String,
        enum: {
            values: ['paid', 'free'],
            message: '{VALUE} is not a valid type'
        },
        required: false
    },
    description: { type: String, required: true },
    regularAmount: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    benefits: { type: [String], required: true },
    isListed: { type: Boolean, default: true },
    duration: {
        type: String,
        enum: {
            values: ['1 month', '3 months', '6 months', '9 months', '12 months'],
            message: '{VALUE} is not a valid duration'
        },
        required: false
    },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    roomBenefit: {
        type: Number, required: [false, 'Room benefit is required'], min: [0, 'Room benefit cannot be negative'], max: [20, 'Room benefit cannot exceed 20']
    }
});
exports.Plan = mongoose_1.default.model('Plan', PlanSchema);
