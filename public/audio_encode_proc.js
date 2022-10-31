class MyWorkletProcessor extends AudioWorkletProcessor {

  // Static getter to define AudioParam objects in this custom processor.
  static get parameterDescriptors() {
    return [{
      name: 'codec',
      defaultValue: 'PCM'
    }];
  }

  constructor() { super(); }

  process(inputs, outputs, parameters) {
    // |myParamValues|はWeb Audioエンジンで通常のAudioParamの操作で計算された
    // 128サンプルのFloat32Array。すべてのパラメータは0.707で(automation,
    // methods, setter)がデフォルトで設置されている。
    let myParamValues = parameters.myParam;
  }
}
