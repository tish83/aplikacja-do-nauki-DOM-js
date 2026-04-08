window.runUserCode = function(sourceCode, scene, documentProxy, helpers) {
  const userFn = new Function(
    "scene", "document", "helpers",
    '"use strict";\nconst window = undefined;\nconst globalThis = undefined;\nconst self = undefined;\nconst top = undefined;\nconst parent = undefined;\n' + sourceCode
  );

  return userFn(scene, documentProxy, helpers);
};