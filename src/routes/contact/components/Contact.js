import React from "react";

function Contact() {
   return (
      <div>
         <div className="checkout">
            <h2>Contact us</h2>
         </div>

         <div className="contactForm">
            <form>
               <label htmlFor="name">Name</label>
               <input
                  type="text"
                  id="name"
                  name="firstname"
                  autoComplete="name"
                  placeholder="Your name.."
               />

               <label htmlFor="city">City</label>
               <select id="city" name="city">
                  <option value="Craiova">Craiova</option>
                  <option value="Brasov">Brasov</option>
                  <option value="Cluj">Cluj</option>
               </select>

               <label htmlFor="subject">Subject</label>
               <textarea
                  id="subject"
                  name="subject"
                  placeholder="Your message.."
                  style={{ height: "100px" }}
               />
               <input type="submit" value="Send" />
            </form>
            <p>
               Or send us an e-mail at
               <a
                  href="mailto:contact@letseat.com?Subject=Hello%20Letseat"
                  target="_top"
               >
                  contact@letseat.com
               </a>
            </p>
         </div>
      </div>
   );
}

export default Contact;
