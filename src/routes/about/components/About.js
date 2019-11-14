import React from "react";

function About() {
   const aboutStyle = { color: "darkblue" };
   const h2Style = { textAlign: "center" };
   return (
      <div>
         <h2 style={h2Style}>
            About <span style={aboutStyle}>Let's Eat</span>
         </h2>
         <hr />
         <p>This website is designed to help you order food quick and easy.</p>
         <p>
            If you have a favourite restaurant which is not listed, please use
            the <i>Add a restaurant</i> form.
         </p>
         <br />
         <p>© 2019 Lucian Popa</p>
      </div>
   );
}

export default About;
