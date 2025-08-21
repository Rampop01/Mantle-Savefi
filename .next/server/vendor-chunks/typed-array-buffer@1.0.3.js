"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/typed-array-buffer@1.0.3";
exports.ids = ["vendor-chunks/typed-array-buffer@1.0.3"];
exports.modules = {

/***/ "(ssr)/../../Downloads/savefi/frontend/node_modules/.pnpm/typed-array-buffer@1.0.3/node_modules/typed-array-buffer/index.js":
/*!****************************************************************************************************************************!*\
  !*** ../../Downloads/savefi/frontend/node_modules/.pnpm/typed-array-buffer@1.0.3/node_modules/typed-array-buffer/index.js ***!
  \****************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar $TypeError = __webpack_require__(/*! es-errors/type */ \"(ssr)/../../Downloads/savefi/frontend/node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/type.js\");\n\nvar callBound = __webpack_require__(/*! call-bound */ \"(ssr)/../../Downloads/savefi/frontend/node_modules/.pnpm/call-bound@1.0.4/node_modules/call-bound/index.js\");\n\n/** @type {undefined | ((thisArg: import('.').TypedArray) => Buffer<ArrayBufferLike>)} */\nvar $typedArrayBuffer = callBound('TypedArray.prototype.buffer', true);\n\nvar isTypedArray = __webpack_require__(/*! is-typed-array */ \"(ssr)/../../Downloads/savefi/frontend/node_modules/.pnpm/is-typed-array@1.1.15/node_modules/is-typed-array/index.js\");\n\n/** @type {import('.')} */\n// node <= 0.10, < 0.11.4 has a nonconfigurable own property instead of a prototype getter\nmodule.exports = $typedArrayBuffer || function typedArrayBuffer(x) {\n\tif (!isTypedArray(x)) {\n\t\tthrow new $TypeError('Not a Typed Array');\n\t}\n\treturn x.buffer;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vRG93bmxvYWRzL3NhdmVmaS9mcm9udGVuZC9ub2RlX21vZHVsZXMvLnBucG0vdHlwZWQtYXJyYXktYnVmZmVyQDEuMC4zL25vZGVfbW9kdWxlcy90eXBlZC1hcnJheS1idWZmZXIvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsaUJBQWlCLG1CQUFPLENBQUMsK0hBQWdCOztBQUV6QyxnQkFBZ0IsbUJBQU8sQ0FBQyw4SEFBWTs7QUFFcEMsV0FBVyw0RUFBNEU7QUFDdkY7O0FBRUEsbUJBQW1CLG1CQUFPLENBQUMsMklBQWdCOztBQUUzQyxXQUFXLGFBQWE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcUkFNUE9QXFxEb3dubG9hZHNcXHNhdmVmaVxcZnJvbnRlbmRcXG5vZGVfbW9kdWxlc1xcLnBucG1cXHR5cGVkLWFycmF5LWJ1ZmZlckAxLjAuM1xcbm9kZV9tb2R1bGVzXFx0eXBlZC1hcnJheS1idWZmZXJcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyICRUeXBlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvdHlwZScpO1xuXG52YXIgY2FsbEJvdW5kID0gcmVxdWlyZSgnY2FsbC1ib3VuZCcpO1xuXG4vKiogQHR5cGUge3VuZGVmaW5lZCB8ICgodGhpc0FyZzogaW1wb3J0KCcuJykuVHlwZWRBcnJheSkgPT4gQnVmZmVyPEFycmF5QnVmZmVyTGlrZT4pfSAqL1xudmFyICR0eXBlZEFycmF5QnVmZmVyID0gY2FsbEJvdW5kKCdUeXBlZEFycmF5LnByb3RvdHlwZS5idWZmZXInLCB0cnVlKTtcblxudmFyIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJ2lzLXR5cGVkLWFycmF5Jyk7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuJyl9ICovXG4vLyBub2RlIDw9IDAuMTAsIDwgMC4xMS40IGhhcyBhIG5vbmNvbmZpZ3VyYWJsZSBvd24gcHJvcGVydHkgaW5zdGVhZCBvZiBhIHByb3RvdHlwZSBnZXR0ZXJcbm1vZHVsZS5leHBvcnRzID0gJHR5cGVkQXJyYXlCdWZmZXIgfHwgZnVuY3Rpb24gdHlwZWRBcnJheUJ1ZmZlcih4KSB7XG5cdGlmICghaXNUeXBlZEFycmF5KHgpKSB7XG5cdFx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoJ05vdCBhIFR5cGVkIEFycmF5Jyk7XG5cdH1cblx0cmV0dXJuIHguYnVmZmVyO1xufTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../../Downloads/savefi/frontend/node_modules/.pnpm/typed-array-buffer@1.0.3/node_modules/typed-array-buffer/index.js\n");

/***/ })

};
;