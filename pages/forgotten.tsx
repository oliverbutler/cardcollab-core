// @ts-nocheck
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

import PasswordCheck from "components/passwordCheck";
import Router from "next/router";
import { getToast } from "util/functions";

const forgotten = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [sentCode, setSentCode] = useState(false);

  return (
    <div className="container">
      <div className="columns is-centered is-vcentered is-mobile">
        <div className="column is-narrow">
          <h1 className="title">WIP</h1>
          <h1 className="subtitle">
            Migrating from AWS Amplify -> Our own authentication
          </h1>
        </div>
      </div>
    </div>
    // <div className="container">
    //   <div className="columns is-centered is-vcentered is-mobile">
    //     <div className="column is-narrow">
    //       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    //         {sentCode ? (
    //           <>
    //             <h1 className="title">Confirmation code sent!</h1>
    //             <h1 className="subtitle">
    //               Please enter it and your new password below
    //             </h1>
    //           </>
    //         ) : (
    //           <>
    //             <h1 className="title">Forgotten your password</h1>
    //             <h1 className="subtitle">
    //               Enter your email to change your password
    //             </h1>
    //           </>
    //         )}

    //         {!sentCode ? (
    //           <form>
    //             <div className="field">
    //               <label className="label">Email</label>
    //               <div className="control has-icons-left ">
    //                 <input
    //                   className="input"
    //                   type="email"
    //                   value={email}
    //                   onChange={(e) => setEmail(e.target.value)}
    //                 />
    //                 <span className="icon is-small is-left">
    //                   <ion-icon name="mail-outline"></ion-icon>
    //                 </span>
    //               </div>
    //             </div>

    //             <button
    //               className="button is-success"
    //               disabled={email ? false : true}
    //               onClick={(e) => {
    //                 e.preventDefault();
    //                 Auth.forgotPassword(email)
    //                   .then((res) => {
    //                     console.log(res);
    //                     setSentCode(true);
    //                     getToast().fire({
    //                       icon: "success",
    //                       title: "Sent verification code",
    //                       text: "Check your emails",
    //                     });
    //                   })
    //                   .catch((err) =>
    //                     getToast().fire({
    //                       icon: "error",
    //                       title: err.message,
    //                     })
    //                   );
    //               }}
    //             >
    //               Send Code
    //             </button>
    //           </form>
    //         ) : (
    //           <form>
    //             <div className="field">
    //               <label className="label">Enter Code</label>
    //               <div className="control has-icons-left ">
    //                 <input
    //                   className="input"
    //                   type="text"
    //                   value={code}
    //                   onChange={(e) => setCode(e.target.value)}
    //                 />
    //                 <span className="icon is-small is-left">
    //                   <ion-icon name="mail-outline"></ion-icon>
    //                 </span>
    //               </div>
    //             </div>
    //             <div className="field">
    //               <label className="label">New Password</label>
    //               <div className="control has-icons-left ">
    //                 <input
    //                   className="input"
    //                   type="password"
    //                   value={newPassword}
    //                   onChange={(e) => setNewPassword(e.target.value)}
    //                 />
    //                 <span className="icon is-small is-left">
    //                   <ion-icon name="key-outline"></ion-icon>
    //                 </span>
    //                 <motion.div
    //                   initial={{ opacity: 0 }}
    //                   animate={{ opacity: newPassword ? 1 : 0 }}
    //                   style={{ paddingTop: 5 }}
    //                 >
    //                   <PasswordCheck password={newPassword} />
    //                 </motion.div>
    //               </div>
    //             </div>
    //             {newPassword ? (
    //               <>
    //                 <div className="field">
    //                   <label className="label">New Password</label>
    //                   <div className="control has-icons-left ">
    //                     <input
    //                       className="input"
    //                       type="password"
    //                       value={newPassword2}
    //                       onChange={(e) => setNewPassword2(e.target.value)}
    //                     />
    //                     <span className="icon is-small is-left">
    //                       <ion-icon name="key-outline"></ion-icon>
    //                     </span>
    //                   </div>
    //                 </div>
    //               </>
    //             ) : (
    //               <></>
    //             )}
    //             <div className="field is-grouped">
    //               <div className="control">
    //                 <button
    //                   className="button is-success"
    //                   disabled={
    //                     !code || !newPassword || newPassword != newPassword2
    //                   }
    //                   onClick={(e) => {
    //                     e.preventDefault();
    //                     Auth.forgotPasswordSubmit(email, code, newPassword)
    //                       .then((res) => {
    //                         Router.push("/login");
    //                         getToast().fire({
    //                           icon: "success",
    //                           title: "Successfully changed your password!",
    //                         });
    //                       })
    //                       .catch((err) =>
    //                         getToast().fire({
    //                           icon: "error",
    //                           title: err.message,
    //                         })
    //                       );
    //                   }}
    //                 >
    //                   Change Password
    //                 </button>
    //               </div>
    //               <div className="control">
    //                 <button
    //                   className="button is-success is-light"
    //                   onClick={() => setSentCode(false)}
    //                 >
    //                   Go Back
    //                 </button>
    //               </div>
    //             </div>
    //           </form>
    //         )}
    //       </motion.div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default forgotten;
