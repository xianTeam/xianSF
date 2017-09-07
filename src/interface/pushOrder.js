import Common from './common';
import request from 'request';
import config from '../config';
import xml2js from 'xml2js';

const queryString = require('query-string');

/**
 * @description pushOrder interface of SF
 * @request body
 * @example // this is simplest request demo,if you require another services,please see https://open.sf-express.com/
 *  <Order  
        orderid="GO647081283711545"
        express_type="2"
        j_company="测试" 
        j_contact="测试"
        j_tel="15021584043" 
        j_province="浙江省"
        j_city="杭州市"
        j_address="浙江省杭州市拱墅区浙江省杭州市拱墅区登云路" 
        d_company="测" 
        d_contact="测" 
        d_mobile="" 
        d_tel="*****" 
        d_province="河北省" 
        d_city="石家庄市" 
        d_address="河北省石家庄市长安区什么什么路"  
        pay_method="1"   
        custid="5710012139"  > // custid 开发调试的时候可以不传，或者填申请来的id
        <Cargo name="衣服" count="1" unit="件" amount="0.0" currency="CNY"/>
    </Order>
 */

export default class PushOrder extends Common {
    // super father props
    constructor(props) {
        super(props);
    }
    // prepare str data
    /** 参数说明
     * @example
        // data = {
            // params: {
            //     orderid: 'TD201708231820101',
            //     express_type: '2',
            //     j_company: '鲜盒子',
            //     j_contact: '梁东东',
            //     j_tel: '13340220251',
            //     j_province: '浙江省',
            //     j_city: '杭州市',
            //     j_address: '滨江区信诚路33号',
            //     d_company: '华赢贷',
            //     d_contact: '张三',
            //     d_mobile: '13618375495',
            //     d_tel: '17605883346',
            //     d_province: '河北省',
            //     d_city: '石家庄市',
            //     d_address: '小霸王学习机',
            //     pay_method: '1',
            //     custid: '5710012139' // 可以不填写或者用自己公司的（月结账号）
            // }, cargos: [{
                name: '苹果', 
                count: '1', 
                unit: '件', 
                amount: '0.0', 
                currency:'CNY' 
            // }]

     * }
    */
    getStr(data) {
        const { params, cargos } = data;
        let order = '<Order ';
        for (const item in params) {
            order = `${order}${item}="${params[item]}" `;
        }
        if (cargos.length > 0) {
            order = order.trim() + '>';
            order = order + this.createCargos(cargos);
            order = order + '</Order>';
        } else {
            order = order + ' />';
        }
        const xml = this.buildXML(order);
        // console.log(this.options);
        const sign = this._getSign(xml, this.options.checkword);
        return queryString.stringify({ xml, verifyCode: sign });
    }
    // push order with sf interface
    makeRequest(orderData) {
        const url = this.options.url;
        const formData = this.getStr(orderData);
        return new Promise((resolve, reject) => {
            request({
                headers: {
                    'charset': 'UTF-8',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                uri: url,
                body: formData,
                method: 'POST'
            }, function (err, res, body) {
                if(err) {
                    reject(err);
                } else {
                    const parser = new xml2js.Parser({ trim: true, explicitArray: false, explicitRoot: false });
                    parser.parseString(body, (error, result) => {
                        // console.log(err, result);
                        if (!err) {
                            if (result.Head === 'OK') {
                                const obj = result.Body.OrderResponse.$;
                                resolve(obj);
                            } else {
                                const obj = { message: 'ERR' };
                                obj.result = result;
                                resolve(obj);
                            }
                        } else {
                            reject(error);
                        }
                    });
                }
            });
        });
    }
    // make request
    pushOrder(orderData, options = {}) {
        this.mixOptions(config.sfPushOrder, options);
        // can process request order here
        return this.makeRequest(orderData);
    }
} 