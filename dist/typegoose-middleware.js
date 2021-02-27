"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypegooseMiddleware = void 0;
const mongoose_1 = require("mongoose");
const typegoose_1 = require("@typegoose/typegoose");
const TypegooseMiddleware = (_, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield next();
    if (Array.isArray(result)) {
        return result.map((item) => item instanceof mongoose_1.Model ? convertDocument(item) : item);
    }
    if (result instanceof mongoose_1.Model) {
        return convertDocument(result);
    }
    return result;
});
exports.TypegooseMiddleware = TypegooseMiddleware;
function convertDocument(doc) {
    const convertedDocument = doc.toObject();
    const DocumentClass = typegoose_1.getClassForDocument(doc);
    Object.setPrototypeOf(convertedDocument, DocumentClass.prototype);
    return convertedDocument;
}
//# sourceMappingURL=typegoose-middleware.js.map