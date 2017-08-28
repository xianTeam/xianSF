const crypto = require('crypto');
import config from '../config';

/**
 * @author curry
 * abstract class of sf interface
 */
export default class Common {
    // initial config
    constructor(options) {
        this.options = Object.create(null);
        this.mixOptions(config, options);
    }
    // mix
    mixOptions(...options) {
        Object.assign(this.options, ...options);
    }
    // build xml
    buildXML(bodyStr) {
        const xml = `<Request service="OrderService" lang="zh-CN">
                        <Head>${this.options.devCode},${this.options.checkword}</Head>
                        <Body>${bodyStr}</Body>
                    </Request>`;
        return xml;
    }
    // get sign
    _getSign(xml, checkword) {
        const str = xml.trim() + checkword.trim();
        const binaryStr = Buffer.from(str);
        const sign = crypto
                    .createHash('md5')
                    .update(binaryStr)
                    .digest('base64');
        console.log(sign);
        return sign;
    }
    // create carGos
    createCargos(cargos) {
        let data = '';
        if (cargos.length > 0) {
        cargos.forEach((item) => {
            let root = '<Cargo ';
            for (const littleItem in item) {
            root = `${root}${littleItem}="${item[littleItem]}" `;
            }
            root = root + '></Cargo>';
            data = data + root;
        });
        }
        return data;
    }
}