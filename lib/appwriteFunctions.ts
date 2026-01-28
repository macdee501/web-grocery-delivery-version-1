import { Client, Functions } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const functions = new Functions(client);

export const createPaymentIntent = async (amount: number, description: string) => {
  try {
    console.log('💳 Creating payment intent...', amount);
    
    const response = await functions.createExecution(
      process.env.NEXT_PUBLIC_STRIPE_PAYMENT_FUNCTION_ID!,
      JSON.stringify({ 
        amount, 
        currency: 'zar',
        description 
      })
    );
    
    const result = JSON.parse(response.responseBody);
    console.log('✅ Payment intent created:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Payment intent error:', error);
    throw error;
  }
};

export const createOrder = async (
  paymentId: string,
  items: any[],
  userId: string,
  totalAmount: number,
  deliveryFee: number,
  discount: number
) => {
  try {
    console.log('📦 Creating order...', paymentId);
    
    const response = await functions.createExecution(
      process.env.NEXT_PUBLIC_CREATE_ORDER_FUNCTION_ID!,
      JSON.stringify({
        paymentId,
        items,
        userId,
        totalAmount,
        deliveryFee,
        discount
      })
    );
    
    const result = JSON.parse(response.responseBody);
    console.log('✅ Order created:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Order creation error:', error);
    throw error;
  }
};