/** 哈脊米统一动作状态定义 */
export const STATES = {
  healthy: { label: '健康', frames: 4, method: 'healthy' },
  forward: { label: '前倾', frames: 3, method: 'forward' },
  explore: { label: '探倾', frames: 4, method: 'explore' },
  hunched: { label: '低头驼背', frames: 3, method: 'hunched' },
  headLeft: { label: '头偏左', frames: 3, method: 'headLeft' },
  headRight: { label: '头偏右', frames: 3, method: 'headRight' },
  tiltLeft: { label: '左歪头', frames: 4, method: 'tiltLeft' },
  tiltRight: { label: '右歪头', frames: 4, method: 'tiltRight' },
  unevenShoulders: { label: '肩不平', frames: 3, method: 'unevenShoulders' },
  longSit: { label: '久坐', frames: 4, method: 'longSit' },
  happy: { label: '开心', frames: 4, method: 'happy' },
  tired: { label: '疲惫', frames: 3, method: 'tired' },
};

export const STATE_KEYS = Object.keys(STATES);
