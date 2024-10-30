<template>
  <div>
      <h1>Payment Result</h1>
      <p v-if="paymentResult">Payment Result: {{ paymentResult }}</p>
  </div>
</template>

<script>
export default {
  data() {
      return {
          paymentResult: null,
      };
  },
  created() {
      // Access the query parameters
      const params = this.$route.query;
      this.processPaymentResult(params);
  },
  methods: {
      processPaymentResult(params) {
          // Extract necessary information from the params
          if (params.vnp_ResponseCode === '00') {
              this.paymentResult = 'Payment Successful';
              // Handle success logic here (e.g., updating order status)
          } else {
              this.paymentResult = 'Payment Failed';
              // Handle failure logic here
          }
          // You can also extract and use other params if needed
      }
  }
};
</script>
