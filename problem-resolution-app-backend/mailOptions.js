import nodemailer from "nodemailer"

  export var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
  auth: {
    user: 'krishnachaitanyarsbp@gmail.com',
    pass: 'kjakmdbrpvoacyuw'
  }
  });
  
  
  export const customerMailOptionsTemplate = {
    from: 'krishnachaitanyarsbp@gmail.com',
    to: '1thechandra@gmail.com',
    subject: 'Service Request Submitted',
    html: '<table style="font-family: Arial, sans-serif; width: 100%;">' +
            '<tr>' +
              '<td style="padding: 20px 0; text-align: center; background-color: #007bff;">' +
                '<h1 style="color: white; margin: 0;">Service Request Submitted</h1>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding: 20px; background-color: #f5f5f5;">' +
                '<p style="font-size: 16px;">Hi ${customerName},</p>' +
                '<p style="font-size: 16px;">We have received your service request about:</p>' +
                '<ul style="font-size: 16px; list-style-type: none; margin: 0; padding: 0;">' +
                  '<li>Model: ${modelNumber}</li>' +
                  '<li>Serial: ${serialNumber}</li>' +
                '</ul>' +
                '<p style="font-size: 16px;">We will look into it and get back to you soon.</p>' +
                '<p style="font-size: 16px;">Thank you,</p>' +
                '<p style="font-size: 16px;">Company</p>' +
                '<img src="cid:image1" style="display: block; margin: auto; width: 100px; height: auto; padding-top: 20px;">' +
              '</td>' +
            '</tr>' +
          '</table>'
  };
  
  

  //Replace your company mail here
  export var companyMailOptionsTemplate = {
    from: 'krishnachaitanyarsbp@gmail.com',
    to: '1thechandra@gmail.com',
    subject: 'New Service Request',
    html: '<table style="font-family: Arial, sans-serif; width: 100%;">' +
            '<tr>' +
              '<td style="padding: 20px 0; text-align: center; background-color: #007bff;">' +
                '<h1 style="color: white; margin: 0;">New Service Request</h1>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding: 20px; background-color: #f5f5f5;">' +
                '<p style="font-size: 16px;">We have received a new service request from ${customerName} with the following details:</p>' +
                '<ul style="font-size: 16px; list-style-type: none; margin: 0; padding: 0;">' +
                  '<li>Customer name: ${customerName}</li>' +
                  '<li>Model number: ${modelNumber}</li>' +
                  '<li>Serial number: ${serialNumber}</li>' +
                  '<li>Address: ${address}</li>' +
                  '<li>Pincode: ${pinCode}</li>' +
                '</ul>' +
                '<img src="cid:image1" alt="Embedded Image" style="display: block; margin: 20px auto; width: 100px; height: auto;">' +
              '</td>' +
            '</tr>' +
          '</table>'
  };