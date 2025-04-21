export interface IPaymentService {
  createPayment(userId:string,planId:string,amount:number):Promise<{approvalUrl:string;paymentId:string}>
  executePayment(paymentId:string,payerId:string):Promise<{transactionId:string}>
}