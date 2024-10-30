const crypto = require('crypto');
const querystring = require('qs');
const Booking = require('../models/booking.model')
const moment = require('moment');
const config = require('../config/default.json');
const { createBooking } = require('./booking.controller');

// Hàm sắp xếp đối tượng theo thứ tự bảng chữ cái
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }

class PaymentController {
    //[POST] /payment/vnpay/create_payment_url
    async createPaymentVnpayUrl(req, res) {
        try {
          const dataBooking = req.body; // Lấy dữ liệu booking từ body request
          console.log ("dataBooking", dataBooking)
          if (!dataBooking) {
            return res.status(400).json({
              statusCode: 400,
              msg: "Thông tin booking không hợp lệ",
            });
          }
    
          let date = new Date();
          let createDate = moment(date).format("YYYYMMDDHHmmss");
    
          let ipAddr = req.headers["x-forwarded-for"];
          req.connection.remoteAddress;
          req.socket.remoteAddress || req.connection.socket.remoteAddress;
    
          let tmnCode = config.vnp_TmnCode;
          let secretKey = config.vnp_HashSecret;
          let vnpUrl = config.vnp_Url;
          let returnUrl = config.vnp_ReturnUrl;
    
          // let tmnCode = "36PE6W7U";
          // let secretKey = "4DY2B692PVWIRR1CXH3TESKUNB5M0EWZ";
          // let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
          // let returnUrl = "http://localhost:5173/payments/vnpay_return";
    
          let orderId = moment(date).format("DDHHmmss");
    
          let locale = "vn";
          let currCode = "VND";
          let vnp_Params = {};
    
          vnp_Params["vnp_Version"] = "2.1.0";
          vnp_Params["vnp_Command"] = "pay";
          vnp_Params["vnp_TmnCode"] = tmnCode;
          vnp_Params["vnp_Locale"] = locale;
          vnp_Params["vnp_CurrCode"] = currCode;
          vnp_Params["vnp_TxnRef"] = dataBooking.BookingID;
          vnp_Params["vnp_OrderInfo"] =
            "Thanh toán đặt hàng: " + dataBooking.BookingID;
          vnp_Params["vnp_OrderType"] = "Thanh toan VNPAY";
          vnp_Params["vnp_Amount"] = dataBooking.TotalPrice * 100; // Tổng giá trị booking
          vnp_Params["vnp_ReturnUrl"] = returnUrl;
          vnp_Params["vnp_IpAddr"] = ipAddr;
          vnp_Params["vnp_CreateDate"] = createDate;
    
          vnp_Params = sortObject(vnp_Params);
          console.log(vnp_Params);
          let querystring = require("qs");
          let signData = querystring.stringify(vnp_Params, { encode: false });
          let crypto = require("crypto");
          let hmac = crypto.createHmac("sha512", secretKey);
          let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
          vnp_Params["vnp_SecureHash"] = signed;
          vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    
    
          return res.status(200).json({
            statusCode: 200,
            msg: "Tạo liên kết thanh toán thành công",
            data: {
                url: vnpUrl,
              },
            });
      } catch (error) {
        console.error("Error creating payment URL", error);
      
            return res.status(500).json({
              statusCode: 500,
              msg: "Có lỗi xảy ra",
              error: error.message,
            });
          }
        }

    //[GET] /payment/vnpay/return
    async vnpayReturn(req, res) {
      try {
          let vnp_Params = req.query;
          let secureHash = vnp_Params["vnp_SecureHash"];
          delete vnp_Params["vnp_SecureHash"];
          delete vnp_Params["vnp_SecureHashType"];
  
          vnp_Params = sortObject(vnp_Params);
          let secretKey = config.vnp_HashSecret;
          let signData = querystring.stringify(vnp_Params, { encode: false });
          let hmac = crypto.createHmac("sha512", secretKey);
          let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  
          let orderId = vnp_Params["vnp_TxnRef"]; // ID đặt hàng từ VNPay
          let rspCode = vnp_Params["vnp_ResponseCode"]; // Mã phản hồi từ VNPay
  
          // Kiểm tra hash bảo mật
          if (secureHash === signed) {
              if (rspCode === "00") {
                  // Thanh toán thành công
                  // Tìm booking dựa trên BookingID và cập nhật thông tin
                  const bookingUpdate = await Booking.findOneAndUpdate(
                      {_id: orderId }, // Tìm booking bằng BookingID
                      { paid: true, payment: "Thanh toán ngân hàng" }, // Cập nhật thông tin
                      { new: true } // Trả về bản ghi đã cập nhật
                  );
  
                  if (!bookingUpdate) {
                      return res.status(404).json({
                          statusCode: 404,
                          msg: "Không tìm thấy đơn hàng để cập nhật",
                      });
                  }
  
                  return res.status(200).json({
                      statusCode: 200,
                      msg: "Đơn hàng đã được xác nhận",
                      data: {
                            BookingID: bookingUpdate.BookingID, // Đảm bảo bạn trả về trường này
                            ...bookingUpdate // Hoặc bao gồm toàn bộ dữ liệu nếu cần
                        },
                  });
              } else {
                  // Giao dịch không thành công
                  await Booking.findOneAndUpdate(
                      { BookingID: orderId },
                      { status: "cancel" },
                      { new: true }
                  );
  
                  return res.status(400).json({
                      statusCode: 400,
                      msg: "Giao dịch không thành công",
                  });
              }
          } else {
              return res.status(500).json({
                  statusCode: 500,
                  msg: "Lỗi xác thực",
              });
          }
      } catch (error) {
          return res.status(500).json({
              statusCode: 500,
              msg: "Có lỗi xảy ra",
              error: error.message,
          });
      }
  }
  
    //[GET] /payment/vnpay/ipn
    async vnpayIpn(req, res) {
        try {
          var vnp_Params = req.query;
          var secureHash = vnp_Params["vnp_SecureHash"];
    
          delete vnp_Params["vnp_SecureHash"];
          delete vnp_Params["vnp_SecureHashType"];
    
          vnp_Params = sortObject(vnp_Params);
    
          var config = require("config");
          var secretKey = config.get("vnp_HashSecret");
          var querystring = require("qs");
            var signData = querystring.stringify(vnp_Params, { encode: false });
            var crypto = require("crypto");
            var hmac = crypto.createHmac("sha512", secretKey);
            var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

      if (secureHash === signed) {
        var orderId = vnp_Params["vnp_TxnRef"];
        var rspCode = vnp_Params["vnp_ResponseCode"];

        if (rspCode === "00") {
          // Cập nhật trạng thái booking khi thanh toán thành công
          await Booking.update({
            // status: "payment",
            id: orderId,
          });
          res.status(200).json({ RspCode: "00", Message: "success" });
        } else {
          res
            .status(200)
            .json({ RspCode: "01", Message: "Transaction failed" });
        }
      } else {
        res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
      }
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        msg: "Có lỗi xảy ra",
        error: error.message,
      });
    }
  }
}
module.exports = new PaymentController(); // Xuất một thể hiện mới của PaymentController


