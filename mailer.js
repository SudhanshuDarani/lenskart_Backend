const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'daranisudhanshu@gmail.com',
    pass: 'uccj llbt fzns kost'
  }
})
const senderOrderConfirmationEmail = (to, orderDetails, orderTitle, priceExtracted, quantitesExtracted, totalAmount) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: `Order Confirmation`,
    text: `Thank You for your order!  `,    
    html: `<html>
          <head>
          </head>
          <body>
          
            <div style=" height:40pt; background-color:#96588A; color:white; display:flex;
                      align-items:center; width:700pt ; padding-left:40pt;">
                  <h2 style="font-weight: 400;">Thank You for your order!! </h2>
            </div>
            <div style="width: 90%; height: 100%; display: block; padding:20pt;">

                <p style= "font-size: 15pt; font-weight: 500; margin-bottom: 25pt;" >
                    Your order has been received and is now being processed. Your order details show below :-
                </p>  
                <table style= "gap: 10pt; width: 60%; height: 50%; " >
                    <tr style= "gap: 5pt; width: 100%; margin-top: 25pt;" >
                        <th style= "width: 25%; height: 20pt; border: 2pt solid lightgrey;" >
                            Products
                        </th>
                        <th style= "width: 25%; height: 20pt; border: 2pt solid lightgrey;">
                            Quantity
                        </th>
                        <th style= "width: 25%; height: 20pt; border: 2pt solid lightgrey;" >
                            Price
                        </th>
                    </tr>
                    ${orderDetails.map(items =>
                        `<tr style= "height: 100%; padding: 0pt;"  >
                            <td style= "font-size: 12.5pt; font-weight: 600; text-align: center; border: 2pt solid lightgrey;" >${items.title}<br /></td>
                            <td style= "text-align: center; border: 2pt solid lightgrey;" >${items.quantity}<br /></td>
                            <td style= "text-align: center; border: 2pt solid lightgrey;" >${items.price}<br /></td>
                         </tr>`
                   )}
                </table>
                <p style= "font-size: 13pt; font-weight: 500;" >
                    Bill total amount : ₹ ${totalAmount}
                </p>
            </div>

            </body
            </html>
        `,
    
  
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent : ', info.response);
    }
  })
}

module.exports = senderOrderConfirmationEmail;