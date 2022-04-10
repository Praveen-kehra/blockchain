const koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const ethers = require('ethers');
const PaymentProcessor = require('../frontend/src/contracts/PaymentProcessor.json');
// console.log(JSON.parse(PaymentProcessor));
const { Payment } = require('./db.js');
// import { Payment } from '/db.js';
const items = {
    '1' : {
        id: 1, url : 'http://UrlToDownloadItem1'
    },
    '2' : {
        id: 2, url : 'http://UrlToDownloadItem2'
    }
}
const app = new koa();
const router = new Router();
router.get('/api/getPaymentId/:itemId', async ctx => {
    const paymentId = (Math.random() * 10000).toFixed(2);
    await Payment.create({
        id: paymentId,
        itemId: ctx.params.itemId,
        paid:  false
    })
    ctx.body = {
        paymentId
    };
});

router.get('/api/getItemUrl:paymentId', async ctx => {
    const payment = await Payment.findOne({id: ctx.params.paymentId});
    if(payment && payment.paid === true) {
        ctx.body = {
            url: items[payment.itemId].url
        }
    } else {
        ctx.body = {
            url: ''
        }
    }
})

app.
    use(cors())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(4000) 

const listenToEvents = () => {
    const provider= new ethers.providers.JsonRpcProvider('http://localhost:9545')
    const networkId = '5777';
    // console.log(PaymentProcessor.networks);
    const paymentProcessor = new ethers.Contract(
        {},
        PaymentProcessor.abi,
        provider
    );

    paymentProcessor.on('PaymentDone', async (payer, amount, paymentId, date) => {
        console.log(
            `from ${payer}
            amount ${amount} 
            paymentId ${paymentId}
            date ${new Date(date.toNumber()*1000).toLocaleString()}`
        );

        const payment = await Payment.findOne({id: paymentId});
        if(payment){
            payment.paid = true;
            await payment.save();
        }
    });
}
listenToEvents();