const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.chargeCard = async (paymentMethod, total) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      payment_method: paymentMethod.id,
      metadata: {
        user: 1,
        orderId: 2
      },
      confirm: true
    });

    return paymentIntent;
  } catch (err) {
    throw Error('Could not charge card');
  }
};
