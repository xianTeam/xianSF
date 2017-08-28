import assert from 'assert';
import PushOrder from '../src/index';


// set config options
const Config = {
    devCode: 'BSPdevelop',
    checkword: 'j8DzkIFgmlomPt0aLuwU'
};

// order data
let orderData = {
    orderInfo: {
        orderid: 'TD201708231820101',
        express_type: '2',
        j_company: '鲜盒子',
        j_contact: '梁东',
        j_tel: '13340220250',
        j_province: '浙江省',
        j_city: '杭州市',
        j_address: '滨江区信诚',
        d_company: '华赢',
        d_contact: '张三',
        d_mobile: '13618375490',
        d_tel: '17605883389',
        d_province: '河北省',
        d_city: '石家庄市',
        d_address: '小霸王学习机',
        pay_method: '1',
        custid: '5710012139' 
    }, 
    goodsInfo: {
        name: '苹果', 
        count: '1', 
        unit: '件', 
        amount: '0.0', 
        currency:'CNY' 
    }
};

// initial
const service = new PushOrder(Config);

describe('SFservice unit test', function() {
  // start test
  it('should allow pushOrder', () => {
      return service.PushOrder(orderData)
      .then(ret => {
          console.log(ret);
      });
  });
});