/**
 * @description this is config for sf interface
 * @author curry.liang
 */

import release from './release';
import debug from './development';

const Config = {
    devCode: 'BSPdevelop',
    checkword: 'j8DzkIFgmlomPt0aLuwU'
};
const env = process.env.NODE_ENV;

if(env === 'development') {
    Object.assign(Config, debug);
}
else {
    Object.assign(Config, release);
}

export default Config;